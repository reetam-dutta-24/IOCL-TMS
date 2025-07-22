'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IndianOilLogo } from '@/components/ui/logo'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <IndianOilLogo width={48} height={48} className="mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">IOCL TAMS</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-4">
            Something went wrong!
          </h2>
          
          <Alert className="mb-6">
            <AlertDescription>
              We encountered an unexpected error. This might be a temporary issue.
              {error.digest && (
                <div className="mt-2 text-xs text-gray-500">
                  Error ID: {error.digest}
                </div>
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}