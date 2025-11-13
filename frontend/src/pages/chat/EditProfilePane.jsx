import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ImageUploader from '../../components/ImageUploader';
import { useUpdateUserProfile } from '../../hooks/useUpdateProfile';
import { useUI } from '../../contexts/UIContext';

function EditProfilePane() {
    const { user } = useAuth();
    const { setIsEditingProfile } = useUI();
    const [name, setName] = useState(user.name);
    const [isUploading, setIsUploading] = useState(false);
    const updateUserMutation = useUpdateUserProfile();

    const handleSaveName = () => {
        if (name.trim() === '' || name === user.name) return;
        updateUserMutation.mutate(
            { userId: user._id, name: name.trim() },
            {
                onSuccess: () => {
                    alert("Name updated successfully!");
                }
            }
        );
    };

    return (
        <div className="min-w-60 bg-[#313131] rounded-[20px] shadow-lg relative flex flex-col text-white p-6">
            <div className="flex flex-row items-center font-bold mb-4">
                <h2 className="flex-1 text-2xl">Edit Profile</h2>
                <button 
                    className="text-2xl cursor-pointer hover:text-orange-300" 
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isUploading}
                >
                    &times;
                </button>
            </div>

            <div className="flex flex-col items-center gap-4 mb-6">
                <ImageUploader
                    type="user-profile"
                    profile={user.profile}
                    isUploading={isUploading}
                    setIsUploading={setIsUploading}
                    setOnChangProfile={() => setIsEditingProfile(false)}
                />
            </div>

            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="flex-1 rounded-[14px] py-2 px-3 outline-none bg-[#222] text-white"
                            disabled={isUploading}
                        />
                        <button 
                            className="bg-[#FF9A00] hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500"
                            onClick={handleSaveName}
                            disabled={isUploading || updateUserMutation.isPending || name.trim() === '' || name === user.name}
                        >
                            {updateUserMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <button 
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isUploading}
                >
                    Done
                </button>
            </div>
        </div>
    );
}

export default EditProfilePane;
