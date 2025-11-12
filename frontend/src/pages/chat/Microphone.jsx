import { useState, useRef } from 'react';
import { HiMicrophone } from 'react-icons/hi2';

function Microphone({setMessage}) {

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const mainColor = "#FF9A00";
    
    const handleMicClick = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("ขออภัยครับ เบราว์เซอร์ของคุณไม่รองรับการสั่งงานด้วยเสียง");
            return;
        }
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = 'th-TH';
        recognition.continuous = false; // หยุดอัตโนมัติเมื่อพูดจบ
        recognition.interimResults = false; // เอาเฉพาะผลลัพธ์สุดท้าย

        // เริ่มฟัง
        recognition.onstart = () => {
            setIsListening(true);
            setMessage("กำลังฟัง..."); // (Optional)
        };

        // เมื่อหยุดฟัง
        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            setMessage(""); // ล้างข้อความถ้า error
        };

        // ผลลัพธ์
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript);
        };

        try {
            recognition.start();
        } catch (error) {
            console.error("Error starting recognition:", error);
            setIsListening(false);
        }
    };

    return (

        <button
            onClick={handleMicClick}
            className={`p-6 rounded-[20px] cursor-pointer  ${isListening ? 'bg-red-500' : `bg-[${mainColor}]`} `}  >
            <HiMicrophone size={24} />
        </button>

    );
}

export default Microphone;