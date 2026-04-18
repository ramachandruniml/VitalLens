import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppShell } from './components/AppShell'
import { DoctorPrepPage } from './pages/DoctorPrepPage'
import { DashboardPage } from './pages/DashboardPage'
import { TrendsPage } from './pages/TrendsPage'
import { UploadPage } from './pages/UploadPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/doctor-prep" element={<DoctorPrepPage />} />
      </Route>
    </Routes>
  )
}

export default App
