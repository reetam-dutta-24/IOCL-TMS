import { Loader2 } from "lucide-react"

interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = "Loading..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4">
          <Loader2 className="h-12 w-12 text-red-600" />
        </div>
        <p className="text-gray-600 text-lg">{message}</p>
        <div className="mt-2 text-sm text-gray-500">
          Please wait while we load your content...
        </div>
      </div>
    </div>
  )
}