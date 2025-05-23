import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import DatabasePage from './pages/DatabasePage';
import QueryPage from './pages/QueryPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/query" element={<QueryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;