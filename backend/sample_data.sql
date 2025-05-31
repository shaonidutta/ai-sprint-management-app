-- Sample Data for AI Sprint Management App
-- This file contains realistic sample data for development and testing
-- Run this after the database migration to populate tables with test data

USE sprint_management;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE user_activities;
-- TRUNCATE TABLE ai_requests;
-- TRUNCATE TABLE time_logs;
-- TRUNCATE TABLE issue_comments;
-- TRUNCATE TABLE issues;
-- TRUNCATE TABLE sprints;
-- TRUNCATE TABLE board_columns;
-- TRUNCATE TABLE boards;
-- TRUNCATE TABLE user_projects;
-- TRUNCATE TABLE projects;
-- TRUNCATE TABLE email_verifications;
-- TRUNCATE TABLE refresh_tokens;
-- TRUNCATE TABLE users;

-- Insert Users
INSERT INTO users (id, first_name, last_name, email, password_hash, is_email_verified, avatar_url, created_at, updated_at) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', TRUE, NULL, NOW(), NOW()),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', TRUE, NULL, NOW(), NOW()),
(3, 'Mike', 'Johnson', 'mike.johnson@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', TRUE, NULL, NOW(), NOW()),
(4, 'Sarah', 'Wilson', 'sarah.wilson@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', TRUE, NULL, NOW(), NOW()),
(5, 'David', 'Brown', 'david.brown@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', TRUE, NULL, NOW(), NOW()),
(6, 'Emily', 'Davis', 'emily.davis@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', TRUE, NULL, NOW(), NOW()),
(7, 'Alex', 'Miller', 'alex.miller@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', FALSE, NULL, NOW(), NOW()),
(8, 'Lisa', 'Garcia', 'lisa.garcia@example.com', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQ', TRUE, NULL, NOW(), NOW());

-- Insert Projects
INSERT INTO projects (id, name, description, project_key, owner_id, ai_requests_count, ai_requests_reset_date, is_active, created_at, updated_at) VALUES
(1, 'E-Commerce Platform', 'Modern e-commerce platform with React and Node.js', 'ECOM', 1, 5, CURDATE(), TRUE, NOW(), NOW()),
(2, 'Mobile Banking App', 'Secure mobile banking application for iOS and Android', 'BANK', 2, 12, CURDATE(), TRUE, NOW(), NOW()),
(3, 'Healthcare Management System', 'Comprehensive healthcare management and patient tracking system', 'HMS', 3, 3, CURDATE(), TRUE, NOW(), NOW()),
(4, 'Learning Management System', 'Online learning platform with video streaming and assessments', 'LMS', 1, 8, CURDATE(), TRUE, NOW(), NOW()),
(5, 'Inventory Management', 'Real-time inventory tracking and management system', 'INV', 4, 1, CURDATE(), TRUE, NOW(), NOW());

-- Insert User-Project relationships
INSERT INTO user_projects (user_id, project_id, role, created_at) VALUES
-- E-Commerce Platform team
(1, 1, 'Admin', NOW()),
(2, 1, 'Project Manager', NOW()),
(3, 1, 'Developer', NOW()),
(4, 1, 'Developer', NOW()),
(5, 1, 'Developer', NOW()),
-- Mobile Banking App team
(2, 2, 'Admin', NOW()),
(1, 2, 'Project Manager', NOW()),
(6, 2, 'Developer', NOW()),
(7, 2, 'Developer', NOW()),
-- Healthcare Management System team
(3, 3, 'Admin', NOW()),
(4, 3, 'Project Manager', NOW()),
(5, 3, 'Developer', NOW()),
(8, 3, 'Developer', NOW()),
-- Learning Management System team
(1, 4, 'Admin', NOW()),
(3, 4, 'Project Manager', NOW()),
(6, 4, 'Developer', NOW()),
(7, 4, 'Developer', NOW()),
-- Inventory Management team
(4, 5, 'Admin', NOW()),
(2, 5, 'Project Manager', NOW()),
(8, 5, 'Developer', NOW());

-- Insert Boards
INSERT INTO boards (id, project_id, name, description, is_default, created_by, created_at, updated_at) VALUES
(1, 1, 'ECOM Development Board', 'Main development board for e-commerce platform', TRUE, 1, NOW(), NOW()),
(2, 1, 'ECOM Bug Tracking', 'Bug tracking and fixes for e-commerce platform', FALSE, 2, NOW(), NOW()),
(3, 2, 'BANK Main Board', 'Primary development board for banking app', TRUE, 2, NOW(), NOW()),
(4, 3, 'HMS Development', 'Healthcare system development board', TRUE, 3, NOW(), NOW()),
(5, 4, 'LMS Feature Board', 'Learning management system features', TRUE, 1, NOW(), NOW()),
(6, 5, 'INV Sprint Board', 'Inventory management sprint board', TRUE, 4, NOW(), NOW());

-- Insert Board Columns
INSERT INTO board_columns (id, board_id, name, status_mapping, position, wip_limit, is_active, created_at, updated_at) VALUES
-- E-Commerce Platform board columns
(1, 1, 'Backlog', 'To Do', 1, NULL, TRUE, NOW(), NOW()),
(2, 1, 'In Development', 'In Progress', 2, 3, TRUE, NOW(), NOW()),
(3, 1, 'Code Review', 'In Progress', 3, 2, TRUE, NOW(), NOW()),
(4, 1, 'Testing', 'In Progress', 4, 2, TRUE, NOW(), NOW()),
(5, 1, 'Done', 'Done', 5, NULL, TRUE, NOW(), NOW()),
-- Banking App board columns
(6, 3, 'To Do', 'To Do', 1, NULL, TRUE, NOW(), NOW()),
(7, 3, 'In Progress', 'In Progress', 2, 4, TRUE, NOW(), NOW()),
(8, 3, 'Review', 'In Progress', 3, 2, TRUE, NOW(), NOW()),
(9, 3, 'Completed', 'Done', 4, NULL, TRUE, NOW(), NOW()),
(10, 3, 'Blocked', 'Blocked', 5, NULL, TRUE, NOW(), NOW());

-- Insert Sprints
INSERT INTO sprints (id, board_id, name, goal, start_date, end_date, status, capacity_story_points, created_by, created_at, updated_at) VALUES
(1, 1, 'ECOM Sprint 1', 'Implement user authentication and product catalog', '2024-01-01', '2024-01-14', 'Completed', 40, 1, NOW(), NOW()),
(2, 1, 'ECOM Sprint 2', 'Shopping cart and checkout functionality', '2024-01-15', '2024-01-28', 'Completed', 45, 1, NOW(), NOW()),
(3, 1, 'ECOM Sprint 3', 'Payment integration and order management', '2024-01-29', '2024-02-11', 'Active', 42, 1, NOW(), NOW()),
(4, 3, 'BANK Sprint 1', 'Core banking features and security implementation', '2024-01-08', '2024-01-21', 'Active', 50, 2, NOW(), NOW()),
(5, 4, 'HMS Sprint 1', 'Patient registration and appointment scheduling', '2024-01-10', '2024-01-23', 'Planning', 35, 3, NOW(), NOW()),
(6, 5, 'LMS Sprint 1', 'Course creation and user enrollment system', '2024-01-05', '2024-01-18', 'Active', 38, 1, NOW(), NOW());

-- Insert Issues
INSERT INTO issues (id, board_id, sprint_id, title, description, issue_type, status, priority, story_points, original_estimate, time_spent, time_remaining, assignee_id, reporter_id, blocked_reason, issue_order, created_at, updated_at) VALUES
-- E-Commerce Platform issues
(1, 1, 1, 'User Registration System', 'Implement user registration with email verification', 'Story', 'Done', 'P2', 8, 480, 420, 3, 1, NULL, 1, NOW(), NOW()),
(2, 1, 1, 'Product Catalog API', 'Create REST API for product catalog management', 'Story', 'Done', 'P1', 13, 600, 580, 4, 1, NULL, 2, NOW(), NOW()),
(3, 1, 2, 'Shopping Cart Frontend', 'React components for shopping cart functionality', 'Story', 'Done', 'P2', 5, 300, 280, 5, 2, NULL, 3, NOW(), NOW()),
(4, 1, 2, 'Checkout Process', 'Multi-step checkout with address and payment', 'Story', 'Done', 'P1', 8, 480, 450, 3, 2, NULL, 4, NOW(), NOW()),
(5, 1, 3, 'Payment Gateway Integration', 'Integrate Stripe payment processing', 'Story', 'In Progress', 'P1', 13, 720, 360, 4, 1, NULL, 5, NOW(), NOW()),
(6, 1, 3, 'Order Management Dashboard', 'Admin dashboard for order management', 'Story', 'To Do', 'P2', 8, 480, 0, 5, 1, NULL, 6, NOW(), NOW()),
(7, 1, NULL, 'Fix cart calculation bug', 'Cart total calculation incorrect with discounts', 'Bug', 'To Do', 'P1', 3, 180, 0, 3, 4, NULL, 7, NOW(), NOW()),
(8, 1, 3, 'Email Notifications', 'Send order confirmation and shipping emails', 'Task', 'In Progress', 'P3', 5, 300, 120, 5, 2, NULL, 8, NOW(), NOW()),

-- Banking App issues
(9, 3, 4, 'Account Balance API', 'Secure API for account balance retrieval', 'Story', 'In Progress', 'P1', 8, 480, 240, 6, 2, NULL, 1, NOW(), NOW()),
(10, 3, 4, 'Transaction History', 'Display user transaction history with filters', 'Story', 'To Do', 'P2', 5, 300, 0, 7, 2, NULL, 2, NOW(), NOW()),
(11, 3, 4, 'Two-Factor Authentication', 'Implement 2FA for enhanced security', 'Story', 'In Progress', 'P1', 13, 720, 180, 6, 1, NULL, 3, NOW(), NOW()),
(12, 3, NULL, 'Security Audit', 'Comprehensive security review and testing', 'Task', 'Blocked', 'P1', 8, 480, 0, NULL, 2, 'Waiting for security team availability', 4, NOW(), NOW()),

-- Healthcare Management issues
(13, 4, 5, 'Patient Registration Form', 'Digital patient registration with validation', 'Story', 'To Do', 'P2', 5, 300, 0, 5, 3, NULL, 1, NOW(), NOW()),
(14, 4, 5, 'Appointment Scheduling System', 'Calendar-based appointment booking', 'Story', 'To Do', 'P1', 13, 720, 0, 8, 3, NULL, 2, NOW(), NOW()),
(15, 4, NULL, 'HIPAA Compliance Review', 'Ensure all features meet HIPAA requirements', 'Task', 'To Do', 'P1', 8, 480, 0, NULL, 4, NULL, 3, NOW(), NOW()),

-- Learning Management issues
(16, 5, 6, 'Course Creation Interface', 'UI for instructors to create and manage courses', 'Story', 'In Progress', 'P2', 8, 480, 200, 6, 1, NULL, 1, NOW(), NOW()),
(17, 5, 6, 'Student Enrollment System', 'Allow students to browse and enroll in courses', 'Story', 'To Do', 'P2', 5, 300, 0, 7, 1, NULL, 2, NOW(), NOW()),
(18, 5, NULL, 'Video Streaming Setup', 'Configure video streaming infrastructure', 'Task', 'To Do', 'P3', 13, 720, 0, NULL, 3, NULL, 3, NOW(), NOW());

-- Insert Issue Comments
INSERT INTO issue_comments (id, issue_id, user_id, comment, created_at, updated_at) VALUES
(1, 1, 3, 'Started working on the user registration form. Will implement email validation first.', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
(2, 1, 1, 'Great! Make sure to include password strength validation as well.', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY),
(3, 1, 3, 'Email verification is complete. Moving on to password validation.', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(4, 2, 4, 'API endpoints for product CRUD operations are ready. Need to add search functionality.', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY),
(5, 2, 1, 'Excellent work! The search feature should include filters by category and price range.', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
(6, 5, 4, 'Stripe integration is more complex than expected. May need additional time.', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(7, 5, 1, 'Let me know if you need help with the webhook implementation.', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY),
(8, 9, 6, 'Working on the balance API. Implementing additional security measures.', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(9, 11, 6, 'SMS-based 2FA is implemented. Testing with different phone number formats.', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(10, 16, 6, 'Course creation form is 70% complete. Adding rich text editor for course descriptions.', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY);

-- Insert Time Logs
INSERT INTO time_logs (id, issue_id, user_id, hours_logged, description, logged_date, created_at) VALUES
(1, 1, 3, 2, 'Set up user registration form structure and validation', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
(2, 1, 3, 3, 'Implemented email verification system', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY),
(3, 1, 3, 2, 'Added password strength validation and testing', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(4, 2, 4, 4, 'Created product model and basic CRUD endpoints', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY),
(5, 2, 4, 3, 'Implemented product search and filtering', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY),
(6, 2, 4, 3, 'Added pagination and sorting to product API', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY),
(7, 3, 5, 3, 'Created shopping cart React components', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(8, 3, 5, 2, 'Implemented cart state management with Redux', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY),
(9, 4, 3, 3, 'Designed checkout flow and form validation', NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY),
(10, 4, 3, 5, 'Implemented multi-step checkout process', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY),
(11, 5, 4, 4, 'Research and setup Stripe integration', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(12, 5, 4, 2, 'Implemented payment processing endpoints', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(13, 8, 5, 2, 'Set up email service configuration', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(14, 9, 6, 3, 'Implemented secure account balance API', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(15, 9, 6, 1, 'Added additional security validations', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(16, 11, 6, 2, 'Research 2FA implementation options', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY),
(17, 11, 6, 1, 'Implemented SMS-based 2FA', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY),
(18, 16, 6, 2, 'Created course creation form layout', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY),
(19, 16, 6, 1, 'Integrated rich text editor for course content', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY);

-- Insert AI Requests
INSERT INTO ai_requests (id, user_id, project_id, feature, request_data, response_data, created_at) VALUES
(1, 1, 1, 'sprint_planning', '{"sprintGoal":"Implement core e-commerce features","capacity":40,"issues":[{"id":1,"title":"User Registration"},{"id":2,"title":"Product Catalog"}]}', '{"recommended_issues":[1,2],"priority_order":[2,1],"risks":["Complex authentication requirements"],"suggestions":["Focus on security first"],"capacity_analysis":"Well within team capacity"}', NOW() - INTERVAL 10 DAY),
(2, 2, 2, 'risk_assessment', '{"teamSize":4,"totalIssues":4,"blockedIssues":1}', '{"overall_risk_level":"Medium","risks":[{"category":"Resource","description":"One blocked issue affecting timeline","impact":"Medium","probability":"High","mitigation":"Allocate additional security resources"}],"recommendations":["Address blocked security audit immediately"]}', NOW() - INTERVAL 8 DAY),
(3, 1, 1, 'scope_creep_detection', '{"sprintGoal":"Shopping cart implementation","originalIssues":[{"id":3,"title":"Shopping Cart Frontend"}],"currentIssues":[{"id":3,"title":"Shopping Cart Frontend"},{"id":7,"title":"Fix cart calculation bug"}]}', '{"severity":"Low","scope_creep_detected":true,"added_work":["Bug fix for cart calculations"],"impact_analysis":"Minor scope addition, should not affect sprint goal","recommendations":["Include bug fix in current sprint as it relates to main feature"]}', NOW() - INTERVAL 5 DAY),
(4, 3, 3, 'sprint_planning', '{"sprintGoal":"Patient management foundation","capacity":35,"issues":[{"id":13,"title":"Patient Registration"},{"id":14,"title":"Appointment Scheduling"}]}', '{"recommended_issues":[13,14],"priority_order":[13,14],"risks":["HIPAA compliance requirements"],"suggestions":["Ensure compliance review is scheduled"],"capacity_analysis":"Appropriate workload for team size"}', NOW() - INTERVAL 3 DAY),
(5, 1, 4, 'retrospective_insights', '{"sprintData":{"goal":"Course creation system","plannedPoints":13,"completedPoints":8,"completedIssues":0,"totalIssues":2},"teamFeedback":{"wentWell":"Good collaboration","improvements":"Need better time estimation"},"metrics":{"velocity":8}}', '{"performance_analysis":"Sprint velocity below planned capacity","productivity_insights":["Team collaboration is strong","Time estimation needs improvement"],"improvement_suggestions":["Implement story point poker for better estimation","Break down large stories into smaller tasks"],"action_items":["Schedule estimation training session","Review story breakdown process"],"overall_rating":"Good"}', NOW() - INTERVAL 1 DAY);

-- Insert User Activities
INSERT INTO user_activities (id, user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at) VALUES
(1, 1, 'login', NULL, NULL, '{"email":"john.doe@example.com"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL 1 HOUR),
(2, 1, 'project_created', 'project', 1, '{"name":"E-Commerce Platform","project_key":"ECOM"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL 15 DAY),
(3, 2, 'login', NULL, NULL, '{"email":"jane.smith@example.com"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL 2 HOUR),
(4, 2, 'project_created', 'project', 2, '{"name":"Mobile Banking App","project_key":"BANK"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL 12 DAY),
(5, 3, 'issue_created', 'issue', 1, '{"title":"User Registration System","issue_type":"Story"}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', NOW() - INTERVAL 10 DAY),
(6, 4, 'issue_created', 'issue', 2, '{"title":"Product Catalog API","issue_type":"Story"}', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL 10 DAY),
(7, 1, 'sprint_created', 'sprint', 1, '{"name":"ECOM Sprint 1","goal":"Implement user authentication and product catalog"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL 14 DAY),
(8, 3, 'issue_status_changed', 'issue', 1, '{"old_status":"To Do","new_status":"In Progress"}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', NOW() - INTERVAL 8 DAY),
(9, 3, 'issue_status_changed', 'issue', 1, '{"old_status":"In Progress","new_status":"Done"}', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', NOW() - INTERVAL 5 DAY),
(10, 1, 'ai_request_made', 'ai_request', 1, '{"feature":"sprint_planning","request_summary":"Sprint planning for e-commerce features"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL 10 DAY),
(11, 5, 'time_logged', 'time_log', 7, '{"time_spent":150,"issue_id":3}', '192.168.1.104', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', NOW() - INTERVAL 7 DAY),
(12, 6, 'comment_created', 'comment', 8, '{"issue_id":9,"comment_preview":"Working on the balance API..."}', '192.168.1.105', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL 3 DAY),
(13, 2, 'team_member_added', 'project', 1, '{"added_user":"mike.johnson@example.com","role":"Developer"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', NOW() - INTERVAL 14 DAY),
(14, 4, 'sprint_started', 'sprint', 5, '{"name":"HMS Sprint 1","start_date":"2024-01-10","end_date":"2024-01-23"}', '192.168.1.103', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL 2 DAY),
(15, 1, 'profile_updated', 'user', 1, '{"updated_fields":["first_name","last_name"]}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', NOW() - INTERVAL 5 DAY);

-- Insert Email Verifications (some pending, some completed)
INSERT INTO email_verifications (id, user_id, token, expires_at, verified_at, created_at) VALUES
(1, 7, 'verify_token_alex_miller_123456', NOW() + INTERVAL 24 HOUR, NULL, NOW() - INTERVAL 2 HOUR),
(2, 1, 'verify_token_john_doe_789012', NOW() + INTERVAL 24 HOUR, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY),
(3, 2, 'verify_token_jane_smith_345678', NOW() + INTERVAL 24 HOUR, NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 12 DAY);

-- Insert Refresh Tokens (active sessions)
INSERT INTO refresh_tokens (id, user_id, token, expires_at, created_at) VALUES
(1, 1, 'refresh_token_john_doe_abcdef123456', NOW() + INTERVAL 7 DAY, NOW() - INTERVAL 1 HOUR),
(2, 2, 'refresh_token_jane_smith_ghijkl789012', NOW() + INTERVAL 7 DAY, NOW() - INTERVAL 2 HOUR),
(3, 3, 'refresh_token_mike_johnson_mnopqr345678', NOW() + INTERVAL 7 DAY, NOW() - INTERVAL 30 MINUTE),
(4, 6, 'refresh_token_emily_davis_stuvwx901234', NOW() + INTERVAL 7 DAY, NOW() - INTERVAL 45 MINUTE);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Summary of inserted data
SELECT 'Sample data insertion completed!' as status;
SELECT
  'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'User Projects', COUNT(*) FROM user_projects
UNION ALL
SELECT 'Boards', COUNT(*) FROM boards
UNION ALL
SELECT 'Board Columns', COUNT(*) FROM board_columns
UNION ALL
SELECT 'Sprints', COUNT(*) FROM sprints
UNION ALL
SELECT 'Issues', COUNT(*) FROM issues
UNION ALL
SELECT 'Issue Comments', COUNT(*) FROM issue_comments
UNION ALL
SELECT 'Time Logs', COUNT(*) FROM time_logs
UNION ALL
SELECT 'AI Requests', COUNT(*) FROM ai_requests
UNION ALL
SELECT 'User Activities', COUNT(*) FROM user_activities
UNION ALL
SELECT 'Email Verifications', COUNT(*) FROM email_verifications
UNION ALL
SELECT 'Refresh Tokens', COUNT(*) FROM refresh_tokens;
