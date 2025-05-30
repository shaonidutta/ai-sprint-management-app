# AI Sprint Management App - Product Requirements Document

## 1. Product Overview

### 1.1 Vision
An AI-powered sprint management tool that helps development teams plan, track, and optimize their agile workflows with intelligent insights and automation.

### 1.2 Target Users
- **Project Managers**: Plan and oversee sprints, track team progress
- **Development Team Members**: Manage tasks, log time, update issue status
- **Team Leads/Scrum Masters**: Facilitate sprint ceremonies, analyze team performance
- **Stakeholders**: View project progress and reports

### 1.3 Core Value Propositions
- AI-assisted sprint planning and risk assessment
- Simplified Kanban board management
- Automated scope creep detection
- Intelligent retrospective insights
- Cost-effective alternative to enterprise tools

## 2. User Stories & Functional Requirements

### 2.1 Authentication & User Management
**As a new user, I want to:**
- Register with email and password
- Verify my email to unlock full features
- Log in securely with JWT tokens
- Reset my password if forgotten
- Update my profile information

**As a system admin, I want to:**
- Manage user roles and permissions
- View user activity logs
- Deactivate user accounts when needed

### 2.2 Project Management
**As a project manager, I want to:**
- Create new projects with unique keys
- Invite team members to projects
- Assign roles (Admin, Project Manager, Developer)
- Remove team members from projects
- View project overview and statistics

**As a team member, I want to:**
- View projects I'm assigned to
- See my role and permissions in each project
- Leave projects I no longer work on

### 2.3 Board & Sprint Management
**As a project manager, I want to:**
- Create multiple boards per project
- Start and end sprints on each board
- Set sprint goals and duration
- Plan sprint capacity based on story points
- View sprint burndown charts

**As a team member, I want to:**
- View active sprints across my projects
- See sprint progress and remaining work
- Understand sprint goals and deadlines

### 2.4 Issue Management
**As any user, I want to:**
- Create issues with title, description, priority
- Assign issues to team members
- Set story points and time estimates
- Move issues through workflow states
- Add comments and attachments to issues
- Filter and search issues
- Track time spent on issues

**As a developer, I want to:**
- View issues assigned to me
- Update issue status as I work
- Log time spent on tasks
- Mark issues as blocked with reasons

### 2.5 AI Features
**As a project manager, I want to:**
- Get AI suggestions for sprint planning
- Receive alerts about scope creep
- Get risk assessments for current sprint
- Generate retrospective insights automatically

## 3. Technical Architecture

### 3.1 Technology Stack
- **Backend**: Node.js with Express.js
- **Frontend**: React.js (JavaScript)
- **Database**: MySQL 8.0+
- **Authentication**: JWT with refresh tokens
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Email Service**: NodeMailer with SMTP

### 3.2 Environment Configuration
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sprint_management
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.3

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@sprintmanager.com

# App
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

## 4. Database Schema (MySQL)

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires DATETIME,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_key VARCHAR(10) UNIQUE NOT NULL,
    owner_id INT NOT NULL,
    ai_requests_count INT DEFAULT 0,
    ai_requests_reset_date DATE DEFAULT (CURDATE()),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- User-Project relationship (many-to-many)
CREATE TABLE user_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    role ENUM('Admin', 'Project Manager', 'Developer') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    UNIQUE KEY unique_active_user_project (user_id, project_id, deleted_at)
);

