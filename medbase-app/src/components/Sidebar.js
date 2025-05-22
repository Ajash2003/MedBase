import { NavLink } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2><img src="logo.png" alt="" width="20" height="20" ></img>&nbsp;&nbsp;MedBase</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/register" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-user-plus"></i>
          <span>Registration</span>
        </NavLink>
        
        <NavLink 
          to="/database" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-database"></i>
          <span>Database</span>
        </NavLink>
        
        <NavLink 
          to="/query" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <i className="fas fa-code"></i>
          <span>SQL Query</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <p></p>
      </div>
    </aside>
  );
}