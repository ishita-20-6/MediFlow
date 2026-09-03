import React from "react";

/**
 * Shows each medicine line extracted from OCR with its availability
 * status — the core "don't queue for what isn't there" moment.
 */
export default function MedicineStatusList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">No medicines were detected on this prescription.</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {items.map((item, idx) => (
        <li key={idx} className="py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-800">
              {item.matchedMedicineName || item.rawText}
            </p>
            {item.matchedMedicineName && (
              <p className="text-xs text-gray-400">
                Detected from: "{item.rawText}" · match confidence {Math.round((item.confidence || 0) * 100)}%
              </p>
            )}
            {!item.matchedMedicineName && (
              <p className="text-xs text-gray-400">Not recognized in catalog</p>
            )}
          </div>

          {item.available ? (
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Available ({item.stockQuantity} in stock)
            </span>
          ) : (
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 text-xs font-medium px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Unavailable
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
