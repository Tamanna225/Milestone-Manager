import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState({
    upcoming: [
      { id: 1, name: 'New Library Construction', budget: 50000, completed: 0 },
      { id: 2, name: 'Bridge Renovation', budget: 75000, completed: 0 },
    ],
    ongoing: [
      { id: 3, name: 'School Building', budget: 120000, completed: 40 },
      { id: 4, name: 'Road Paving', budget: 80000, completed: 60 },
    ],
    completed: [
      { id: 5, name: 'Community Park', budget: 100000, completed: 100 },
    ],
  });

  const handleMoveProject = (id, fromSection, toSection) => {
    const project = projects[fromSection].find((proj) => proj.id === id);
    setProjects((prev) => ({
      ...prev,
      [fromSection]: prev[fromSection].filter((proj) => proj.id !== id),
      [toSection]: [...prev[toSection], project],
    }));
  };

  const handleProjectClick = (project) => {
    navigate(`/projects/${project.id}`, { state: project });
  };

  const renderProjectCard = (project, section) => (
    <div
      key={project.id}
      onClick={() => handleProjectClick(project)}
      className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
    >
      <h3 className="font-bold text-lg">{project.name}</h3>
      <p>Budget: ${project.budget}</p>
      <p>Completion: {project.completed}%</p>
      {section !== 'completed' && (
        <div className="mt-2">
          {section === 'upcoming' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveProject(project.id, 'upcoming', 'ongoing');
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
            >
              Start Project
            </button>
          )}
          {section === 'ongoing' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveProject(project.id, 'ongoing', 'completed');
              }}
              className="bg-green-500 text-white px-3 py-1 rounded-md"
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Project Management</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">Ongoing Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.ongoing.map((project) => renderProjectCard(project, 'ongoing'))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-yellow-500">Upcoming Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.upcoming.map((project) => renderProjectCard(project, 'upcoming'))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-green-600">Completed Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.completed.map((project) => renderProjectCard(project, 'completed'))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectManagement;
