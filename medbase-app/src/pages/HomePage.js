import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <img src="/logo.png" alt="MedBase Logo" className="hero-logo" />
        <h1>Welcome to MedBase</h1>
        <p className="hero-subtitle">Your Comprehensive Patient Management Solution</p>
        
        <div className="cta-buttons">
          <button className="primary-btn" onClick={() => navigate('/register')}>
            <i className="fas fa-user-plus"></i> Register New Patient
          </button>
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-user-circle"></i>
            <h3>Patient Registration</h3>
            <p>Easily register new patients with all necessary details</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-terminal"></i>
            <h3>SQL Query Interface</h3>
            <p>Run SQL queries to find patient information with full database access</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-sync-alt"></i>
            <h3>Local Storage & Sync</h3>
            <p>All data stored locally using Pglite and syncs across browser tabs</p>
          </div>
        </div>
      </div>
    </div>
  );
}