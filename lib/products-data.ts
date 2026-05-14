// Auto-generated type definitions. Full product data is in public/products.json
// Served via /api/products for paginated/filtered access.

export type Product = {
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
};

// Small featured slice used for the homepage SSR only
export const FEATURED_PRODUCTS: Product[] = [
  {
    "id": "1",
    "name": "Lifeseasons Immuni-T Immune Support",
    "description": "Hypromellose (vegetable cellulose).",
    "imageUrl": "https://d2d8wwwkmhfcva.cloudfront.net/1200x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_34cac85b-c6e9-496f-aabf-9b9f2a449fd6.png",
    "affiliateUrl": "https://thrivemarket.com/search?q=Lifeseasons+Immuni-T+Immune+Support",
    "source": "THRIVE",
    "category": "Pantry Staples",
    "dietTags": [
      "Vegan",
      "Egg Free",
      "No Seed Oils",
      "Dairy Free",
      "Soy Free",
      "Gluten Free"
    ],
    "featured": true
  },
  {
    "id": "2",
    "name": "Solely Fruit Jerky, Organic, Pineapple",
    "description": "Organic pineapple..",
    "imageUrl": "https://d2d8wwwkmhfcva.cloudfront.net/1200x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_9cd4574c-08cf-4c8f-9103-e48ca879f836.jpg",
    "affiliateUrl": "https://thrivemarket.com/search?q=Solely+Fruit+Jerky%2C+Organic%2C+Pineapple",
    "source": "THRIVE",
    "category": "Snacks",
    "dietTags": [
      "AIP",
      "Paleo",
      "Vegan",
      "Egg Free",
      "No Seed Oils",
      "Dairy Free",
      "Soy Free",
      "Gluten Free"
    ],
    "featured": true
  },
  {
    "id": "3",
    "name": "Walden Farms Vinaigrette, Balsamic",
    "description": "Water.",
    "imageUrl": "https://d2d8wwwkmhfcva.cloudfront.net/1200x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_e0dbe7f0-bb6e-4227-a67c-40190bba3b90.jpg",
    "affiliateUrl": "https://thrivemarket.com/search?q=Walden+Farms+Vinaigrette%2C+Balsamic",
    "source": "THRIVE",
    "category": "Pantry Staples",
    "dietTags": [
      "No Seed Oils"
    ],
    "featured": true
  },
  {
    "id": "4",
    "name": "Nature'S Way Vitamin C",
    "description": "Gelatin (capsule).",
    "imageUrl": "https://d2d8wwwkmhfcva.cloudfront.net/1200x/filters:fill(FFF,true):format(jpg)/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_7218c487-101c-4028-9cf6-d01d2009f5cd.png",
    "affiliateUrl": "https://thrivemarket.com/search?q=Nature%27S+Way+Vitamin+C",
    "source": "THRIVE",
    "category": "Supplements",
    "dietTags": [
      "Paleo",
      "Egg Free",
      "No Seed Oils",
      "Dairy Free",
      "Soy Free",
      "Gluten Free"
    ],
    "featured": true
  }
];
