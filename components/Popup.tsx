"use client";
import { useEffect } from "react";

interface PopupProps {
  message: string;
  onClose: () => void;
}

export default function Popup({ message, onClose }: PopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      
      {/* Transparent dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Glass popup */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 
                      rounded-2xl shadow-2xl px-8 py-6 text-white 
                      animate-fadeIn scale-100">
        <h2 className="text-lg font-semibold text-center">
          {message}
        </h2>

        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 
                       rounded-full text-sm font-medium transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}