import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TokenCard from "../components/TokenCard";
import { getToken } from "../api/api";

/**
 * Polls the token every 15s so the patient's queue position and wait
 * estimate stay live without a manual refresh.
 */
export default function TokenStatus() {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;
    async function load() {
      try {
        const { data } = await getToken(id);
        setToken(data.token);
      } catch (err) {
        setError("Could not load this token.");
      }
    }
    load();
    interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      <Link to="/" className="text-sm text-brand-600 hover:underline">← Scan another prescription</Link>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {token ? <TokenCard token={token} /> : !error && <p className="text-sm text-gray-500">Loading token…</p>}
    </div>
  );
}
