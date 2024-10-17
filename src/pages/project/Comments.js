import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { timestamp } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import Avatar from "../../components/Avatar";
import { useAssignedUsers } from "../../hooks/useAssignedUsers";
import "./Project.css";
import { Link } from "react-router-dom";

export default function Comments({ project }) {
  const { user } = useAuthContext();
  const [newComment, setNewComment] = useState("");

  const [flag, setFlag] = useState(project.comments.length);
  const { updateDocument, response } = useFirestore("projects");

  const { updateAssignedUsers } = useAssignedUsers();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const comment = {
      content: newComment,
      author: user.displayName,
      avathar: user.photoURL,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random(),
      title: project.name,
      projectID: project.id,
    };

    const userToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    const existingUser = project.assignedUsersList.find(
      (user) => user.id === userToAdd.id
    );

    if (!existingUser) {
      await updateDocument(project.id, {
        comments: [...project.comments, comment],
        assignedUsersList: [...project.assignedUsersList, userToAdd],
      });
    } else {
      await updateDocument(project.id, {
        comments: [...project.comments, comment],
      });
    }

    setFlag(project.comments.length);

    await updateAssignedUsers(project.assignedUsersList, comment);

    // console.log(comment);
    if (!response.error) {
      setNewComment("");
      // console.log("all good");
    }
  };

  const findID = (val) => {
    const assignedUser = project.assignedUsersList.find(
      (output) => output.displayName === val
    );
    return assignedUser ? assignedUser.id : null;
  };

  return (
    <div className="project-comments">
      <h4>Project Comments</h4>

      <form className="add-comment" onSubmit={handleSubmit}>
        <label>
          <span>Add new comment:</span>
          <textarea
            required
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
          ></textarea>
        </label>
        <button className="btn">Add Comment</button>
      </form>
      {project.comments.length > 0 &&
        project.comments.map((comment) => {
          const userId = findID(comment.author);
          return (
            <div key={comment.id} className="comment-container">
              <Link to={`/users/${userId}`}>
                <div className="comment-user">
                  <Avatar src={comment.avathar} />
                  <h3>{comment.author}</h3>
                </div>
                <p>{comment.content}</p>
              </Link>
            </div>
          );
        })}
    </div>
  );
}
