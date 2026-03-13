import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🚀 RoadmapPro</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/board">Tablica</Link>
            <span className="navbar-user">{user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Logowanie</Link>
            <Link to="/register">Rejestracja</Link>
          </>
        )}
      </div>
    </nav>
  );
}
