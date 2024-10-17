import React from "react";
import { useCollection } from "../../hooks/useCollection";
import GalleryElements from "../../components/GalleryElements";

export default function UserAccDashboard({ userId }) {
  const { documents, error } = useCollection("projects");

  return (
    <div>
      {documents &&
        documents
          .filter((document) => document.createdBy.photoURL == userId)
          .map((element) => (
            <GalleryElements key={element.id} project={element} />
          ))}
      {error && <p>{error}</p>}
    </div>
  );
}
