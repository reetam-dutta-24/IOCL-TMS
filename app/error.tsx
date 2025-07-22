
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">
            An error occurred while loading this page.
          </p>
          <button
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  )
}