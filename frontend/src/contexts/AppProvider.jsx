import { AuthProvider } from "./AuthContext.jsx";
import { QueryProvider } from './QueryContext.jsx';
import { UIProvider } from "./UIContext.jsx";

export function AppProvider({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </AuthProvider>
    </QueryProvider>
  );
}