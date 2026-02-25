"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PaymentModal from "@/components/PaymentModal";
import Popup from "@/components/Popup";

type Category = {
  name: string;
  ageMin: number;
  ageMax: number;
};

const categories: Category[] = [
  { name: "Mini Cadet", ageMin: 0, ageMax: 10 },
  { name: "Cadet", ageMin: 11, ageMax: 12 },
  { name: "Sub Junior", ageMin: 13, ageMax: 14 },
  { name: "Junior", ageMin: 15, ageMax: 17 },
  { name: "Senior", ageMin: 18, ageMax: 39 },
  { name: "Mens", ageMin: 18, ageMax: 100 },
  { name: "Veterans", ageMin: 40, ageMax: 100 },
];

const tamilNaduDistricts = [
  "Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore",
  "Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram",
  "Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai",
  "Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai",
  "Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi",
  "Thanjavur","Theni","Thoothukudi","Tiruchirappalli",
  "Tirunelveli","Tirupathur","Tiruppur","Tiruvallur",
  "Tiruvannamalai","Tiruvarur","Vellore","Viluppuram",
  "Virudhunagar"
].sort();

const clubs = [
  "SKJ Sports Club",
  "Madurai TT Academy",
  "Coimbatore Smashers"
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    district: "",
    contact: "",
    club: "",
    category: "",
    password: "",
    confirmPassword: "",
  });

  const [age, setAge] = useState<number | null>(null);
  const [eligibleCategories, setEligibleCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  /* ---------------------------
     Age Calculation
  --------------------------- */
  useEffect(() => {
    if (!form.dob) {
      setAge(null);
      setEligibleCategories([]);
      setForm((prev) => ({ ...prev, category: "" }));
      return;
    }

    const birth = new Date(form.dob);
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

    if (!filtered.some((c) => c.name === form.category)) {
      setForm((prev) => ({ ...prev, category: "" }));
    }
  }, [form.dob]);

  /* ---------------------------
     Submit → Open Payment
  --------------------------- */
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.category) {
      setError("Please select a valid category");
      return;
    }

    setShowPayment(true);
  };

  /* ---------------------------
     After Payment Success
  --------------------------- */
  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = form;

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setPopupMessage("Payment Successful! Registration Completed!");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 px-6 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Player Registration
          </h1>

          {error && (
            <p className="text-red-500 mb-4 col-span-full">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              type="text"
              placeholder="First Name"
              required
              className="border rounded-lg px-4 py-3"
              onChange={(e)=>setForm({...form, firstName:e.target.value})}
            />

            <input
              type="text"
              placeholder="Last Name"
              required
              className="border rounded-lg px-4 py-3"
              onChange={(e)=>setForm({...form, lastName:e.target.value})}
            />

            <select
              required
              className="border rounded-lg px-4 py-3"
              onChange={(e)=>setForm({...form, gender:e.target.value})}
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <input
              type="date"
              required
              className="border rounded-lg px-4 py-3"
              onChange={(e)=>setForm({...form, dob:e.target.value})}
            />

            {age !== null && (
              <div className="col-span-full text-sm text-gray-600">
                Calculated Age: {age}
              </div>
            )}

            <select
              required
              className="border rounded-lg px-4 py-3"
              onChange={(e)=>setForm({...form, district:e.target.value})}
            >
              <option value="">Select District</option>
              {tamilNaduDistricts.map((district)=>(
                <option key={district}>{district}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Contact Number"
              required
              className="border rounded-lg px-4 py-3"
              onChange={(e)=>setForm({...form, contact:e.target.value})}
            />

            <select
              required
              className="border rounded-lg px-4 py-3"
              onChange={(e)=>setForm({...form, club:e.target.value})}
            >
              <option value="">Select Club</option>
              {clubs.map((club)=>(
                <option key={club}>{club}</option>
              ))}
            </select>

            <select
              required
              className="border rounded-lg px-4 py-3 col-span-full"
              value={form.category}
              onChange={(e)=>setForm({...form, category:e.target.value})}
            >
              <option value="">Select Category</option>
              {eligibleCategories.map((cat)=>(
                <option key={cat.name}>{cat.name}</option>
              ))}
            </select>

            <input
              type="password"
              placeholder="Create Password"
              required
              className="border rounded-lg px-4 py-3 col-span-full"
              onChange={(e)=>setForm({...form, password:e.target.value})}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              className="border rounded-lg px-4 py-3 col-span-full"
              onChange={(e)=>setForm({...form, confirmPassword:e.target.value})}
            />

            <button
              type="submit"
              disabled={loading}
              className="col-span-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
            >
              Submit Registration
            </button>
          </form>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          amount={500}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}

      {popupMessage && (
        <Popup
          message={popupMessage}
          onClose={() => {
            setPopupMessage("");
            router.push("/login");
          }}
        />
      )}
    </>
  );
}