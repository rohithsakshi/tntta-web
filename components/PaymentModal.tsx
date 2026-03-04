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

  setProcessing(true);

  setTimeout(() => {

    const fakeTxn =
      "TXN" + Math.floor(Math.random() * 1000000000);

    onSuccess(fakeTxn);

    setProcessing(false);

  }, 1500);
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