import { useState, useEffect } from 'react'

export function useFileUpload(maxSizeMB = 2) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!selectedImage) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedImage);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const maxSize = maxSizeMB * 1024 * 1024;

            if (file.size > maxSize) {
                alert(`ขนาดไฟล์เกิน ${maxSizeMB}MB!`);
                e.target.value = "";
                return;
            }
            setSelectedImage(file);
        }
    };

    return {
        selectedImage,
        setSelectedImage,
        preview,
        handleFileChange
    };
}