import { Navigate, Route, Routes } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import PinGate from './components/PinGate';
import BottomNav from './components/BottomNav';
import { ToastProvider } from './components/Toast';
import RouteTransition from './components/RouteTransition';
import ErrorBoundary from './components/ErrorBoundary';
import Library from './routes/Library';
import Wishlist from './routes/Wishlist';
import Add from './routes/Add';
import Stats from './routes/Stats';
import Settings from './routes/Settings';
import Detail from './routes/Detail';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <PinGate>
          <ToastProvider>
            <div className="min-h-full">
              <main className="pb-16 md:pb-0 md:pl-16 lg:pl-[220px]">
                <RouteTransition>
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
                </RouteTransition>
              </main>
              <BottomNav />
            </div>
          </ToastProvider>
        </PinGate>
      </AuthProvider>
    </ErrorBoundary>
  );
}
