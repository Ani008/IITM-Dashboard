import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './Components/Layout';
import Dashboard from './Pages/Dashboard';
import Standards from './Pages/Standards';
import Periodicals from './Pages/Periodicals';
import Abstracts from './Pages/Abstracts';
import LoginPage from './Pages/LoginPage';

function App() {
  const location = useLocation();

  // Check if current path is login
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {isLoginPage ? (
        /* 1. Login Page: No Sidebar/Navbar */
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        /* 2. All other pages: Show Sidebar/Navbar via Layout */
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/standards" element={<Standards />} />
            <Route path="/periodicals" element={<Periodicals />} />
            <Route path="/abstracts" element={<Abstracts />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;