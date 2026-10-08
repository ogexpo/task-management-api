# Task Management API

A production-style REST API for managing users, tasks, and projects with authentication, authorization, and secure data access.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- Secure password hashing with bcrypt
- Task CRUD operations
- Project CRUD operations
- Tasks linked to projects
- User-based data ownership
- Task filtering by status
- Pagination for tasks
- Centralized error handling
- MongoDB database integration
- Environment-based configuration

## 🛠️ Tech Stack

- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Postman
- Git & GitHub

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
│   ├── User.js
│   ├── Task.js
│   └── project.js
│
├── routes/
│   ├── userRoutes.js
│   ├── taskRoutes.js
│   └── projectRoutes.js
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## 🔐 Authentication

The API uses JWT authentication.

After successful login, the server returns a JWT token. Protected routes require the token in the request header:

```text
Authorization: Bearer <token>
```

## 👤 User APIs

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/users` | Public |
| POST | `/api/users/login` | Public |
| GET | `/api/users` | Authenticated |
| GET | `/api/users/admin-test` | Admin |

## 📋 Task APIs

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/tasks` | Authenticated |
| GET | `/api/tasks` | Authenticated |
| GET | `/api/tasks/:id` | Authenticated |
| PATCH | `/api/tasks/:id` | Authenticated |
| DELETE | `/api/tasks/:id` | Authenticated |

### Task Filtering & Pagination

Tasks can be filtered by status and paginated using query parameters.

Example:

```text
GET /api/tasks?status=completed&page=1&limit=5
```

## 📂 Project APIs

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/projects` | Authenticated |
| GET | `/api/projects` | Authenticated |
| GET | `/api/projects/:id` | Authenticated |
| PATCH | `/api/projects/:id` | Authenticated |
| DELETE | `/api/projects/:id` | Authenticated |

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```text
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit the `.env` file to GitHub.

## 💻 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ogexpo/task-management-api.git
cd task-management-api
npm install
```

Create your `.env` file and configure the required environment variables.

## ▶️ Run Locally

Start the server with:

```bash
npm start
```

The API will run on:

```text
http://localhost:3000
```

## 🧪 API Testing

The API can be tested using Postman.

Recommended testing flow:

1. Register a user
2. Login and receive JWT token
3. Use the token for protected routes
4. Create a project
5. Create tasks
6. Link tasks to projects
7. Update tasks/projects
8. Test authorization and error handling

## 🔒 Security

- Passwords are hashed before storage
- JWT authentication protects private routes
- Users can access only their own tasks and projects
- Admin-only routes use role-based authorization
- Sensitive environment variables are excluded from Git

## 📌 Project Status

Production-style backend project with authentication, authorization, task/project management, validation, pagination, and centralized error handling.

Deployment and final API verification are in progress.