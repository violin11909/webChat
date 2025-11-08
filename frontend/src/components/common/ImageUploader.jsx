import { useState } from 'react';
import { storage } from '../../../config/firebase'; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function ImageUploader() {
  const [file, setFile] = useState(null);       
  const [progress, setProgress] = useState(0);     
  const [downloadURL, setDownloadURL] = useState(null); 
  const [error, setError] = useState(null);      

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setProgress(0);
      setDownloadURL(null);
      setError(null);
    }
  };
  // https://firebase.google.com/docs/storage/web/upload-files
  const handleUpload = () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const uniqueFileName = `${Date.now()}-${file.name}`;
    // firebase storage reference
    const storageRef = ref(storage, 'images/' + uniqueFileName);
    const metadata = { contentType: file.type }; 

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        setError(`Upload failed: ${error.code}`);
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log('File available at', url);
          setDownloadURL(url);
        });
      }
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload Image to Firebase</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {progress > 0 && (
        <div>
          <progress value={progress} max="100" />
          <p>{Math.round(progress)}%</p>
        </div>
      )}

      {downloadURL && (
        <div style={{ marginTop: '20px' }}>
          <p>Upload successful!</p>
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            {downloadURL}
          </a>
          <div>
            <img src={downloadURL} alt="Uploaded" style={{ width: '300px', marginTop: '10px' }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;