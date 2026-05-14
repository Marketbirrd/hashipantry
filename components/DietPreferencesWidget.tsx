"use client";

import { useEffect, useState } from "react";

const MUST_EXCLUDE = ["Gluten Free", "Dairy Free", "Soy Free", "Egg Free", "Nut Free"];
const STRICT_PROTOCOLS = ["AIP Compliant (Autoimmune Protocol)", "Paleo", "Vegan / Plant Based"];
const SPECIFIC_LIMITS = ["Grain Free", "Sugar Free / Low Sugar", "Low FODMAP", "No Seed Oils", "Low Histamine"];

const STORAGE_KEY = "hashi-diet-prefs";

export default function DietPreferencesWidget() {
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setSelected(JSON.parse(stored));
  }, []);

  const toggle = (pref: string) =>
    setSelected((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reset = () => {
    setSelected([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-sage-pale shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-sage-pale">
        <div>
          <p className="text-sm font-semibold text-forest">Current Preferences</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selected.length === 0 ? (
              <span className="text-xs text-forest/40">None set</span>
            ) : (
              selected.map((p) => (
                <span
                  key={p}
                  className="text-xs bg-sage-pale text-forest px-2 py-0.5 rounded-full"
                >
                  {p}
                </span>
              ))
            )}
          </div>
        </div>
        <span className="text-xs text-forest/40 shrink-0">
          Last updated: {selected.length > 0 ? "just now" : "Not set"}
        </span>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5">
        <div>
          <p className="text-xs font-semibold text-forest mb-1">Must Exclude Allergens</p>
          <p className="text-xs text-forest/50 mb-3">The most critical, non-negotiable items.</p>
          <div className="space-y-2">
            {MUST_EXCLUDE.map((pref) => (
              <label key={pref} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected.includes(pref)}
                  onChange={() => toggle(pref)}
                  className="w-4 h-4 rounded border-sage accent-forest cursor-pointer"
                />
                <span className="text-sm text-forest/80 group-hover:text-forest">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-forest mb-1">Strict Protocols</p>
          <p className="text-xs text-forest/50 mb-3">These checkboxes instantly exclude the most products.</p>
          <div className="space-y-2">
            {STRICT_PROTOCOLS.map((pref) => (
              <label key={pref} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected.includes(pref)}
                  onChange={() => toggle(pref)}
                  className="w-4 h-4 rounded border-sage accent-forest cursor-pointer"
                />
                <span className="text-sm text-forest/80 group-hover:text-forest">{pref}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-forest mb-1">Specific Limits</p>
          <p className="text-xs text-forest/50 mb-3">These often overlap with protocols but are good to have separate.</p>
          <div className="space-y-2">
            {SPECIFIC_LIMITS.map((pref) => (
              <label key={pref} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected.includes(pref)}
                  onChange={() => toggle(pref)}
                  className="w-4 h-4 rounded border-sage accent-forest cursor-pointer"
                />
                <span className="text-sm text-forest/80 group-hover:text-forest">{pref}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 px-5 pb-5">
        <button
          onClick={reset}
          className="px-4 py-2 text-sm text-forest/60 border border-sage-pale rounded-lg hover:bg-cream transition-colors"
        >
          Reset To Defaults
        </button>
        <button
          onClick={save}
          className="px-5 py-2 text-sm bg-forest text-white rounded-lg hover:bg-forest-light transition-colors font-medium"
        >
          {saved ? "Saved!" : "Update Preferences"}
        </button>
      </div>
    </div>
  );
}
