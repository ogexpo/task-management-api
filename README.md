# TaskFlow — Full-Stack Task & Project Management App

TaskFlow is a full-stack web application that helps users organize tasks and projects in one place. It includes a React frontend and a REST API backend with JWT authentication, authorization, and user-specific data access.

## 🚀 Features

### Frontend
- User registration and login
- JWT-based authenticated sessions
- Dashboard interface
- Create, view, update, and delete tasks
- Task status and priority management
- Task due dates and descriptions
- Create, edit, and delete projects
- Link tasks to projects
- Dark charcoal and violet UI theme
- Responsive application layout

### Backend
- RESTful API architecture
- User registration and login
- JWT authentication
- Role-based authorization
- Password hashing with bcryptjs
- Task CRUD operations
- Project CRUD operations
- User-based data ownership
- Task filtering and pagination
- Request validation
- Centralized error handling
- MongoDB database integration
- Environment-based configuration

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Frontend development and build tooling |
| JavaScript | Application logic |
| CSS | Styling and layout |
| Lucide React | UI icons |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Postman | API testing |
| Git & GitHub | Version control |
| Vercel | Deployment |

## 🏗️ Architecture

The application follows a client-server architecture.

1. The React frontend provides the user interface.
2. The frontend sends HTTP requests to the Express REST API.
3. JWT authentication protects private endpoints.
4. The backend validates requests and checks resource ownership.
5. Mongoose communicates with MongoDB to store and retrieve data.
6. The API returns JSON responses to the frontend.

## 📁 Project Structure

```text
task-management-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── userController.js
│   ├── taskController.js
│   └── projectController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── authorizeMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── user.js
│   ├── Task.js
│   └── project.js
│
├── routes/
│   ├── userRoutes.js
│   ├── taskRoutes.js
│   └── projectRoutes.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   └── project.js
│   │   ├── App.jsx
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

*Note: This structure shows the main application files; some files may be omitted for brevity.*

## 🔐 Authentication & Authorization

TaskFlow uses JSON Web Tokens (JWT) to authenticate users.

After a successful login, the API returns a token. Protected API requests require the following header:

```http
Authorization: Bearer <your_jwt_token>
```

Passwords are hashed before storage. Authorization middleware restricts access to protected resources and admin-only endpoints.

## 👤 User API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/users` | Public |
| POST | `/api/users/login` | Public |
| GET | `/api/users` | Authenticated |
| GET | `/api/users/admin-test` | Admin |

## 📋 Task API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/tasks` | Authenticated |
| GET | `/api/tasks` | Authenticated |
| GET | `/api/tasks/:id` | Authenticated |
| PATCH | `/api/tasks/:id` | Authenticated |
| DELETE | `/api/tasks/:id` | Authenticated |

### Task Filtering & Pagination

The API supports task filtering by status and pagination using query parameters.

Example:

```http
GET /api/tasks?status=completed&page=1&limit=5
```

Supported task statuses:

- `todo`
- `in-progress`
- `completed`

Supported priorities:

- `low`
- `medium`
- `high`

## 📂 Project API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/projects` | Authenticated |
| GET | `/api/projects` | Authenticated |
| GET | `/api/projects/:id` | Authenticated |
| PATCH | `/api/projects/:id` | Authenticated |
| DELETE | `/api/projects/:id` | Authenticated |

Project statuses include `planning`, `active`, and `completed`.

## ⚙️ Environment Variables

### Backend

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
```

Use your own MongoDB connection string and a strong secret. Never commit real credentials or the `.env` file to GitHub.

### Frontend

Configure the frontend API base URL in `frontend/.env`:

```env
VITE_API_BASE_URL=https://task-management-api-a33u.vercel.app/api
```

For local backend development, use:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Restart the Vite development server after changing environment variables. Ensure `.env` files containing secrets are excluded from Git.

## 💻 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/ogexpo/task-management-api.git
cd task-management-api
```

### 2. Install backend dependencies

```bash
npm install
```

Create the backend `.env` file and configure your MongoDB connection and JWT secret.

### 3. Start the backend

```bash
npm start
```

The backend will run locally at:

`http://localhost:3000`

### 4. Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

Configure `frontend/.env` with the appropriate API base URL.

### 5. Start the frontend

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal, usually:

`http://localhost:5173`

## 🧪 API Testing

Postman can be used to test the backend independently of the frontend.

Recommended testing workflow:

1. Register a user.
2. Log in and obtain a JWT token.
3. Send the token with authenticated requests.
4. Create a project.
5. Create tasks and associate them with a project.
6. Retrieve, filter, and paginate tasks.
7. Update and delete tasks and projects.
8. Verify validation, authorization, and error responses.

## 🔒 Security Considerations

- Passwords are hashed before being stored.
- JWT authentication protects private routes.
- User-specific resources are protected by ownership checks.
- Admin-only routes use role-based authorization.
- Environment secrets must not be committed to source control.
- Request validation helps reject invalid data.

## 🌐 Deployment

**Backend API:** [TaskFlow API on Vercel](https://task-management-api-a33u.vercel.app/)

The root endpoint can be used to check that the deployed application responds. Individual API endpoints require the appropriate HTTP method, request body, and authentication where applicable.

**Frontend:** Add the live frontend URL here once its deployment is available.

## 📚 What I Learned

Building TaskFlow provided practical experience with:

- Designing RESTful APIs
- Implementing JWT authentication and role-based authorization
- Modeling related data using MongoDB and Mongoose
- Organizing backend code using routes, controllers, models, and middleware
- Connecting a React frontend to a backend API
- Handling API requests and errors
- Testing endpoints with Postman
- Using Git, GitHub, environment variables, and deployment tools

## 📌 Project Status

TaskFlow is a full-stack portfolio project built with React, Node.js, Express.js, and MongoDB. It brings together user authentication, task management, project management, and a dedicated frontend interface.

The project can be extended with additional features such as automated tests, advanced filtering, and further production monitoring.
