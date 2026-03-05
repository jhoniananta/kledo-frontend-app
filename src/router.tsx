import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { regionsLoader } from './loaders/regions-loader'

function RouteError() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#edf0f5] p-6 text-center text-slate-700">
      Gagal memuat data wilayah. Silakan refresh halaman.
    </main>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: regionsLoader,
    errorElement: <RouteError />,
  },
])
