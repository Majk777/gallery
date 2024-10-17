import React from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "../assets/touchpad_mouse.svg";

import About from "../assets/about.svg";

export default function NavElements() {
  return (
    <ul>
      <li>
        <NavLink to="/create" className="flex-links">
          <img src={DashboardIcon} alt="add project icon" />
          <span>New Post</span>
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className="flex-links">
          <img src={About} alt="add project icon" />
          <span>About</span>
        </NavLink>
      </li>
    </ul>
  );
}
