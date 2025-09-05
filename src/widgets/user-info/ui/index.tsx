import { auth } from "@/shared/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"

export const UserInfo = async () => {
  const session = await auth()
  return (
    <div className="flex items-center space-x-3 p-4 bg-card border rounded-lg">
      <Avatar className="h-12 w-12">
        <AvatarImage src={session?.user?.image || ''} />
        <AvatarFallback>
          {session?.user?.name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold">{session?.user?.name}</h2>
        <p className="text-sm text-muted-foreground">@{session?.user?.username}</p>
      </div>
    </div>
  )
}