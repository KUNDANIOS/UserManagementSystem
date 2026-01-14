import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Home, Shield, Clock, CheckCircle, Star, BarChart3 } from "lucide-react";
import "./Auth.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Welcome!", message: "Your account has been created successfully", time: "2 min ago", unread: true },
    { id: 2, title: "Profile Update", message: "Complete your profile to unlock all features", time: "1 hour ago", unread: true },
    { id: 3, title: "Security Alert", message: "New login from Windows PC", time: "2 hours ago", unread: false },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    fetch("https://usermanagementsystem-production-8e73.up.railway.app/api/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setUser)
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    fetch("https://usermanagementsystem-production-8e73.up.railway.appapi/dashboard/activity", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) =>
        setStats([
          { icon: <BarChart3 />, value: data.totalActivities, label: "Total Activities", change: "+12%", color: "#6366f1" },
          { icon: <Clock />, value: data.activeTime, label: "Active Time", change: "+5%", color: "#8b5cf6" },
          { icon: <CheckCircle />, value: data.completed, label: "Completed Tasks", change: "+8%", color: "#06b6d4" },
          { icon: <Star />, value: data.successRate, label: "Success Rate", change: "+2%", color: "#10b981" },
        ])
      );
  }, []);

  useEffect(() => {
    fetch("https://usermanagementsystem-production-8e73.up.railway.app/api/dashboard/activity", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then(setActivities);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  if (!user) return <div className="loading-screen"><div className="loading-spinner"></div></div>;

  return (
    <div className="dashboard">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="brand-logo-sm">
            <Shield size={22} />
            <span>Authra</span>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-box">
            <Search size={16} />
            <input placeholder="Search..." />
          </div>
        </div>

        <div className="nav-right">
          <button className="icon-btn" onClick={() => setActiveMenu("Dashboard")} title="Go to Dashboard">
            <Home size={18} />
          </button>

          <div className="notification-wrapper" ref={notifRef}>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="dropdown notification-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button onClick={() => setNotifications([])}>Clear all</button>
                </div>
                <div className="notification-list">
                  {notifications.map((n) => (
                    <div key={n.id} className="notification-item">
                      <h4>{n.title}</h4>
                      <p>{n.message}</p>
                      <span>{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="user-menu-wrapper" ref={userMenuRef}>
            <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
              {user.name[0]}
            </div>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="avatar-sm">{user.name[0]}</div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
                <div className="user-dropdown-body">
                  <div className="action-card" onClick={() => navigate("/settings")}>Settings</div>
                  <div className="action-card" onClick={() => { localStorage.clear(); navigate("/login"); }}>Logout</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* BODY */}
      <div className="dashboard-layout">
        {/* LEFT MENU */}
        <div className="side-menu">
          {["File Manager", "Activity Logs", "Security Center", "Analytics", "Messages", "Team Members"].map((item) => (
            <button key={item} className={activeMenu === item ? "active" : ""} onClick={() => setActiveMenu(item)}>
              {item}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="dashboard-content">
          {activeMenu === "Dashboard" ? (
            <>
              <div className="welcome-banner">
                <h1>Welcome back, {user.name}!</h1>
                <p>Here's what's happening with your account today</p>
              </div>

              <div className="stats-grid">
                {stats.map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-icon">{s.icon}</div>
                    <div>
                      <h3>{s.value}</h3>
                      <p>{s.label}</p>
                      <span>{s.change} this week</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="activity-section">
                <h2>Recent Activity</h2>
                {activities.map((a) => (
                  <div key={a.id} className="activity-item">
                    <strong>{a.title}</strong>
                    <p>{a.desc}</p>
                    <span>{a.time}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="coming-soon-box">
              <h2>{activeMenu}</h2>
              <p> Coming Soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
