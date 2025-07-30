import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from '../pages/LandingPage';
import Cabins from '../pages/Cabins';
import CabinInfo from '../pages/CabinInfo';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { Toaster } from 'react-hot-toast';
import UserProfile from '../pages/UserProfile';
import RoomBookingDetails from '../pages/RoomBookingDetails';
import AboutMe from '../components/AboutMe';
import CurrentTrips from '../components/CurrentTrips';
import PastTrips from '../components/PastTrips';
import CreateHostProfile from '../pages/CreateHostProfile';
import AddRoom from '../pages/AddRoom';
import HostDashboard from '../pages/HostDashboard';
import DashboardLanding from '../components/DashboardLanding';
import DashboardBookings from '../components/DashboardBookings';
import DashboardRooms from '../components/DashboardRooms';
import DashboardEarnings from '../components/DashboardEarnings';
import DashboardSettings from '../components/DashboardSettings';
import DashboardPastBookings from '../components/DashboardPastBookings';

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Redirect root path to landing page */}
          <Route path="/" element={<Navigate replace to="/landingpage" />} />

          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cabins" element={<Cabins />} />
          <Route path="/cabin/:id" element={<CabinInfo />} />

          <Route path="/profile" element={<UserProfile />}>
            <Route index element={<Navigate replace to="aboutme" />} />
            <Route path="aboutme" element={<AboutMe />} />
            <Route path="pasttrips" element={<PastTrips />} />
            <Route path="currenttrips" element={<CurrentTrips />} />
          </Route>

          <Route path="/bookingdetails/:id" element={<RoomBookingDetails />} />
          <Route path="/createhostprofile" element={<CreateHostProfile />} />
          <Route path="/host/add-room" element={<AddRoom />} />
          <Route path="/host" element={<HostDashboard />} >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path='dashboard' element={<DashboardLanding/>}/>
            <Route path='bookings' element={<DashboardBookings/>}/>
            <Route path='rooms' element={<DashboardRooms/>}/>
            <Route path='earnings' element={<DashboardEarnings/>}/>
            <Route path='settings' element={<DashboardSettings/>}/>
            <Route path='pastbookings' element={<DashboardPastBookings/>}/>

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
