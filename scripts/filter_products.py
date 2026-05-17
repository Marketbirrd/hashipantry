import csv
import json
import re
import glob
import os
from urllib.parse import unquote, urlparse, parse_qs, quote_plus

AMAZON_ASSOCIATE_TAG = "hashipantry07-20"

AMAZON_IMAGE_DOMAINS = {"m.media-amazon.com", "images-na.ssl-images-amazon.com", "images-fe.ssl-images-amazon.com"}
THRIVE_IMAGE_DOMAINS = {"d2d8wwwkmhfcva.cloudfront.net", "img.thrivemarket.com", "d2lnr5mha7bycj.cloudfront.net"}

def get_source(image_url: str):
    """Return 'AMAZON', 'THRIVE', or None if not from a known retailer."""
    try:
        domain = urlparse(image_url).netloc
    except Exception:
        return None
    if domain in AMAZON_IMAGE_DOMAINS:
        return "AMAZON"
    if domain in THRIVE_IMAGE_DOMAINS:
        return "THRIVE"
    return None

DISQUALIFIERS = [
    "soy protein isolate", "soy protein concentrate", "soy flour",
    "wheat flour", "wheat starch", "wheat gluten", "gluten",
    "canola oil", "vegetable oil", "cottonseed oil", "corn oil",
    "soybean oil", "sunflower oil",
    "high fructose corn syrup", "hfcs",
    "carrageenan",
    "monosodium glutamate", " msg",
    "artificial color", "artificial colour", "artificial flavour", "artificial flavor",
    "red 40", "yellow 5", "yellow 6", "blue 1", "blue 2",
    "sodium nitrate", "sodium nitrite",
    "brominated vegetable oil", "bvo",
    "potassium bromate",
    "propyl gallate",
    "tbhq", "bha", "bht",
    "acesulfame", "aspartame",
    "maltodextrin",
]

BAD_COMPLIANCE = [
    "is not Gluten Free",
    "contains Soy",
    "contains Wheat",
    "contains Gluten",
]

def decode_image_url(raw_url):
    if "/_next/image" in raw_url:
        try:
            qs = parse_qs(urlparse("https://x.com" + raw_url).query)
            if "url" in qs:
                return unquote(qs["url"][0])
        except Exception:
            pass
    if raw_url.startswith("http"):
        return raw_url
    return ""

def clean_name(raw_name):
    return re.sub(r"^Ingredient List:\s*", "", raw_name).strip()

def is_hashi_friendly(ingredients_text, compliance_text):
    ingredients_lower = ingredients_text.lower()
    for bad in DISQUALIFIERS:
        if bad in ingredients_lower:
            return False, bad
    for phrase in BAD_COMPLIANCE:
        if phrase in compliance_text:
            return False, phrase
    if "This product is likely Gluten Free" not in compliance_text and \
       "Is it Gluten Free?" in compliance_text:
        gluten_section = compliance_text.split("Is it Gluten Free?")[1][:200]
        if "not Gluten Free" in gluten_section or "ingredientswith Gluten" in gluten_section:
            return False, "not gluten free per compliance"
    return True, None

def extract_diet_tags(compliance_text):
    tags = []
    if "This product is likely Gluten Free" in compliance_text:
        tags.append("Gluten Free")
    if "This product is likely Soy Free" in compliance_text:
        tags.append("Soy Free")
    if "This product is likely Dairy Free" in compliance_text:
        tags.append("Dairy Free")
    if "This product is likely Egg Free" in compliance_text:
        tags.append("Egg Free")
    if "This product is likely Paleo" in compliance_text:
        tags.append("Paleo")
    if "Is it Paleo?" in compliance_text:
        paleo_section = compliance_text.split("Is it Paleo?")[1][:100]
        if "is likely Paleo" in paleo_section and "Paleo" not in tags:
            tags.append("Paleo")
    if "Is it Vegan?" in compliance_text and "is likely Vegan" in compliance_text:
        tags.append("Vegan")
    if "Is it AIP Friendly?" in compliance_text and "is likely AIP Friendly" in compliance_text:
        tags.append("AIP")
    if "Is it Low Histamine?" in compliance_text:
        hist_section = compliance_text.split("Is it Low Histamine?")[1][:100]
        if "is likely Low Histamine" in hist_section:
            tags.append("Low Histamine")
    if "Is it Grain Free?" in compliance_text:
        grain_section = compliance_text.split("Is it Grain Free?")[1][:100] if "Is it Grain Free?" in compliance_text else ""
        if "is likely Grain Free" in grain_section:
            tags.append("Grain Free")
    if "Is it Seed Oil Free?" in compliance_text:
        seed_section = compliance_text.split("Is it Seed Oil Free?")[1][:100]
        if "is likely Seed Oil Free" in seed_section:
            tags.append("No Seed Oils")
    if "Is it Nut Free?" in compliance_text:
        nut_section = compliance_text.split("Is it Nut Free?")[1][:100] if "Is it Nut Free?" in compliance_text else ""
        if "is likely Nut Free" in nut_section:
            tags.append("Nut Free")
    return list(set(tags)) if tags else ["Gluten Free"]

