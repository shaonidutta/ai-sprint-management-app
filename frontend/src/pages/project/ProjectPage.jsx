import React, { useState } from 'react';
import { useParams, useNavigate, Link, Routes, Route } from 'react-router-dom';
import ProjectOverview from '../../components/project/ProjectOverview';
import ProjectSettings from '../../components/project/ProjectSettings';
import ProjectList from '../../components/project/ProjectList';
import CreateProjectForm from '../../components/project/CreateProjectForm';

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Temporary mock data - replace with actual API calls
  const mockProject = {
    id: 1,
    name: 'Project Alpha',
    description: 'A cutting-edge project management system',
    totalIssues: 42,
    activeSprintCount: 2,
    memberCount: 8,
    completedIssues: 156,
    visibility: 'private',
    defaultAssignee: 'projectLead',
    recentActivity: [
      {
        id: 1,
        description: 'Created a new sprint "Sprint 12"',
        timestamp: '2024-02-20T10:30:00Z',
        user: {
          name: 'John Doe',
          avatarUrl: 'https://via.placeholder.com/32',
        },
      },
      // Add more activity items...
    ],
    team: [
      {
        id: 1,
        name: 'John Doe',
        role: 'Project Lead',
        avatarUrl: 'https://via.placeholder.com/40',
      },
      // Add more team members...
    ],
  };

  const mockProjects = [
    mockProject,
    // Add more projects...
  ];

  const handleCreateProject = async (formData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log('Creating project:', formData);
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = async (formData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log('Updating project:', formData);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      console.log('Deleting project:', projectId);
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Project List */}
            <Route
              path="/"
              element={
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
                    <Link
                      to="/projects/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Project
                    </Link>
                  </div>
                  <ProjectList
                    projects={mockProjects}
                    isLoading={isLoading}
                  />
                </div>
              }
            />

            {/* Create Project */}
            <Route
              path="/new"
              element={
                <div>
                  <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Create New Project</h1>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by filling in the information below to create your new project.
                    </p>
                  </div>
                  <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <CreateProjectForm
                        onSubmit={handleCreateProject}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>
              }
            />

            {/* Project Details */}
            <Route
              path="/:projectId/*"
              element={
                projectId && (
                  <div>
                    {/* Project Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-gray-900">{mockProject.name}</h1>
                        <Link
                          to={`/projects/${projectId}/settings`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Project Settings
                        </Link>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{mockProject.description}</p>
                    </div>

                    {/* Project Navigation */}
                    <div className="mb-6 border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <Link
                          to={`/projects/${projectId}`}
                          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${window.location.pathname === `/projects/${projectId}`
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                          Overview
                        </Link>
                        <Link
                          to={`/projects/${projectId}/board`}
                          className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                          Board
                        </Link>
                        <Link
                          to={`/projects/${projectId}/backlog`}
                          className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                          Backlog
                        </Link>
                        <Link
                          to={`/projects/${projectId}/sprints`}
                          className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                          Sprints
                        </Link>
                        <Link
                          to={`/projects/${projectId}/reports`}
                          className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        >
                          Reports
                        </Link>
                      </nav>
                    </div>

                    {/* Project Content */}
                    <Routes>
                      <Route
                        path="/"
                        element={<ProjectOverview project={mockProject} />}
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProjectSettings
                            project={mockProject}
                            onUpdate={handleUpdateProject}
                            onDelete={handleDeleteProject}
                            isLoading={isLoading}
                          />
                        }
                      />
                      {/* Add more routes for other project sections */}
                    </Routes>
                  </div>
                )
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage; 