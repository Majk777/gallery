import React from "react";
import "./Avatar.css";

export default function Avatar({ src, klass }) {
  return (
    <div className={klass ? klass : "avatar"}>
      <img src={src} alt="user avatar" />
    </div>
  );
}
