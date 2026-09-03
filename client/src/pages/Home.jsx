import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrescriptionUpload from "../components/PrescriptionUpload";
import MedicineStatusList from "../components/MedicineStatusList";
import { generateToken } from "../api/api";

export default function Home() {
  const [prescription, setPrescription] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const hasAvailableItems = prescription?.extractedItems?.some((i) => i.available);

  async function handleGenerateToken() {
    setGenerating(true);
    setError("");
    try {
      const { data } = await generateToken(prescription._id);
      navigate(`/token/${data.token._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not generate a token.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">MediFlow AI</h1>
        <p className="text-gray-500 text-sm">
          Scan your prescription — we'll only queue you for medicines that are actually in stock.
        </p>
      </header>

      <PrescriptionUpload onProcessed={setPrescription} />

      {prescription && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Detected Medicines</h2>
          <MedicineStatusList items={prescription.extractedItems} />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleGenerateToken}
            disabled={!hasAvailableItems || generating}
            className="w-full sm:w-auto bg-gray-900 hover:bg-black disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            {generating ? "Generating token…" : "Generate Smart Token"}
          </button>
          {!hasAvailableItems && (
            <p className="text-xs text-gray-400">
              No token can be generated — none of the detected medicines are currently in stock.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
