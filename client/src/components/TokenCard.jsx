import React from "react";

/**
 * The "smart token" the patient walks away with — counter number,
 * predicted wait, and a clear list of what won't be handed out.
 */
export default function TokenCard({ token }) {
  if (!token) return null;

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-2xl shadow-md p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-brand-100 text-xs uppercase tracking-wide">Your Token</p>
          <p className="text-3xl font-bold tracking-tight">{token.tokenNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-brand-100 text-xs uppercase tracking-wide">Counter</p>
          <p className="text-3xl font-bold">{token.counterNumber}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div>
          <p className="text-brand-100">Queue Position</p>
          <p className="font-semibold text-lg">#{token.queuePosition}</p>
        </div>
        <div>
          <p className="text-brand-100">Estimated Wait</p>
          <p className="font-semibold text-lg">{token.estimatedWaitMinutes} min</p>
        </div>
        <div>
          <p className="text-brand-100">Status</p>
          <p className="font-semibold text-lg capitalize">{token.status}</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-3">
        <p className="text-xs text-brand-100 mb-1">Items to collect at counter {token.counterNumber}</p>
        <ul className="text-sm space-y-0.5">
          {token.items.map((it, i) => (
            <li key={i}>• {it.name}</li>
          ))}
        </ul>
      </div>

      {token.unavailableItems?.length > 0 && (
        <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3">
          <p className="text-xs text-red-100 mb-1">Not included (out of stock)</p>
          <ul className="text-sm space-y-0.5">
            {token.unavailableItems.map((it, i) => (
              <li key={i}>• {it.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