-- Boards table
CREATE TABLE boards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Sprints table
CREATE TABLE sprints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    goal TEXT,
    start_date DATE,
    end_date DATE,
    capacity_story_points INT,
    status ENUM('Planning', 'Active', 'Completed') DEFAULT 'Planning',
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Issues table
CREATE TABLE issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    board_id INT NOT NULL,
    sprint_id INT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    issue_type ENUM('Story', 'Bug', 'Task', 'Epic') DEFAULT 'Story',
    status ENUM('To Do', 'In Progress', 'Done', 'Blocked') DEFAULT 'To Do',
    priority ENUM('P1', 'P2', 'P3', 'P4') DEFAULT 'P3',
    story_points INT NULL,
    original_estimate INT NULL, -- in hours
    time_spent INT DEFAULT 0, -- in hours
    time_remaining INT NULL, -- in hours
    assignee_id INT NULL,
    reporter_id INT NOT NULL,
    blocked_reason TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id),
    FOREIGN KEY (sprint_id) REFERENCES sprints(id),
    FOREIGN KEY (assignee_id) REFERENCES users(id),
    FOREIGN KEY (reporter_id) REFERENCES users(id)
);
```

### 4.2 Supporting Tables
```sql
-- Refresh tokens for JWT
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Issue comments
CREATE TABLE issue_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Time tracking logs
CREATE TABLE time_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    issue_id INT NOT NULL,
    user_id INT NOT NULL,
    hours_logged INT NOT NULL,
    description TEXT,
    logged_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (issue_id) REFERENCES issues(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- AI request tracking
CREATE TABLE ai_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    feature VARCHAR(50) NOT NULL,
    request_data JSON,
    response_data JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Email verification tokens
CREATE TABLE email_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    verified_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 5. API Endpoints Specification

### 5.1 Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
PUT  /api/auth/profile
```

### 5.2 Project Management Endpoints
```
GET    /api/projects                    # Get user's projects
POST   /api/projects                    # Create new project
GET    /api/projects/:id                # Get project details
PUT    /api/projects/:id                # Update project
DELETE /api/projects/:id                # Delete project
GET    /api/projects/:id/members        # Get project members
POST   /api/projects/:id/members        # Add member to project
PUT    /api/projects/:id/members/:userId # Update member role
DELETE /api/projects/:id/members/:userId # Remove member
```

### 5.3 Board Management Endpoints
```
GET    /api/projects/:projectId/boards  # Get project boards
POST   /api/projects/:projectId/boards  # Create new board
GET    /api/boards/:id                  # Get board details
PUT    /api/boards/:id                  # Update board
DELETE /api/boards/:id                  # Delete board
```

### 5.4 Sprint Management Endpoints
```
GET    /api/boards/:boardId/sprints     # Get board sprints
POST   /api/boards/:boardId/sprints     # Create new sprint
GET    /api/sprints/:id                 # Get sprint details
PUT    /api/sprints/:id                 # Update sprint
DELETE /api/sprints/:id                 # Delete sprint
POST   /api/sprints/:id/start           # Start sprint
POST   /api/sprints/:id/complete        # Complete sprint
GET    /api/sprints/:id/burndown        # Get burndown data
```

### 5.5 Issue Management Endpoints
```
GET    /api/boards/:boardId/issues      # Get board issues
POST   /api/boards/:boardId/issues      # Create new issue
GET    /api/issues/:id                  # Get issue details
PUT    /api/issues/:id                  # Update issue
DELETE /api/issues/:id                  # Delete issue
POST   /api/issues/:id/comments         # Add comment
GET    /api/issues/:id/comments         # Get comments
POST   /api/issues/:id/time-logs        # Log time
GET    /api/issues/:id/time-logs        # Get time logs
```

### 5.6 AI Features Endpoints
```
POST   /api/ai/sprint-plan              # Generate sprint plan
POST   /api/ai/scope-creep              # Analyze scope creep
POST   /api/ai/risk-assessment          # Assess sprint risks
POST   /api/ai/retrospective            # Generate retrospective
GET    /api/projects/:id/ai-quota       # Check AI quota
```

## 6. Authentication & Security Implementation

### 6.1 JWT Implementation
- **Library**: Use `jsonwebtoken` (Node.js)
- **Approach**: Store refresh tokens in database for security
- **Token Structure**:
  - Access Token: 15-minute expiry, contains user_id, roles
  - Refresh Token: 7-day expiry, stored in `refresh_tokens` table
- **Storage**: Access token in memory/localStorage, refresh token in httpOnly cookie

### 6.2 Password Requirements
- **Minimum**: 8 characters
- **Requirements**: At least one uppercase, lowercase, number, special character
- **Hashing**: bcrypt with 12 rounds
- **Validation**: Implement both client-side and server-side validation

### 6.3 Email Verification Flow
1. User registers → Account created with `email_verified = false`
2. Verification email sent with unique token
3. User clicks link → Token validated → Account verified
4. **Restrictions**: Unverified users have read-only access
5. **Cannot**: Create/edit issues, use AI features, create projects

### 6.4 Password Reset Flow
1. User requests reset → Email sent with reset token
2. Token valid for 1 hour
3. User sets new password → Token invalidated
4. All existing sessions invalidated

## 7. Project & Board Structure

### 7.1 Project Keys
- **Generation**: Auto-generated using project name
- **Format**: Take first 3-4 letters of project name + random 2-digit number
- **Example**: "Sprint Tool" → "SPRI01", "SPRI02" if collision
- **Uniqueness**: Check uniqueness and increment suffix

### 7.2 Board Management
- **Permissions**: Only Project Managers and Admins can create boards
- **Default**: Each project gets one default board on creation
- **Naming**: Simple text input, no special formatting required

### 7.3 Board-Sprint Relationship
- **Rule**: One active sprint per board (not per project)
- **Concurrent**: Multiple boards can have concurrent sprints
- **Isolation**: Each board manages its own sprint independently

## 8. Sprint & Issue Management

### 8.1 Sprint Lifecycle
1. **Planning Phase**: Create sprint, set goals, add issues
2. **Active Phase**: Team works on issues, daily updates
3. **Completion Phase**: Review, retrospective, close sprint

### 8.2 Issue ID Generation
- **Format**: Global auto-incrementing integer
- **Display**: "ISSUE-{id}" (e.g., ISSUE-1001)
- **Implementation**: Use database auto-increment primary key

### 8.3 Issue Status Workflow
- **To Do** → **In Progress** → **Done**
- **Blocked**: Can be set from any status except Done
- **Rule**: Issues in "Blocked" status cannot be moved to "Done"
- **UI**: Show blocked indicator on cards with reason

### 8.4 Time Tracking Implementation
- **Units**: Hours only
- **Format**: Whole numbers only (1, 2, 5, 8, 40)
- **Fields**: original_estimate, time_spent, time_remaining
- **Logging**: Users can log time with description and date
- **Auto-calculation**: time_remaining = original_estimate - time_spent

### 8.5 Story Points
- **Scale**: 1, 2, 3, 5, 8, 13, 21 (Fibonacci sequence)
- **Input**: Dropdown selection
- **Default**: null (no estimate)
- **Velocity**: Calculate team velocity based on completed story points

### 8.6 Priority Levels
- **Values**: P1 (Critical), P2 (High), P3 (Medium), P4 (Low)
- **Default**: P3 (Medium)
- **Color Coding**: P1-Red, P2-Orange, P3-Yellow, P4-Green

## 9. Kanban Board Specifics

### 9.1 Column Structure
- **Default Columns**: "To Do", "In Progress", "Done"
- **Order**: Fixed order, no reordering
- **Customization**: Not available in initial version

### 9.2 WIP Limits
- **Scope**: Global limits apply to all boards
- **Default Limits**: To Do (unlimited), In Progress (5), Done (unlimited)
- **Enforcement**: Frontend prevents drag-drop when limit reached
- **Override**: No override mechanism initially

### 9.3 Swimlane Implementation
- **Type**: Pure visual grouping
- **Options**: "By Priority" or "By Assignee"
- **No Assignee**: Issues without assignee show in "Unassigned" row
- **Switching**: Toggle between swimlane views without affecting data

## 10. AI Integration (Simple & Cost-Effective)

### 10.1 OpenAI Configuration
- **Model**: GPT-3.5-turbo (cost-effective)
- **Temperature**: 0.3 (consistent outputs)
- **Max Tokens**: 500 per request
- **Timeout**: 10 seconds

### 10.2 Rate Limiting & Quota Management
- **Quota**: 10 AI requests per project per day
- **Reset**: Daily at midnight UTC
- **Counter**: Track in projects.ai_requests_count field
- **Enforcement**: Check quota before each AI request
- **User Feedback**: Show remaining quota in UI

### 10.3 Prompt Templates (Hardcoded)
- **Sprint Negotiator**: "Based on these issues: {issue_list}, suggest a realistic sprint plan considering team capacity of {capacity} story points"
- **Scope Creep**: "Analyze if sprint scope has increased: Original: {original_issues}, Current: {current_issues}"
- **Risk Assessment**: "Identify risks in this sprint: {sprint_data}"
- **Retrospective**: "Generate retrospective insights from: {sprint_summary}"

### 10.4 AI Output Handling & Error Management
- **Sprint Plan**: Expect JSON array of issue IDs with story point allocation
- **Other Features**: Plain text responses, display as-is with basic formatting
- **Error Scenarios**:
  - API timeout: "AI service is taking longer than expected. Please try again."
  - Quota exceeded: "Daily AI quota reached. Resets at midnight UTC."
  - Invalid response: "AI generated invalid response. Please try again."
  - Network error: "Unable to connect to AI service. Check your connection."

## 11. Error Handling & User Experience

### 11.1 API Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": "Technical details for debugging"
  }
}
```

### 11.2 Common Error Scenarios
- **Authentication**: Invalid credentials, expired tokens
- **Authorization**: Insufficient permissions for action
- **Validation**: Invalid input data, missing required fields
- **Business Logic**: Cannot move blocked issue to done
- **External Services**: AI API failures, email service down

### 11.3 User Feedback Mechanisms
- **Success Messages**: Clear confirmation of actions
- **Loading States**: Show progress for long operations
- **Validation**: Real-time form validation
- **Offline Handling**: Graceful degradation when offline

## 12. Implementation Phases & Priorities

### Phase 1: Foundation (Weeks 1-2)
- Database setup and migrations
- User authentication system
- Basic project and user management
- Email verification system

### Phase 2: Core Features (Weeks 3-4)
- Board and issue management
- Basic Kanban board UI
- Issue CRUD operations
- User role management

### Phase 3: Sprint Management (Weeks 5-6)
- Sprint lifecycle management
- Time tracking functionality
- Basic reporting and charts
- Sprint burndown visualization

### Phase 4: AI Integration (Weeks 7-8)
- OpenAI integration setup
- AI feature implementation
- Rate limiting and quota management
- Error handling and fallbacks

### Phase 5: Polish & Testing (Week 9)
- UI/UX improvements
- Comprehensive testing
- Performance optimization
- Documentation completion

## 13. Testing Strategy

### 13.1 Backend Testing
- **Unit Tests**: Individual functions and methods
- **Integration Tests**: API endpoints and database operations
- **Authentication Tests**: JWT token handling and security
- **AI Integration Tests**: Mock OpenAI responses

### 13.2 Frontend Testing
- **Component Tests**: React component functionality
- **Integration Tests**: User workflows and interactions
- **E2E Tests**: Complete user journeys
- **Accessibility Tests**: WCAG compliance

### 13.3 Performance Testing
- **Load Testing**: API performance under load
- **Database Performance**: Query optimization
- **Frontend Performance**: Bundle size and loading times

This comprehensive PRD provides a complete roadmap for implementing the AI Sprint Management App with clear specifications, error handling, and a phased approach to development.