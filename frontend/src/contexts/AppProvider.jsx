import { AuthProvider } from "./AuthContext.jsx";
import { QueryProvider } from './QueryContext.jsx';
import { UIProvider } from "./UIContext.jsx";

export function AppProvider({ children }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </QueryProvider>
    </AuthProvider>
  );
}