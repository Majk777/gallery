import { useCollection } from "../../hooks/useCollection";
import "./Dashboard.css";
import GalleryElements from "../../components/GalleryElements";

export default function Dashboard() {
  const { documents, error } = useCollection("projects");

  const sortedDocuments = documents
    ? documents.sort((a, b) => b.dueDate.toDate() - a.dueDate.toDate())
    : null;

  return (
    <div className="page-title">
      {sortedDocuments &&
        sortedDocuments.map((element) => (
          <GalleryElements key={element.id} project={element} />
        ))}
      {error && <p>{error}</p>}
    </div>
  );
}
