import React, { useState } from "react";

import NavElements from "./NavElements";
import IconMenu from "./IconMenu";
import "./SidebarMobile.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import { Link } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";
export default function SidebarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();
  const { document } = useDocument("users", user.uid);
  const { deleteNotification } = useFirestore("users");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const deleteNotifications = async (e) => {
    await deleteNotification(user.uid);
  };
  return (
    <div className="sidebar-mobile">
      <div className="dropdown">
        <IconMenu className="dropbtn" onClick={toggleMenu} />

        {isOpen && (
          <div className="dropdown-content">
            <NavElements />
            <div className="notification-container">
              {document.notifications.map((comment) => (
                <Link to={`/projects/${comment.projectID}`} key={comment.id}>
                  <li>
                    {comment.author} has commented post {comment.title}
                  </li>
                </Link>
              ))}
              {document.notifications === 0 && <p>You have 0 notifications</p>}
              <button onClick={deleteNotifications} className="btn">
                Delete notifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
