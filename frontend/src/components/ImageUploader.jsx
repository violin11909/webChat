import { useState, useEffect } from 'react';
import { upload } from '../service/uploadService';
import { useUpdateRoomProfile } from '../hooks/useUpdateProfile';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../service/userService';


const ImageUploader = ({ type, profile, roomId, isUploading, setIsUploading, setOnChangProfile, setSelectedRoom, setSelectedImage, selectedImage, setUrlFirebase, setIsSendingImageSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(profile);
    const [onProgress, setOnProgress] = useState(null);
    const disableButton = !selectedFile || isUploading;
    const updateRoomMutation = useUpdateRoomProfile();

    const { user, setUser } = useAuth();
    const userId = user._id;

    useEffect(() => {
        if (!selectedFile) return;

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    useEffect(() => {
        if (!selectedImage) return;
        setSelectedFile(selectedImage)
    }, [selectedImage]);

    useEffect(() => {
        if (!profile) return;
        setPreview(profile);
    }, [profile]);


    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (file.size > maxSize) {
                alert("ขนาดไฟล์เกิน 2MB!");
                e.target.value = "";
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleProgress = (progress) => setOnProgress(progress);


    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file!');
            return;
        }
        try {
            setIsUploading(true);
            setOnProgress(0);
            const fileToUpload = type === "message-image" ? selectedImage : selectedFile;
            const url = await upload(type, fileToUpload, userId, roomId, handleProgress);

            if (type === "room-profile") {
                setSelectedRoom(prev => ({ ...prev, profile: url }));
                updateRoomMutation.mutate({ filePath: url, roomId: roomId });
            } else if (type === "user-profile") {
                setUser({ ...user, profile: url })
                await updateUserProfile({ userId: user._id, filePath: url })
            }
            else if (type === "message-image") {
                setUrlFirebase(url)
            }


        } catch (error) {
            alert(error.message);

        } finally {
            setIsUploading(false);
            if (type !== "message-image") setOnChangProfile(false);
            else {
                setSelectedImage(null)
                setIsSendingImageSuccess(true);
            }

        }
    };

    return (
        <div className="w-50 flex flex-col items-center gap-4">
            <h1 className='text-white text-xl font-bold flex items-center'>{type == "message-image" ? "Image" : "Profile"}</h1>

            <div className="relative">
                <div className='rounded-full bg-white flex justify-center items-center'>
                    <img
                        src={preview}
                        alt="profile"
                        className={`cursor-pointer object-cover w-35 h-35  ${type == "message-image" ? "rounded-md" : "rounded-full"}`}
                    />
                </div>


                <label
                    htmlFor="profile-upload"
                    className={`absolute inset-0 backdrop-blur-xs bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer ${type == "message-image" ? "rounded-md" : "rounded-full"}`}
                >
                    <span className="text-white text-base font-semibold ">
                        Select Image
                    </span>
                </label>

                <input
                    id="profile-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".png, .jpg, .jpeg, .webp, .gif"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={disableButton}
                className="px-7 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
            >
                {type == "message-image" ? "Send Image" : "Save Image"}
            </button>

            {isUploading && (
                <p className='text-white'>{onProgress}</p>
            )}




        </div>


    );
}

export default ImageUploader;
