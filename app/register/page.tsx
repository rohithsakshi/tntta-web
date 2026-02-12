export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-16">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Tournament Registration
        </h1>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="District"
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Category</option>
            <option>Junior</option>
            <option>Senior</option>
            <option>Veteran</option>
          </select>

          <button
            type="submit"
            className="col-span-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  );
}