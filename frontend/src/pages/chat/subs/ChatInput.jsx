import { HiPaperClip } from 'react-icons/hi2';
import ImageUploader from '../../../components/common/ImageUploader';
import Microphone from '../items/Microphone';

export function ChatInput({
    message,
    setMessage,
    selectedImage,
    setSelectedImage,
    preview,
    handleFileChange,
    isSendingImage,
    setIsSendingImage,
    setUrlFirebase,
    setIsSendingImageSuccess,
    sendUserContent,
    roomId
}) {
    const mainColor = "[#FF9A00]";

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && message.trim()) {
            sendUserContent(roomId, message, "text");
        }
    };

    return (
        <section className="p-4 bg-[#313131] text-black rounded-[20px]">
            <div className="flex items-center justify-between text-white gap-x-5 relative">
                <div className="flex-1 outline-none rounded-[20px] flex flex-row gap-3 z-10 relative">
                    {selectedImage && (
                        <div className="bg-black/90 absolute w-full pb-10 p-5 left-0 bottom-16 z-[-1] flex justify-center items-center rounded-lg rounded-b-none">
                            {!isSendingImage && (
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="top-0 right-0 font-bold absolute p-8 text-2xl hover:bg-gray-500/40 cursor-pointer rounded-lg w-10 h-10 flex justify-center items-center"
                                >
                                    X
                                </button>
                            )}
                            <ImageUploader
                                type="message-image"
                                profile={preview}
                                isUploading={isSendingImage}
                                setIsUploading={setIsSendingImage}
                                setSelectedImage={setSelectedImage}
                                selectedImage={selectedImage}
                                setUrlFirebase={setUrlFirebase}
                                roomId={roomId}
                                setIsSendingImageSuccess={setIsSendingImageSuccess}
                            />
                        </div>
                    )}

                    <div className="flex-1 flex flex-row">
                        <label
                            className={`hover:text-blue-500 cursor-pointer flex items-center bg-${mainColor} h-full px-4 rounded-[20px] rounded-r-none`}
                            htmlFor="image"
                        >
                            <HiPaperClip size={24} />
                            <input
                                id="image"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".png, .jpg, .jpeg, .webp, .gif"
                            />
                        </label>

                        <input
                            type="text"
                            placeholder="Enter Your Message"
                            className={`outline-none rounded-[20px] rounded-l-none relative text-lg bg-${mainColor} flex-1 py-6 px-5`}
                            value={message}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                </div>

                <Microphone setMessage={setMessage} />
            </div>
        </section>
    );
}