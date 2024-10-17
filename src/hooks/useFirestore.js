import { useReducer, useEffect, useState } from "react";
import {
  projectFirestore,
  timestamp,
  projectStorage,
} from "../firebase/config";

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return { isPending: false, document: null, success: true, error: null };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };

    case "DELETED_NOTIFICATIONS":
      return {
        isPending: false,
        document: state.document,
        success: true,
        error: null,
        notificationsDeleted: true,
      };
    default:
      return state;
  }
};

export const useFirestore = (collection) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  const collectionRef = projectFirestore.collection(collection);

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  const addDocument = async (doc, photo) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const uploadPath = `pictures/${photo.name + Math.random()}`;

      const img = await projectStorage.ref(uploadPath).put(photo);

      const imgURL = await img.ref.getDownloadURL();

      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await collectionRef.add({
        ...doc,
        createdAt,
        photoURL: imgURL,
      });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await collectionRef.doc(id).delete();
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const updatedDocument = await collectionRef.doc(id).update(updates);

      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });

      return updatedDocument;
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  const deleteNotification = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const docRef = collectionRef.doc(id);

      await docRef.update({
        notifications: [],
      });
      dispatchIfNotCancelled({ type: "DELETED_NOTIFICATIONS" });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return {
    addDocument,
    deleteDocument,
    response,
    updateDocument,
    deleteNotification,
  };
};
