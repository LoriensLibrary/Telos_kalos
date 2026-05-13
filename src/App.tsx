import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import MemberApp from './pages/MemberApp';
import Performance from './pages/Performance';
import DataArch from './pages/DataArch';
import Platform from './pages/Platform';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="member" element={<MemberApp />} />
          <Route path="performance" element={<Performance />} />
          <Route path="coach" element={<Navigate to="/performance" replace />} />
          <Route path="data" element={<DataArch />} />
          <Route path="platform" element={<Platform />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
