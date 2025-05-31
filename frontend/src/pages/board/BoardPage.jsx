import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Board,
  IssueList,
  CreateIssueForm,
  CreateBoardForm,
} from '../../components/board';
import { Modal, Tabs, Button } from '../../components/common';

const MOCK_ISSUES = [
  {
    id: '1',
    key: 'PROJ-1',
    title: 'Implement user authentication',
    type: 'task',
    status: 'In Progress',
    priority: 'P2',
    assignee: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?u=1',
    },
    updatedAt: '2024-03-15T10:00:00Z',
  },
  // Add more mock issues as needed
];

const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  // Add more mock users as needed
];

const BoardPage = () => {
  const { projectKey } = useParams();
  const navigate = useNavigate();

  const [view, setView] = useState('board'); // 'board' or 'list'
  const [isCreateIssueModalOpen, setIsCreateIssueModalOpen] = useState(false);
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleIssueClick = (issue) => {
    navigate(`/projects/${projectKey}/issues/${issue.key}`);
  };

  const handleIssueMove = async (issue, sourceStatus, destinationStatus) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to update issue status
      console.log('Moving issue', { issue, sourceStatus, destinationStatus });
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError('Failed to update issue status');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateIssue = async (formData) => {
    if (!formData) {
      setIsCreateIssueModalOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to create issue
      console.log('Creating issue', formData);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCreateIssueModalOpen(false);
    } catch (err) {
      setError('Failed to create issue');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (formData) => {
    if (!formData) {
      setIsCreateBoardModalOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to create board
      console.log('Creating board', formData);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsCreateBoardModalOpen(false);
    } catch (err) {
      setError('Failed to create board');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {projectKey} Board
        </h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="primary"
            onClick={() => setIsCreateIssueModalOpen(true)}
          >
            Create Issue
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsCreateBoardModalOpen(true)}
          >
            Create Board
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="mb-6">
        <Tabs
          value={view}
          onChange={setView}
          tabs={[
            { value: 'board', label: 'Board View' },
            { value: 'list', label: 'List View' },
          ]}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      {view === 'board' ? (
        <Board
          issues={MOCK_ISSUES}
          onIssueClick={handleIssueClick}
          onIssueMove={handleIssueMove}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <IssueList
          issues={MOCK_ISSUES}
          onIssueClick={handleIssueClick}
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Create Issue Modal */}
      <Modal
        isOpen={isCreateIssueModalOpen}
        onClose={() => setIsCreateIssueModalOpen(false)}
        title="Create Issue"
      >
        <CreateIssueForm
          onSubmit={handleCreateIssue}
          projectKey={projectKey}
          users={MOCK_USERS}
          isLoading={isLoading}
        />
      </Modal>

      {/* Create Board Modal */}
      <Modal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
        title="Create Board"
      >
        <CreateBoardForm
          onSubmit={handleCreateBoard}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default BoardPage; 