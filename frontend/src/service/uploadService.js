import storage from '../../config/config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const upload = (type, file, userId, roomId, handleProgress) => {

    return new Promise((resolve, reject) => {

        try {
            let storagePath;

            if (!type || !file) {
                throw new Error("Type and file are required");
            }

            if (type === "user-profile") {
                if (!userId) throw new Error("User not found");
                storagePath = `profile/${userId}`;
            }
            else if (type === "room-profile") {
                if (!roomId) throw new Error("Room not found");
                storagePath = `room/${roomId}`;
            }

            else if (type === "message-image") {
                if (!roomId) throw new Error("Room not found");

                const uniqueName = `${Date.now()}-${userId}-${file.name}`;
                storagePath = `room/${roomId}/${uniqueName}`;
            }
            else {
                throw new Error("Invalid upload type specified");
            }


            const storageRef = ref(storage, storagePath);
            const metadata = { contentType: file.type };
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    handleProgress(progress);
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    // 5. ถ้า Error ให้ "reject" Promise
                    console.error("Upload failed:", error);
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL);

                    }).catch((err) => {
                        console.error("Failed to get Download URL", err);
                        reject(err);
                    });
                }
            );

        } catch (error) {
            alert(error.message);
            reject(error);
        }

    });
}