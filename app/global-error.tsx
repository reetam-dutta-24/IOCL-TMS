'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { IndianOilLogo } from '@/components/ui/logo'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <IndianOilLogo width={48} height={48} className="mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-8">IOCL TAMS</h1>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Application Error
              </h2>
              
              <p className="text-gray-600 mb-6">
                A critical error occurred. Please try refreshing the page.
              </p>

              <Button 
                onClick={reset}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}