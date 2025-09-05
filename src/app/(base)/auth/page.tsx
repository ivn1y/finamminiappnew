import { AutoAuth } from "@/features/telegram-auth/ui/auto-auth"
export default async function AuthPage() {
  return (
    <div className="container relative flex h-[100svh] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <AutoAuth />
    </div>
  )
}