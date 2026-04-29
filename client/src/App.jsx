import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Globe, WifiOff } from 'lucide-react';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import InterviewForm from './pages/InterviewForm';
import Heatmap from './pages/Heatmap';
import PolicyGuide from './pages/PolicyGuide';
import Offline from './pages/Offline';
import ClientProfile from './pages/ClientProfile';

export default function App() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <BrowserRouter>
      <AppShell isOnline={isOnline}>
        {/* Dev toggle for online/offline simulation */}
        <div className="fixed top-14 right-2 z-50 md:top-2">
          <button
            onClick={() => setIsOnline((o) => !o)}
            title="Toggle online/offline"
            className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-lg shadow-sm hover:bg-slate-50 flex items-center gap-1"
          >
            {isOnline ? <><WifiOff size={10} /> Go Offline</> : <><Globe size={10} /> Go Online</>}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/interview" element={<InterviewForm />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/policy" element={<PolicyGuide />} />
          <Route path="/offline" element={<Offline isOnline={isOnline} />} />
          <Route path="/clients/:id" element={<ClientProfile />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
