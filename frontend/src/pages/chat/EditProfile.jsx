import ImageUploader from '../../components/ImageUploader';

const EditProfile = ({ type, setOnChangProfile, profile, roomId, userId, setSelectedRoom, isUploading, setIsUploading}) => {

    return (
        <div className="absolute inset-0 backdrop-blur-xs bg-black/70 w-full h-full flex justify-center items-center rounded-lg">
            {!isUploading && (
                <div
                    onClick={() => setOnChangProfile(false)}
                    diable={true}
                    className='top-0 right-0 font-bold absolute p-8 text-2xl hover:bg-gray-500/40  cursor-pointer rounded-lg w-10 h-10 flex justify-center items-center'>
                    X</div>
            )}

            <ImageUploader
                type={type}
                profile={profile}
                roomId={roomId}
                userId={userId}
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                setOnChangProfile={setOnChangProfile}
                setSelectedRoom={setSelectedRoom}
            />
        </div>


    );
}

export default EditProfile;
