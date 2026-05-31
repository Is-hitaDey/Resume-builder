import React from 'react'
import '../style/sidebar.scss'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <div className="logo-text">
            <h2>CareerGen</h2>
            <p>AI-Powered Prep</p>
          </div>
        </div>
      </div>

      {/* New Session Button */}
      <button className="new-session-btn">
        <span className="plus-icon">+</span>
        New Session
      </button>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">🎤</span>
            <span className="nav-label">Mock Interview</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">📄</span>
            <span className="nav-label">Resume Analysis</span>
          </li>
          <li className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Settings</span>
          </li>
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <img src="https://via.placeholder.com/40" alt="User" />
          </div>
          <div className="user-info">
            <p className="user-name">Alex Rivera</p>
            <p className="user-plan">Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
