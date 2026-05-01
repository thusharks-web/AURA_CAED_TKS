import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useUserStore } from './store/userStore';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import WorkbenchPage from './pages/WorkbenchPage';
import ExercisesPage from './pages/ExercisesPage';

export default function App() {
  const initialize = useUserStore(s => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#252536',
            color: '#E4E4EF',
            border: '1px solid #3A3A4E',
            borderRadius: '10px',
            fontSize: '14px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workbench" element={<WorkbenchPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
