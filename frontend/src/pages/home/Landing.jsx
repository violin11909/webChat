import Sidebar from '../../components/layout/Sidebar';
import ImageUploader from '../../components/ImageUploader';

function Landing() {

  
  return (
    <div className="h-screen w-screen overflow-hidden bg-blue-100 flex flex-row">
      <Sidebar />
      <ImageUploader type="user-profile" />

    </div>
  );
}

export default Landing;