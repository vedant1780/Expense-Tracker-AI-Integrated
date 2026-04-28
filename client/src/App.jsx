import { Routes, Route } from 'react-router-dom';
import AuthPage from '../src/pages/LoginPage.jsx'
import MainApp from '../src/pages/MainApp.jsx';
import Onboarding from '../src/pages/Onboarding.jsx'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<MainApp />} />
      <Route path="/onboarding" element={<Onboarding />} />
    </Routes>
  );
}