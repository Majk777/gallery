import "./Navbar.css";
import logo from "../assets/robot.svg";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import SidebarMobile from "./SidebarMobile";
import NavElements from "./NavElements";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <nav className="navbar">
      <ul>
        {user && (
          <li className="navar-mobile-nav">
            <SidebarMobile />
          </li>
        )}
        <Link to="/">
          <li className="logo">
            <img src={logo} alt="it should be logo in here" />
            <span>Mr.Gallery</span>
          </li>
        </Link>
        {user && (
          <div className="menu-desktop">
            <NavElements />
          </div>
        )}
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
        {user && (
          <>
            <li className="mobile-logout">
              {!isPending && (
                <button className="btn" onClick={logout}>
                  Logout
                </button>
              )}
              {isPending && (
                <button className="btn" disabled>
                  Loging out...
                </button>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
