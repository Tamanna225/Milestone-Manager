import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './navbar';
import { FaPlus } from 'react-icons/fa';
import AdminNavbar from './AdminNavbar';

const ProjectManagement = () => {
  const { isAdmin, userId } = useParams();
  const navigate = useNavigate();
  const isAdminBoolean = isAdmin === "true";
  const [projects, setProjects] = useState({
    upcoming: [],
    ongoing: [],
    completed: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    budget: '',
    completion_percentage: 0,
  });

  useEffect(() => {
    if(userId){
    fetch(`http://localhost/backend/fetch_projects.php?user_id=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (
          data.upcoming &&
          Array.isArray(data.upcoming) &&
          data.ongoing &&
          Array.isArray(data.ongoing) &&
          data.completed &&
          Array.isArray(data.completed)
        ) {
          setProjects({
            upcoming: data.upcoming,
            ongoing: data.ongoing,
            completed: data.completed,
          });
        } else {
          console.error('Expected arrays but got:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }, [userId]);

  const handleMoveProject = async (id, fromSection, toSection) => {
    const project = projects[fromSection].find((proj) => proj.project_id === id);
  
    // Convert status string to status_id
    let statusId;
    if (toSection === "upcoming") {
      statusId = 0; // Upcoming corresponds to status_id = 0
    } else if (toSection === "ongoing") {
      statusId = 1; // Ongoing corresponds to status_id = 1
    } else if (toSection === "completed") {
      statusId = 2; // Completed corresponds to status_id = 2
    } else {
      console.error("Invalid status string");
      return;
    }
  
    // Update in backend with project_id as a URL parameter
    try {
      const response = await fetch(`http://localhost/backend/change_project_status.php?project_id=${id}&status_id=${statusId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const result = await response.json();
  
      if (result.success) {
        // Update in frontend state
        setProjects((prev) => ({
          ...prev,
          [fromSection]: prev[fromSection].filter((proj) => proj.project_id !== id),
          [toSection]: [...prev[toSection], project],
        }));
      } else {
        console.error('Error moving project:', result.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
    }
  };
  

  const handleProjectClick = (project) => {
    const basePath = isAdminBoolean ? `/admin/${userId}` : `/projects/${userId}`;
    navigate(`${basePath}/${project.project_id}`, { state: project });
  };
  

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewProject({
      name: '',
      budget: '',
      completion_percentage: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProject = () => {
    fetch(`http://localhost/backend/add_project.php?user_id=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const newProjectObj = {
            project_id: data.project_id,
            ...newProject,
          };
          setProjects((prev) => ({
            ...prev,
            upcoming: [newProjectObj, ...prev.upcoming],
          }));
          handleCloseModal();
        } else {
          console.error('Error adding project to database:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  const formatBudget = (budget) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(budget);
  

  const renderProjectCard = (project, section) => (
    <div
      key={project.project_id}
      onClick={() => handleProjectClick(project)}
      className="bg-zinc-800/50 p-4 rounded-xl shadow-lg cursor-pointer hover:bg-black/20 hover:shadow-xl transition-all duration-300 ease-in-out w-[270px] h-[280px] flex flex-col justify-between border border-white text-center hover:scale-105"
    >
      <div>
      <h2 className="font-bold text-2xl text-white">{project.name}</h2>

        <div className='mt-4'><span className="text-white mt-2">Budget: </span> <span className="text-purple-300 mt-2">{formatBudget(project.budget)}</span></div>
        <div className="mt-4">
          <p className="text-white mb-2">Completion:</p>
          <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${project.completion_percentage}%` }}
            />
          </div>
          <p className="text-purple-300 text-sm text-center mt-2">
            {project.completion_percentage}%
          </p>
        </div>
      </div>
    </div>
  );
  

  return (
    <div className="min-h-screen p-6 text-white">
      {isAdminBoolean && <AdminNavbar />} {!isAdminBoolean && <Navbar />}
      <h1 className="text-6xl sm:text-6xl md:text-7xl lg:text-6xl font-semibold mb-8 mt-8 text-center">
  <span className="text-white">Project</span> <span className="text-purple-600">Management</span> <span className="text-white">Dashboard</span> 
</h1>

{isAdminBoolean && (
  <div className="flex items-center justify-center mb-10">
    <div className="bg-black bg-opacity-50 p-6 rounded-lg shadow-xl border border-white flex flex-col justify-between items-center w-64 h-64">
      {/* Large Plus Icon */}
      <button
        onClick={handleOpenModal}
        className="text-purple-500 hover:text-purple-700 flex items-center justify-center w-full h-full"
      >
        <FaPlus size={50} />
      </button>

      {/* Bottom Section */}
      <div className="text-center w-full">
        <p className="text-gray-400 text-sm">
          {projects.completed.length} Completed
        </p>
        <p className="text-gray-400 text-sm">
          {projects.ongoing.length + projects.upcoming.length} Ongoing
        </p>
      </div>
    </div>
  </div>
)}

      {showModal && (
        <div className="fixed bg-black/80 inset-0 flex justify-center items-center z-10">
          <div className="bg-black border border-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">Add New Project</h2>
            <form>
              <div className="mb-4">
                <label className="block text-white">Project Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Budget</label>
                <input
                  type="number"
                  name="budget"
                  value={newProject.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white">Completion Percentage</label>
                <input
                  type="number"
                  name="completion_percentage"
                  value={newProject.completion_percentage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <section>
        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold mb-7 text-center">
  <span className="text-white">Ongoing</span> <span className="text-purple-600">Project</span>
</h1>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.ongoing.map((project) => renderProjectCard(project, 'ongoing'))}
          </div>
        </section>

        <section>
        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold mb-7 text-center">
  <span className="text-white">Upcoming</span> <span className="text-purple-600">Project</span>
</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.upcoming.map((project) => renderProjectCard(project, 'upcoming'))}
          </div>
        </section>

        <section>
        <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold mb-7 text-center">
  <span className="text-white">Completed</span> <span className="text-purple-600">Project</span>
</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.completed.map((project) => renderProjectCard(project, 'completed'))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectManagement;
