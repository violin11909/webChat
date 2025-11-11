import { AuthProvider } from "./AuthContext.jsx";
import { QueryProvider } from './QueryContext.jsx';

export function AppProvider({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}