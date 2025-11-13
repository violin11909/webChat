import storage from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


export const upload = (type, file, userId, roomId, handleProgress, setNotification) => {

    return new Promise(async (resolve, reject) => {

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
                    const text = `... กำลังอัปโหลด ${progress.toFixed(0)} %`
                    handleProgress(text);
                },
                (error) => {
                    console.error("Upload failed:", error);
                    reject(error);
                },
                () => {
                    handleProgress("โปรดรอสักครู่");
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        try {
                            console.log('File available at', downloadURL);
                            resolve(downloadURL);
                        } catch (error) {
                            console.error("Failed to get Download URL", error);
                            reject(error);
                        }

                    });
                }
            );

        } catch (error) {
            alert(error.message);
            console.error(error);
            reject(error);
        }

    });
}