import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <NavLink to="/" className="logo">
        Book Reviews
      </NavLink>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/search">Search</NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/my-reviews">My Reviews</NavLink>

            <span className="user-name">
              Hello, {user?.name}
            </span>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}