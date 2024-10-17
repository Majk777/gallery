import React from "react";
import { useParams } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { useCollection } from "../../hooks/useCollection";

import UserAccDashboard from "./UserAccDashboard";

export default function UserAccount() {
  const { documents } = useCollection("users");
  const { id } = useParams();

  return (
    <div>
      {documents &&
        documents
          .filter((user) => user.id == id)
          .map((user) => (
            <div key={user.photoURL}>
              <div className="user-account"></div>

              <Avatar src={user.photoURL} />
              <h2>{user.displayName}</h2>
              {user.online ? "is online" : "is offline"}
              <UserAccDashboard userId={user.photoURL} />
            </div>
          ))}
    </div>
  );
}
