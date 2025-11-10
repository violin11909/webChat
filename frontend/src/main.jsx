import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from "./contexts/AuthContext.jsx"; 

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* for cache data */}
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode >,
)
