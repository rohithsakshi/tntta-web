"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PaymentModal from "@/components/PaymentModal";
import Popup from "@/components/Popup";

type Category = {
  id: number;
  name: string;
  ageMin: number;
  ageMax: number;
};

const categories: Category[] = [
  { id: 1, name: "Mini Cadet", ageMin: 0, ageMax: 10 },
  { id: 2, name: "Cadet", ageMin: 11, ageMax: 12 },
  { id: 3, name: "Sub Junior", ageMin: 13, ageMax: 14 },
  { id: 4, name: "Junior", ageMin: 15, ageMax: 17 },
  { id: 5, name: "Senior", ageMin: 18, ageMax: 39 },
  { id: 6, name: "Veteran", ageMin: 40, ageMax: 100 },
];

export default function TournamentRegisterPage() {
  const router = useRouter();
  const params = useParams();
  const tournamentId = params.id as string;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [district, setDistrict] = useState("");
  const [contact, setContact] = useState("");
  const [coach, setCoach] = useState("");
  const [club, setClub] = useState("");
  const [eligibleCategories, setEligibleCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [redirectAfterClose, setRedirectAfterClose] = useState(false);

  /* ---------------------------
     Check Login
  --------------------------- */
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/login");
      return;
    }
    setFirstName(user);
  }, [router]);

  /* ---------------------------
     Age Calculation
  --------------------------- */
  useEffect(() => {
    if (!dob) return;

    const birth = new Date(dob);
    const today = new Date();
    const calculatedAge =
      today.getFullYear() -
      birth.getFullYear() -
      (today <
      new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
        ? 1
        : 0);

    setAge(calculatedAge);

    const filtered = categories.filter(
      (cat) =>
        calculatedAge >= cat.ageMin &&
        calculatedAge <= cat.ageMax
    );

    setEligibleCategories(filtered);
  }, [dob]);

  /* ---------------------------
     Submit → Open Payment
  --------------------------- */
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShowPayment(true);
  };

  /* ---------------------------
     After Payment Success
  --------------------------- */
  const handlePaymentSuccess = async (transactionId: string) => {
    setShowPayment(false);
    setLoading(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId,
          playerName: firstName,
          lastName,
          gender,
          dob,
          district,
          contact,
          coach,
          club,
          category: selectedCategory,
          paymentStatus: "PAID",
          transactionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPopupMessage(data.error || "Application failed");
        setRedirectAfterClose(false);
        setLoading(false);
        return;
      }

      setPopupMessage("Payment Successful! Application Submitted!");
      setRedirectAfterClose(true);

    } catch {
      setPopupMessage("Server error. Please try again.");
      setRedirectAfterClose(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-10">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">
          Tournament Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            value={firstName}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          {age !== null && (
            <p className="text-sm text-gray-600">
              Calculated Age: {age}
            </p>
          )}

          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border p-3 rounded"
            required
          />

          <input
            type="text"
            placeholder="Coach Name"
            value={coach}
            onChange={(e) => setCoach(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="text"
            placeholder="Club Name"
            value={club}
            onChange={(e) => setClub(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select Category</option>
            {eligibleCategories.map((cat) => (
              <option key={cat.id}>{cat.name}</option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600"
          >
            {loading ? "Processing..." : "Submit Application"}
          </button>
        </form>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={500}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}

      {/* Popup */}
      {popupMessage && (
        <Popup
          message={popupMessage}
          onClose={() => {
            setPopupMessage("");
            if (redirectAfterClose) {
              router.push("/tournaments");
            }
          }}
        />
      )}
    </div>
  );
}