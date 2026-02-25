"use client";

import { useState } from "react";

interface PaymentModalProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onClose: () => void;
}

export default function PaymentModal({
  amount,
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError("");

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "PAID") {
        throw new Error(data.error || "Payment failed");
      }

      if (!data.transactionId) {
        throw new Error("Transaction ID missing");
      }

      onSuccess(data.transactionId);

    } catch (err: any) {
      setError(err.message || "Payment error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[400px] text-center">

        <h2 className="text-xl font-bold mb-4">
          Tournament Entry Fee
        </h2>

        <p className="text-gray-600 mb-6">
          Amount to Pay: <span className="font-semibold">₹{amount}</span>
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          {processing ? "Processing Payment..." : "Pay Now"}
        </button>

        <button
          onClick={onClose}
          disabled={processing}
          className="mt-4 text-gray-500 text-sm hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}