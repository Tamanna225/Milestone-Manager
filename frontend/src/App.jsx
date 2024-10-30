import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProjectManagement from './Components/ProjectManagement';
import ProjectDetails from './Components/ProjectDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectManagement />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
