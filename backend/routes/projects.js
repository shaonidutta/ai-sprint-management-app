const express = require('express');
const router = express.Router();

// Import controllers
const projectController = require('../controllers/projectController');

// Import validators
const { 
  validateRequest, 
  validateParams, 
  validateQuery 
} = require('../validators/projectValidator');
const { 
  createProjectSchema,
  updateProjectSchema,
  projectSearchSchema,
  projectIdSchema
} = require('../validators/projectValidator');

// Import middleware
const authMiddleware = require('../middleware/auth');

/**
 * @route   POST /api/v1/projects
 * @desc    Create a new project
 * @access  Private
 */
router.post('/',
  authMiddleware.authenticate,
  validateRequest(createProjectSchema),
  projectController.createProject
);

/**
 * @route   GET /api/v1/projects
 * @desc    Get projects for current user
 * @access  Private
 */
router.get('/',
  authMiddleware.authenticate,
  validateQuery(projectSearchSchema),
  projectController.getProjects
);

/**
 * @route   GET /api/v1/projects/:id
 * @desc    Get project by ID
 * @access  Private
 */
router.get('/:id',
  authMiddleware.authenticate,
  validateParams(projectIdSchema),
  projectController.getProjectById
);

/**
 * @route   PUT /api/v1/projects/:id
 * @desc    Update project
 * @access  Private (Admin/Project Manager only)
 */
router.put('/:id',
  authMiddleware.authenticate,
  validateParams(projectIdSchema),
  validateRequest(updateProjectSchema),
  projectController.updateProject
);

/**
 * @route   DELETE /api/v1/projects/:id
 * @desc    Delete project (soft delete)
 * @access  Private (Owner only)
 */
router.delete('/:id',
  authMiddleware.authenticate,
  validateParams(projectIdSchema),
  projectController.deleteProject
);

module.exports = router;
