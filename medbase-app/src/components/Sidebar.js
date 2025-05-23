import { NavLink, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 onClick={() => navigate('/')}><img src="logo.png" alt="" width="20" height="20" ></img>&nbsp;&nbsp;MedBase</h2>}
        <button className="collapse-btn" onClick={toggleSidebar}>
          <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/register" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
          }
        >
          <i className="fas fa-user-plus"></i>
          {!collapsed && <span>Registration</span>}
        </NavLink>
        
        <NavLink 
          to="/database" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
          }
        >
          <i className="fas fa-database"></i>
          {!collapsed && <span>Database</span>}
        </NavLink>
        
        <NavLink 
          to="/query" 
          className={({ isActive }) => 
            `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
          }
        >
          <i className="fas fa-code"></i>
          {!collapsed && <span>SQL Query</span>}
        </NavLink>
      </nav>
      {/* <div className="sidebar-footer">
        {!collapsed && <p>Arijeet Jash</p>}
      </div> */}
    </aside>
  );
}