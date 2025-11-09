import { useState, useEffect } from 'react';
import { upload } from '../service/uploadService';

const ImageUploader = ({ type, profile }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [onProgress, setOnProgress] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (profile) setPreview(profile);
    }, [])

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        // เพื่อป้องกัน Memory Leak
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);


    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
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
            await upload(type, selectedFile, "690df53f73e34f8c43822190", "", handleProgress);

        } catch (error) {
            alert(error.message);

        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-50 flex flex-col items-center gap-4">
            <h1 className='text-gray-800 text-xl font-bold flex items-center'>Profile</h1>

            <div className="w-30 flex flex-col items-center rounded-full relative shadow-black/30 shadow-md">

                <img
                    src={preview ? preview : "https://i.postimg.cc/XNcYzq3V/user.png"} //defalut should pull from mongo
                    alt="profile"
                    className="cursor-pointer object-contain"
                />

                <label
                    htmlFor="profile-upload"
                    className="absolute inset-0 backdrop-blur-xs bg-black/70 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300  cursor-pointer "
                >
                    <span className="text-white text-base font-semibold ">
                        Select Image
                    </span>
                </label>

                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="px-7 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
            >
                Save Image
            </button>

            {isUploading && (
                <p className='text-black'>{onProgress == 100 ? "อัปโหลดเสร็จเเล้ว" : `กำลังอัปโหลด... ${onProgress.toFixed(0)}%`}</p>
            )}




        </div>


    );
}

export default ImageUploader;
