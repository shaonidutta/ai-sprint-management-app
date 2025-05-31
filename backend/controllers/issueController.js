const Issue = require('../models/Issue');
const Comment = require('../models/Comment');
const TimeLog = require('../models/TimeLog');
const logger = require('../config/logger');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/errors');

class IssueController {
  // GET /api/v1/boards/:boardId/issues
  static async getBoardIssues(req, res) {
    try {
      const { boardId } = req.params;
      const userId = req.user.id;
      const { page, limit, status, assigneeId, sprintId, search, issueType, priority } = req.query;

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 50,
        status,
        assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
        sprintId: sprintId ? parseInt(sprintId) : undefined,
        search: search || '',
        issueType,
        priority
      };

      const result = await Issue.findByBoardId(boardId, userId, options);

      res.status(200).json(formatSuccessResponse({
        message: 'Issues retrieved successfully',
        data: result
      }));
    } catch (error) {
      logger.error('Error getting board issues:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // GET /api/v1/issues/:id
  static async getIssueById(req, res) {
    try {
      const { id } = req.params;
      const issue = await Issue.findById(id);

      // Check if user has access to this issue's board
      const userId = req.user.id;
      const boardId = issue.board.id;
      
      // This will throw an error if user doesn't have access
      await Issue.findByBoardId(boardId, userId, { limit: 1 });

      res.status(200).json(formatSuccessResponse({
        message: 'Issue retrieved successfully',
        data: { issue }
      }));
    } catch (error) {
      logger.error('Error getting issue by ID:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // POST /api/v1/boards/:id/issues
  static async createIssue(req, res) {
    try {
      const { id: boardId } = req.params;
      const userId = req.user.id;
      const { 
        title, 
        description, 
        issueType, 
        priority, 
        assigneeId, 
        storyPoints, 
        originalEstimate, 
        sprintId 
      } = req.body;

      const issueData = {
        board_id: boardId,
        title,
        description,
        issue_type: issueType || 'Story',
        priority: priority || 'P3',
        assignee_id: assigneeId,
        story_points: storyPoints,
        original_estimate: originalEstimate,
        sprint_id: sprintId,
        reporter_id: userId
      };

      const issue = await Issue.create(issueData);

      res.status(201).json(formatSuccessResponse({
        message: 'Issue created successfully',
        data: { issue }
      }));
    } catch (error) {
      logger.error('Error creating issue:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // PUT /api/v1/issues/:id
  static async updateIssue(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { 
        title, 
        description, 
        issueType, 
        status, 
        priority, 
        assigneeId, 
        storyPoints, 
        originalEstimate, 
        timeRemaining,
        sprintId,
        blockedReason
      } = req.body;

      const issue = await Issue.findById(id);

      // Check if user has access to this issue
      const boardId = issue.board.id;
      await Issue.findByBoardId(boardId, userId, { limit: 1 });

      // Update issue properties
      if (title !== undefined) issue.title = title;
      if (description !== undefined) issue.description = description;
      if (issueType !== undefined) issue.issue_type = issueType;
      if (status !== undefined) issue.status = status;
      if (priority !== undefined) issue.priority = priority;
      if (assigneeId !== undefined) issue.assignee_id = assigneeId;
      if (storyPoints !== undefined) issue.story_points = storyPoints;
      if (originalEstimate !== undefined) issue.original_estimate = originalEstimate;
      if (timeRemaining !== undefined) issue.time_remaining = timeRemaining;
      if (sprintId !== undefined) issue.sprint_id = sprintId;
      if (blockedReason !== undefined) issue.blocked_reason = blockedReason;

      await issue.save();

      res.status(200).json(formatSuccessResponse({
        message: 'Issue updated successfully',
        data: { issue }
      }));
    } catch (error) {
      logger.error('Error updating issue:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // PATCH /api/v1/issues/:id/status
  static async updateIssueStatus(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { status, blockedReason } = req.body;

      const issue = await Issue.findById(id);

      // Check if user has access to this issue
      const boardId = issue.board.id;
      await Issue.findByBoardId(boardId, userId, { limit: 1 });

      // Update blocked reason if status is Blocked
      if (status === 'Blocked' && blockedReason) {
        issue.blocked_reason = blockedReason;
      }

      await issue.updateStatus(status, userId);

      res.status(200).json(formatSuccessResponse({
        message: 'Issue status updated successfully',
        data: { issue }
      }));
    } catch (error) {
      logger.error('Error updating issue status:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // DELETE /api/v1/issues/:id
  static async deleteIssue(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const issue = await Issue.findById(id);

      // Check if user has access to this issue
      const boardId = issue.board.id;
      await Issue.findByBoardId(boardId, userId, { limit: 1 });

      await issue.delete();

      res.status(200).json(formatSuccessResponse({
        message: 'Issue deleted successfully'
      }));
    } catch (error) {
      logger.error('Error deleting issue:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // GET /api/v1/issues/:id/comments
  static async getIssueComments(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { page, limit } = req.query;

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20
      };

      const result = await Comment.findByIssueId(id, userId, options);

      res.status(200).json(formatSuccessResponse({
        message: 'Issue comments retrieved successfully',
        data: result
      }));
    } catch (error) {
      logger.error('Error getting issue comments:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // POST /api/v1/issues/:id/comments
  static async createComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { content } = req.body;

      const commentData = {
        issue_id: id,
        user_id: userId,
        content
      };

      const comment = await Comment.create(commentData);

      res.status(201).json(formatSuccessResponse({
        message: 'Comment created successfully',
        data: { comment }
      }));
    } catch (error) {
      logger.error('Error creating comment:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // GET /api/v1/issues/:id/time-logs
  static async getIssueTimeLogs(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { page, limit, startDate, endDate } = req.query;

      const options = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        startDate,
        endDate
      };

      const result = await TimeLog.findByIssueId(id, userId, options);

      res.status(200).json(formatSuccessResponse({
        message: 'Issue time logs retrieved successfully',
        data: result
      }));
    } catch (error) {
      logger.error('Error getting issue time logs:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }

  // POST /api/v1/issues/:id/time-logs
  static async logTime(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { timeSpent, description, loggedDate } = req.body;

      const timeLogData = {
        issue_id: id,
        user_id: userId,
        time_spent: timeSpent,
        description,
        logged_date: loggedDate || new Date().toISOString().split('T')[0]
      };

      const timeLog = await TimeLog.create(timeLogData);

      res.status(201).json(formatSuccessResponse({
        message: 'Time logged successfully',
        data: { timeLog }
      }));
    } catch (error) {
      logger.error('Error logging time:', error);
      res.status(error.statusCode || 500).json(formatErrorResponse(error));
    }
  }
}

module.exports = IssueController;
