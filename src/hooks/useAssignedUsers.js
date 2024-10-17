import { useFirestore } from "./useFirestore";
import { projectFirestore } from "../firebase/config";

export const useAssignedUsers = () => {
  const { updateDocument } = useFirestore("users");

  const updateAssignedUsers = async (assignedUsers, notification) => {
    if (assignedUsers && assignedUsers.length > 0) {
      const userCollectionRef = projectFirestore.collection("users");

      const querySnapshot = await userCollectionRef.get();

      const userDocs = querySnapshot.docs;

      for (const user of assignedUsers) {
        const { id } = user;

        const userDoc = userDocs.find((doc) => doc.id === id);
        const author = notification.author;

        if (userDoc) {
          const currentNotifications = userDoc.data().notifications || [];

          const updatedNotifications = [...currentNotifications, notification];

          if (author !== user.displayName) {
            console.log(author);
            await updateDocument(id, {
              notifications: updatedNotifications,
            });
          }
        }
      }
    } else {
      console.log("No assigned users to update.");
    }
  };

  return { updateAssignedUsers };
};
