// AuthProvider is no longer needed - Firebase auth is handled by FirebaseAuthContext
// This file is kept for compatibility but no longer wraps with SessionProvider
export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
