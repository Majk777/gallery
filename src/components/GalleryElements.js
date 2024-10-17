import React from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import "./GalleryElements.css";

export default function GalleryElements({ project }) {
  return (
    <div className="project-list">
      <Link to={`/projects/${project.id}`}>
        <div className="img-container">
          <img
            src={project.photoURL}
            alt={project.name}
            className="pic-minature"
          />
        </div>
        <div className="content-container">
          <h4 className="project-list">{project.name}</h4>

          <p>creator: {project.createdBy["displayName"]}</p>
          <p>category: {project.category}</p>
          <div className="assigned-to">
            <p>
              <strong>Tagged users:</strong>
            </p>
            <ul>
              {project.assignedUsersList.map((user) => (
                <li key={user.photoURL}>
                  <Avatar src={user.photoURL} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </div>
  );
}
