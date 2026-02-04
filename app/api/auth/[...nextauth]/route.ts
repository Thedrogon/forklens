// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth" // Refers to the auth.ts we just made

export const { GET, POST } = handlers