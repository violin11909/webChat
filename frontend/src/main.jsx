import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* for cache data */}
    <QueryClientProvider client={queryClient}> 
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
