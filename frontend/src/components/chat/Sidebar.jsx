import React from 'react';
import { Plus, Star, User, LogOut, Sun, Moon, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, onLogout, toggleTheme, theme, onNewChat }) => {
  
  const navItems = [
    { id: 'new', icon: <Plus size={20} />, label: 'New Chat', action: onNewChat },
    { id: 'history', icon: <History size={20} />, label: 'History' },
    { id: 'fav', icon: <Star size={20} />, label: 'Favourites' },
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="left-sidebar">
    
      <div className="sidebar-header-container">
        <div className="brand">
          <h2>CORTEX <span>AI</span></h2>
        </div>
        
      
        <div 
          className="theme-switch-mini" 
          onClick={toggleTheme} 
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </div>
      </div>

     
      <div className="nav-buttons">
        {navItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-btn ${activeTab === item.id && item.id !== 'new' ? 'active' : ''}`}
            onClick={() => {
              if (item.action) item.action();
              setActiveTab(item.id);
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

  
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;