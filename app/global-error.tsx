"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Critical Application Error</h2>
            <p className="text-gray-600 mb-8">{error.message}</p>
            <button
              onClick={() => reset()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Restart Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
