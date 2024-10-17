import { useState, useEffect } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { timestamp } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useHistory } from "react-router";
import Select from "react-select";

import "./Create.css";

const categories = [
  { value: "software", label: "software" },
  { value: "retro", label: "retro" },
  { value: "hardware", label: "hardware" },
  { value: "games", label: "games" },
];

export default function Create() {
  const history = useHistory();
  const { addDocument, response } = useFirestore("projects");
  const { user } = useAuthContext();
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (documents) {
      setUsers(
        documents.map((user) => {
          return { value: { ...user, id: user.id }, label: user.displayName };
        })
      );
    }
  }, [documents]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!category) {
      setFormError("Please select a project category.");
      return;
    }
    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user");
      return;
    }

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      };
    });

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    };

    assignedUsersList.push(createdBy);

    const project = {
      name,
      details,
      assignedUsersList,
      createdBy,
      category: category.value,

      dueDate: timestamp.fromDate(new Date()),
      comments: [],
    };

    await addDocument(project, thumbnail);
    if (!response.error) {
      history.push("/");
    }
  };

  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];
    // console.log(selected);

    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }
    if (selected.size > 10000000) {
      setThumbnailError("Image file size must be less than 100kb");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
    // console.log("thumbnail updated");
    // console.log(thumbnail);
  };

  return (
    <div className="create-form">
      <div className="form-container">
        <div className="form-wrapper">
          <h2 className="page-title">Create a new Project</h2>
          <form onSubmit={handleSubmit}>
            <label>
              <span>Title:</span>
              <input
                required
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </label>
            <label>
              <span>Description:</span>
              <textarea
                required
                onChange={(e) => setDetails(e.target.value)}
                value={details}
              ></textarea>
            </label>

            <label>
              <span>Categories:</span>
              <Select
                onChange={(option) => setCategory(option)}
                options={categories}
              />
            </label>
            <label>
              <span>Tag a friend:</span>
              <Select
                onChange={(option) => setAssignedUsers(option)}
                options={users}
                isMulti
              />
            </label>
            <span>Upload picture:</span>
            <input required type="file" onChange={handleFileChange} />
            {thumbnailError && <div className="error">{thumbnailError}</div>}
            <button className="btn">Add Project</button>

            {formError && <p className="error">{formError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
