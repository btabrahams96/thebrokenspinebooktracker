import { Navigate, Route, Routes } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import PinGate from './components/PinGate';
import BottomNav from './components/BottomNav';
import Library from './routes/Library';
import Wishlist from './routes/Wishlist';
import Add from './routes/Add';
import Stats from './routes/Stats';
import Settings from './routes/Settings';
import Detail from './routes/Detail';

export default function App() {
  return (
    <AuthProvider>
      <PinGate>
        <div className="min-h-full flex flex-col md:flex-row">
          <main className="flex-1 pb-24 md:pb-0 md:pl-64">
            <Routes>
              <Route path="/" element={<Navigate to="/library" replace />} />
              <Route path="/library" element={<Library />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/add" element={<Add />} />
              <Route path="/item/:id" element={<Detail />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/library" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </PinGate>
    </AuthProvider>
  );
}
