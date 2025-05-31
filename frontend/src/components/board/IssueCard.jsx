import React from 'react';
import PropTypes from 'prop-types';
import { Card, Badge, Avatar, Tooltip } from '../common';

const IssueCard = ({
  issue,
  onClick,
  view = 'board', // board, list, compact
  className = '',
}) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'P1':
        return <Badge variant="priority-p1" size="small">P1</Badge>;
      case 'P2':
        return <Badge variant="priority-p2" size="small">P2</Badge>;
      case 'P3':
        return <Badge variant="priority-p3" size="small">P3</Badge>;
      case 'P4':
        return <Badge variant="priority-p4" size="small">P4</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'To Do':
        return <Badge variant="status-todo" size="small">To Do</Badge>;
      case 'In Progress':
        return <Badge variant="status-in-progress" size="small">In Progress</Badge>;
      case 'Done':
        return <Badge variant="status-done" size="small">Done</Badge>;
      case 'Blocked':
        return <Badge variant="status-blocked" size="small">Blocked</Badge>;
      default:
        return null;
    }
  };

  const renderBoardView = () => (
    <Card
      variant="default"
      elevation="low"
      interactive
      onClick={onClick}
      className={`hover:border-blue-300 ${className}`}
    >
      {/* Issue Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {issue.type && (
            <Tooltip content={issue.type}>
              <span className="text-gray-500">
                {issue.type === 'bug' ? '🐛' : '✨'}
              </span>
            </Tooltip>
          )}
          <span className="text-xs text-gray-500">
            {issue.key}
          </span>
        </div>
        {getPriorityBadge(issue.priority)}
      </div>

      {/* Issue Title */}
      <h4 className="text-sm font-medium text-gray-900 mb-2">
        {issue.title}
      </h4>

      {/* Issue Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          {issue.assignee && (
            <Tooltip content={issue.assignee.name}>
              <div>
                <Avatar
                  src={issue.assignee.avatar}
                  alt={issue.assignee.name}
                  size="tiny"
                />
              </div>
            </Tooltip>
          )}
          {issue.storyPoints && (
            <span className="text-xs text-gray-500">
              {issue.storyPoints} pts
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {issue.dueDate && (
            <Tooltip content={new Date(issue.dueDate).toLocaleDateString()}>
              <span className="text-xs text-gray-500">
                📅
              </span>
            </Tooltip>
          )}
          {issue.comments > 0 && (
            <Tooltip content={`${issue.comments} comments`}>
              <span className="text-xs text-gray-500">
                💬 {issue.comments}
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </Card>
  );

  const renderListView = () => (
    <Card
      variant="default"
      elevation="low"
      interactive
      onClick={onClick}
      className={`hover:border-blue-300 ${className}`}
    >
      <div className="flex items-center">
        {/* Issue Key and Type */}
        <div className="flex items-center space-x-3 w-32">
          {issue.type && (
            <Tooltip content={issue.type}>
              <span className="text-gray-500">
                {issue.type === 'bug' ? '🐛' : '✨'}
              </span>
            </Tooltip>
          )}
          <span className="text-sm text-gray-500">
            {issue.key}
          </span>
        </div>

        {/* Issue Title */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {issue.title}
          </h4>
        </div>

        {/* Status */}
        <div className="ml-4 w-32">
          {getStatusBadge(issue.status)}
        </div>

        {/* Priority */}
        <div className="ml-4 w-24">
          {getPriorityBadge(issue.priority)}
        </div>

        {/* Assignee */}
        <div className="ml-4 w-32">
          {issue.assignee && (
            <div className="flex items-center space-x-2">
              <Avatar
                src={issue.assignee.avatar}
                alt={issue.assignee.name}
                size="tiny"
              />
              <span className="text-sm text-gray-600 truncate">
                {issue.assignee.name}
              </span>
            </div>
          )}
        </div>

        {/* Story Points */}
        <div className="ml-4 w-16 text-right">
          {issue.storyPoints && (
            <span className="text-sm text-gray-500">
              {issue.storyPoints} pts
            </span>
          )}
        </div>
      </div>
    </Card>
  );

  const renderCompactView = () => (
    <div
      className={`
        flex items-center py-2 px-3 hover:bg-gray-50 cursor-pointer
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2 w-32">
        {issue.type && (
          <span className="text-gray-500">
            {issue.type === 'bug' ? '🐛' : '✨'}
          </span>
        )}
        <span className="text-xs text-gray-500">{issue.key}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm text-gray-900 truncate">{issue.title}</h4>
      </div>
      {issue.assignee && (
        <Avatar
          src={issue.assignee.avatar}
          alt={issue.assignee.name}
          size="tiny"
          className="ml-2"
        />
      )}
    </div>
  );

  switch (view) {
    case 'list':
      return renderListView();
    case 'compact':
      return renderCompactView();
    default:
      return renderBoardView();
  }
};

IssueCard.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string,
    assignee: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }),
    storyPoints: PropTypes.number,
    dueDate: PropTypes.string,
    comments: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  view: PropTypes.oneOf(['board', 'list', 'compact']),
  className: PropTypes.string,
};

export default IssueCard; 