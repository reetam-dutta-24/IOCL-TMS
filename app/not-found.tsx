import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IndianOilLogo } from '@/components/ui/logo'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <IndianOilLogo width={48} height={48} className="mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">IOCL TAMS</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-6xl font-bold text-red-600 mb-4">404</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}