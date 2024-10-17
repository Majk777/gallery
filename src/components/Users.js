import React from "react";
import "./Users.css";
import { useCollection } from "../hooks/useCollection";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Users() {
  const { documents, isPending, error } = useCollection("users");
  const { logout } = useLogout();
  return (
    <div className="user-list">
      <div className="logout-container">
        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>
      {isPending && <div>Loading users...</div>}
      {error && <div>{error}</div>}
      {documents &&
        documents.map((user) => (
          <div key={user.id} className="user-list-item">
            <Link to={`/users/${user.id}`}>
              <span>{user.displayName}</span>

              <Avatar
                src={user.photoURL}
                klass={user.online ? "avatar-active" : "avatar"}
              />
            </Link>
          </div>
        ))}
    </div>
  );
}
