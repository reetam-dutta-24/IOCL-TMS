import { Loader2 } from "lucide-react"

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4">
          <Loader2 className="h-12 w-12 text-red-600" />
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-1">Please wait while we load your data</p>
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