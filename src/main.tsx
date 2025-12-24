import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './components/core/auth-guard.tsx'
export const queryClient = new QueryClient()


// On App Mount Just Fetch Some Course Category  User And User Data

createRoot(document.getElementById('root')!).render(

  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
      <Toaster
        position="top-center"
      />
    </BrowserRouter>
  </QueryClientProvider>
  // </StrictMode>,
)
