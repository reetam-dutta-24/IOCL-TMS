import { Loader2 } from "lucide-react"
import { IndianOilLogo } from "./logo"

interface PageLoadingProps {
  message?: string
  showLogo?: boolean
}

export function PageLoading({ message = "Loading...", showLogo = true }: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        {showLogo && (
          <div className="flex items-center justify-center mb-6">
            <IndianOilLogo width={48} height={48} className="mr-2" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">IOCL TAMS</h1>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mr-3" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
        <p className="text-gray-600 text-lg">{message}</p>
        <div className="mt-4">
          <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-red-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function ButtonLoading({ isLoading, children, loadingText }: ButtonLoadingProps) {
  if (isLoading) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || "Loading..."}
      </>
    )
  }
  return <>{children}</>
}