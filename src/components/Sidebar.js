import "./Sidebar.css";

import Avatar from "./Avatar";
import Email from "../assets/notification.svg";

import { useAuthContext } from "../hooks/useAuthContext";
import { useDocument } from "../hooks/useDocument";
import { useState } from "react";

import { Link } from "react-router-dom";
import { useFirestore } from "../hooks/useFirestore";

export default function Sidebar() {
  const { deleteNotification } = useFirestore("users");
  const [btnFlag, setBtnFlag] = useState(false);
  const { user } = useAuthContext();

  const { document } = useDocument("users", user.uid);

  const handleButton = () => {
    setBtnFlag((prevState) => !prevState);
  };

  const deleteNotifications = async (e) => {
    await deleteNotification(user.uid);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <Avatar src={user.photoURL} />
          <h2> {user.displayName}</h2>
          <button className="notication-button" onClick={handleButton}>
            <img src={Email} alt="add project icon" />
            {document && (
              <span
                style={{
                  visibility:
                    document.notifications.length > 0 ? "visible" : "hidden",
                }}
              >
                {document.notifications ? document.notifications.length : ""}
              </span>
            )}
          </button>
          {btnFlag && (
            <div className="notification-container">
              {document.notifications.map((comment) => (
                <Link to={`/projects/${comment.projectID}`} key={comment.id}>
                  <li
                    className={
                      btnFlag ? "notification-list active" : "notification-list"
                    }
                  >
                    {comment.author} has commented post {comment.title}
                  </li>
                </Link>
              ))}
              {document.notifications === 0 && <p>You have 0 notifications</p>}
              <button onClick={deleteNotifications} className="btn">
                Delete notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
