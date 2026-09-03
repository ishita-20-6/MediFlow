import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TokenStatus from "./pages/TokenStatus";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/token/:id" element={<TokenStatus />} />
      </Routes>
    </div>
  );
}
