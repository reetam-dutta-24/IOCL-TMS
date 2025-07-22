import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            Could not find the requested page.
          </p>
          <Link 
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}