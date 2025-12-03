import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="relative min-h-svh flex items-center justify-center bg-cover bg-center bg-no-repeat"
         style={{
             backgroundImage: "url('/backgroundPic.jpeg')",
         }}
    >

      <div className="animate-float w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
