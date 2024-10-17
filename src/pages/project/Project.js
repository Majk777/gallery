import "./Project.css";
import { useParams } from "react-router-dom";
import { useDocument } from "../../hooks/useDocument";
import Avatar from "../../components/Avatar";
import Comments from "./Comments";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Project() {
  const { id } = useParams();
  const { document, error } = useDocument("projects", id);
  const { deleteDocument } = useFirestore("projects");
  const { user } = useAuthContext();
  const history = useHistory();

  const handleDelete = (e) => {
    deleteDocument(document.id);
    // console.log(document.createdBy.photoURL === user.photoURL);
    // console.log(user.photoURL);
    // console.log(document.createdBy.photoURL);
    history.push("/");
  };

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!document) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="project-details">
      <div className="project-summary">
        <div className="image-container">
          {document.photoURL && (
            <img src={document.photoURL} alt={document.name} />
          )}
        </div>
        <h2 className="page-title">{document.name}</h2>
        <p className="due-date">Created by:{document.createdBy.displayName}</p>
        <p className="details">{document.details}</p>
        <h4>Tagged users:</h4>
        <div className="assigned-users">
          {document.assignedUsersList.map((user) => (
            <Link to={`/users/${user.id}`} key={user.id}>
              <div>
                <Avatar src={user.photoURL} />
              </div>
            </Link>
          ))}
        </div>
        {document.createdBy.photoURL === user.photoURL && (
          <button className="btn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
      <Comments project={document} />
    </div>
  );
}
