import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import EditProfilePane from '../../pages/edit/EditProfilePane';
import { useUI } from '../../contexts/UIContext';

function MainLayout() {
    const { isEditingProfile, setIsEditingProfile } = useUI();

    return (
        <div className="h-screen w-screen overflow-hidden bg-white flex flex-row p-6 gap-5">
            <Sidebar />
            {isEditingProfile ? (
                <EditProfilePane setIsEditingProfile={setIsEditingProfile} />
            ) : (
                <Outlet />
            )}
        </div>
    );
}

export default MainLayout;
