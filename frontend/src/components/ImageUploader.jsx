import { useState, useEffect } from 'react';
import { upload } from '../service/uploadService';
import { useUpdateRoomProfile, useUpdateUserProfile } from '../hooks/useUpdateProfile';


const ImageUploader = ({ type, profile, roomId, userId, isUploading, setIsUploading, setOnChangProfile, setSelectedRoom }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(profile);
    const [onProgress, setOnProgress] = useState(null);
    const diableButton = !selectedFile || isUploading;

    const updateRoomMutation = useUpdateRoomProfile();
    const updateUserMutation = useUpdateUserProfile();

    console.log(profile);


    useEffect(() => {
        if (!selectedFile) {
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        // เพื่อป้องกัน Memory Leak
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);


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
            const url = await upload(type, selectedFile, userId, roomId, handleProgress);

            if (type === "room-profile") {
                setSelectedRoom(prev => ({ ...prev, profile: url }));
                updateRoomMutation.mutate({ filePath: url, roomId: roomId });
            } else if (type === "user-profile") {
                updateUserMutation.mutate({ filePath: url, userId: userId });
            }


        } catch (error) {
            alert(error.message);

        } finally {
            setIsUploading(false);
            setOnChangProfile(false);

        }
    };

    return (
        <div className="w-50 flex flex-col items-center gap-4">
            <h1 className='text-white text-xl font-bold flex items-center'>Profile</h1>

            <div className="relative">
                <div className='rounded-full bg-white flex justify-center items-center'>
                    <img
                        src={preview}
                        alt="profile"
                        className="cursor-pointer object-cover w-35 h-35 rounded-full"
                    />
                </div>


                <label
                    htmlFor="profile-upload"
                    className="absolute inset-0 backdrop-blur-xs bg-black/70 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300  cursor-pointer "
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
                    accept=".png, .jpg, .jpeg, .webp"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={diableButton}
                className="px-7 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
            >
                Save Image
            </button>

            {isUploading && (
                <p className='text-white'>{onProgress}</p>
            )}




        </div>


    );
}

export default ImageUploader;