def get_category(name, ingredients):
    name_lower = name.lower()
    if any(w in name_lower for w in ["oil", "butter", "fat", "ghee", "lard", "tallow"]):
        return "Oils & Fats"
    if any(w in name_lower for w in ["flour", "starch", "baking", "mix", "powder", "arrowroot", "tapioca"]):
        return "Flours & Baking"
    if any(w in name_lower for w in ["chip", "cracker", "snack", "bar", "bite", "cookie", "jerky", "popcorn", "pork rind"]):
        return "Snacks"
    if any(w in name_lower for w in ["sauce", "dressing", "vinegar", "mustard", "ketchup", "mayo", "aminos", "tamari", "marinade", "salsa", "relish"]):
        return "Condiments"
    if any(w in name_lower for w in ["tea", "coffee", "drink", "juice", "water", "beverage", "kombucha", "brew", "soda", "sparkling"]):
        return "Beverages"
    if any(w in name_lower for w in ["collagen", "probiotic", "vitamin", "supplement", "magnesium", "zinc", "selenium", "ashwagandha"]):
        return "Supplements"
    return "Pantry Staples"

public_dir = r"C:\Users\Wendy C\Desktop\HashiPantry\hashipantry\public"
# Output as JSON for API-based serving (too large for static TS import)
output_json = r"C:\Users\Wendy C\Desktop\HashiPantry\hashipantry\public\products.json"
# Keep a small TS stub for type exports only
output_ts = r"C:\Users\Wendy C\Desktop\HashiPantry\hashipantry\lib\products-data.ts"

csv_files = sorted(glob.glob(os.path.join(public_dir, "*.csv")))
print(f"Found {len(csv_files)} CSV files")

approved = []
rejected_count = 0
seen_names = set()

for csv_path in csv_files:
    fname = os.path.basename(csv_path)
    file_approved = 0
    file_rejected = 0

    try:
        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                url = row.get("Origin URL", "").strip()
                raw_name = row.get("Product Name", "").strip()
                raw_image = row.get("Product Image", "").strip()
                ingredients = row.get("Ingredients List", "").strip()
                compliance = row.get("Allergens", "").strip()

                if not raw_name or not ingredients:
                    continue

                name = clean_name(raw_name)

                if name.lower() in seen_names:
                    continue

                image_url = decode_image_url(raw_image)
                friendly, reason = is_hashi_friendly(ingredients, compliance)

                if friendly:
                    source = get_source(image_url)
                    if source is None:
                        rejected_count += 1
                        file_rejected += 1
                        continue  # skip non-Amazon/Thrive products

                    diet_tags = extract_diet_tags(compliance)
                    category = get_category(name, ingredients)
                    seen_names.add(name.lower())

                    if source == "AMAZON":
                        affiliate_url = f"https://www.amazon.com/s?k={quote_plus(name)}&tag={AMAZON_ASSOCIATE_TAG}"
                    else:
                        # Thrive Market — link to their search
                        affiliate_url = f"https://thrivemarket.com/search?q={quote_plus(name)}"

                    approved.append({
                        "id": str(len(approved) + 1),
                        "name": name,
                        "description": ingredients[:200].split(",")[0].strip() + ".",
                        "imageUrl": image_url,
                        "affiliateUrl": affiliate_url,
                        "source": source,
                        "category": category,
                        "dietTags": diet_tags,
                        "featured": len(approved) < 4,
                    })
                    file_approved += 1
                else:
                    rejected_count += 1
                    file_rejected += 1
    except Exception as e:
        print(f"  ERROR reading {fname}: {e}")
        continue

    print(f"  {fname}: +{file_approved} approved, {file_rejected} rejected")

# Write full product list as JSON (served via API route, not bundled)
with open(output_json, "w", encoding="utf-8") as f:
    json.dump(approved, f)

# Write TS file with just the type + a small featured slice for SSR homepage
featured = [p for p in approved if p["featured"]][:8]
ts_content = f"""// Auto-generated type definitions. Full product data is in public/products.json
// Served via /api/products for paginated/filtered access.

export type Product = {{
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  affiliateUrl: string;
  source: "AMAZON" | "THRIVE";
  category: string;
  dietTags: string[];
  featured: boolean;
  asin?: string;
}};

// Small featured slice used for the homepage SSR only
export const FEATURED_PRODUCTS: Product[] = {json.dumps(featured, indent=2)};
"""

with open(output_ts, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"\nTotal approved: {len(approved)} products")
print(f"Total rejected: {rejected_count} products")
print(f"JSON output: {output_json}")
print(f"TS type file: {output_ts}")
