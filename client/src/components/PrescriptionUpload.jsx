import React, { useState } from "react";
import { uploadPrescription } from "../api/api";

/**
 * Upload form: patient uploads a prescription photo, we send it to
 * the backend for OCR + medicine matching, and hand the resulting
 * prescription (with extracted items) back to the parent page.
 */
export default function PrescriptionUpload({ onProcessed }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a prescription image first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("prescriptionImage", file);
      formData.append("patientName", patientName);
      formData.append("patientPhone", patientPhone);

      const { data } = await uploadPrescription(formData);
      onProcessed(data.prescription);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while processing the prescription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Upload Prescription</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Patient Name</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
          <input
            type="tel"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Prescription Image</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:font-medium hover:file:bg-brand-100"
        />
      </div>

      {preview && (
        <img src={preview} alt="Prescription preview" className="max-h-56 rounded-lg border border-gray-100 object-contain" />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-medium px-5 py-2.5 rounded-lg transition"
      >
        {loading ? "Scanning prescription…" : "Scan & Check Availability"}
      </button>
    </form>
  );
}
