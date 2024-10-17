import { projectFirestore } from "../firebase/config";
import { useEffect, useState } from "react";

export const useDocument = (collection, id) => {
  const [error, setError] = useState(null);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const res = projectFirestore.collection(collection).doc(id);

    const unsubscribe = res.onSnapshot(
      (snapshot) => {
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError("couldnt match any data to adress");
        }
      },
      (error) => {
        // console.log(error);
        setError("could not fetch document from collection");
      }
    );

    return () => unsubscribe();
  }, [collection, id]);

  return { document, error };
};
