import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { RefreshCw, AlertCircle, Clock } from 'lucide-react'

interface AuthErrorProps {
  error: string
  onRetry?: () => void
  onRefresh?: () => void
  loading?: boolean
  retryCount?: number
}

export function AuthError({ 
  error, 
  onRetry, 
  onRefresh, 
  loading = false,
  retryCount = 3 
}: AuthErrorProps) {
  const isAuthError = error.includes('Превышено количество попыток авторизации') || 
                     error.includes('authorization') ||
                     error.includes('rate limit') ||
                     error.includes('Автоматические попытки авторизации завершены')

  if (!isAuthError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive">
      <Clock className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium mb-1">Превышен лимит запросов</div>
        <div className="text-sm">
          {retryCount > 0 
            ? `Попытка ${retryCount}/3. Повторная попытка через ${2 * retryCount} сек...`
            : 'Сервер временно недоступен из-за большого количества запросов.'
          }
        </div>
        <div className="text-sm mt-1 text-muted-foreground mb-3">
          Попробуйте перезайти в приложение
        </div>
        <div className="flex space-x-2">
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Повторить
            </Button>
          )}
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
            >
              Обновить страницу
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
} 