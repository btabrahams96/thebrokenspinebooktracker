import { Navigate, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Library from './routes/Library';
import Wishlist from './routes/Wishlist';
import Add from './routes/Add';
import Stats from './routes/Stats';
import Settings from './routes/Settings';

export default function App() {
  return (
    <div className="min-h-full flex flex-col md:flex-row">
      <main className="flex-1 pb-24 md:pb-0 md:pl-64">
        <Routes>
          <Route path="/" element={<Navigate to="/library" replace />} />
          <Route path="/library" element={<Library />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/add" element={<Add />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
