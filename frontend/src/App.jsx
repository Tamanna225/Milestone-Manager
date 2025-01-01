import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectManagement from './Components/ProjectManagement';
import ProjectDetails from './Components/ProjectDetails';
import Budget from './Components/Budget';
import Inventory from './Components/Inventory'; 
import Signup from './Components/Signup';
import Login from './Components/Login';
import GeoTagPics from './Components/GeoTagPics';
import AdminInventory from './Components/AdminInventory';
import AdminBudget from './Components/AdminBudget';
import Profile from './Components/Profile';
import AdminGeoTagPics from './Components/AdminGeoTagPics';
import AdminProjectDetails from './Components/AdminProjectDetails';
import CubeBackground from './Backgrounds/CubeBackground';
import './App.css';
//reviews

function App() {
  return (
    <div>
      <div className='cube-background'>
        <CubeBackground />
        </div>
    <Router>
      <Routes>
        <Route path="/:isAdmin/:userId" element={<ProjectManagement />} />
        <Route path="/projects/:userId/:id" element={<ProjectDetails />} />
        <Route path="/admin/:userId/:id" element={<AdminProjectDetails />} />
        <Route path="/projects/budget/:userId/:id" element={<Budget />} />
        <Route path="/projects/inventory/:userId/:id" element={<Inventory />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/GeoTagPics/:userId/:id" element={<GeoTagPics />} />
        <Route path="/admin/GeoTagPics/:userId/:id" element={<AdminGeoTagPics />} />
        <Route path="/admin/inventory/:userId/:id" element={<AdminInventory />} />
        <Route path="/admin/budget/:userId/:id" element={<AdminBudget />} />
        <Route path="/profile/:userId" element={<Profile />} />

      </Routes>
    </Router>
    </div>
  );
}

export default App;
