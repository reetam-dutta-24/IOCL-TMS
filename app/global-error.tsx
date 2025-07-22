
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Application Error!</h2>
              <p className="text-gray-600 mb-6">
                A global error occurred. Please try refreshing the page.
              </p>
              <button
                onClick={() => reset()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}