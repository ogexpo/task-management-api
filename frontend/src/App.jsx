
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  Zap,
  LayoutDashboard,
  LogOut,
  ListTodo,
  FolderKanban,
  Plus,
  Trash2,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import { login, signup } from "./api/auth";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api/tasks";
import { getProjects, createProject } from "./api/project";

import "./App.css";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
};

const statusLabels = {
  todo: "Todo",
  "in-progress": "In Progress",
  completed: "Completed",
};

const projectStatusLabels = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
};

export default function App() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const savedToken = sessionStorage.getItem("token");
      const savedUser = sessionStorage.getItem("user");

      return savedToken && savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch {
      return null;
    }
  });

  const [activePage, setActivePage] = useState("dashboard");

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskError, setTaskError] = useState("");
  const [taskSuccess, setTaskSuccess] = useState("");
  const [taskForm, setTaskForm] = useState(emptyForm);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [projectSuccess, setProjectSuccess] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  const token = sessionStorage.getItem("token");

  // Load tasks when the user signs in.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadTasks() {
      setTasksLoading(true);
      setTaskError("");

      try {
        const data = await getTasks(
          sessionStorage.getItem("token")
        );

        if (!cancelled) {
          setTasks(data.tasks || []);
        }
      } catch (err) {
        if (!cancelled) {
          setTaskError(err.message || "Could not load tasks.");
        }
      } finally {
        if (!cancelled) {
          setTasksLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Load projects whenever the Projects page opens.
  useEffect(() => {
    if (!user || activePage !== "projects") return;

    let cancelled = false;

    async function loadProjects() {
      setProjectLoading(true);
      setProjectError("");

      try {
        const data = await getProjects(
          sessionStorage.getItem("token")
        );

        const projectList = Array.isArray(data)
          ? data
          : Array.isArray(data.projects)
            ? data.projects
            : Array.isArray(data.data)
              ? data.data
              : [];

        if (!cancelled) {
          setProjects(projectList);
        }
      } catch (err) {
        if (!cancelled) {
          setProjectError(
            err.message || "Could not load projects."
          );
        }
      } finally {
        if (!cancelled) {
          setProjectLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [user, activePage]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(
          formData.name.trim(),
          formData.email.trim(),
          formData.password
        );

        setSuccess(
          "Account created successfully! Please sign in."
        );
        setIsSignup(false);
        setFormData({
          name: "",
          email: formData.email.trim(),
          password: "",
        });
      } else {
        const data = await login(
          formData.email.trim(),
          formData.password
        );

        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);
        setActivePage("dashboard");
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setUser(null);
    setTasks([]);
    setProjects([]);
    setActivePage("dashboard");
    setIsSignup(false);
    setError("");
    setSuccess("");
    setTaskError("");
    setTaskSuccess("");
    setProjectError("");
    setProjectSuccess("");
    setFormData({ name: "", email: "", password: "" });
  }

  function switchMode() {
    setIsSignup((current) => !current);
    setError("");
    setSuccess("");
    setShowPassword(false);
  }

  async function refreshTasks() {
    setTasksLoading(true);
    setTaskError("");

    try {
      const data = await getTasks(
        sessionStorage.getItem("token")
      );
      setTasks(data.tasks || []);
    } catch (err) {
      setTaskError(err.message || "Could not load tasks.");
    } finally {
      setTasksLoading(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();
    setTaskError("");
    setTaskSuccess("");
    setSavingTask(true);

    try {
      const payload = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        priority: taskForm.priority,
      };

      if (taskForm.dueDate) {
        payload.dueDate = taskForm.dueDate;
      }

      await createTask(token, payload);

      setTaskForm(emptyForm);
      setShowTaskForm(false);
      setTaskSuccess("Task created successfully!");

      await refreshTasks();
    } catch (err) {
      setTaskError(err.message || "Could not create task.");
    } finally {
      setSavingTask(false);
    }
  }

  async function handleStatusChange(task, newStatus) {
    setTaskError("");
    setTaskSuccess("");
    setBusyTaskId(task._id);

    try {
      await updateTask(token, task._id, {
        status: newStatus,
      });

      setTasks((current) =>
        current.map((item) =>
          item._id === task._id
            ? { ...item, status: newStatus }
            : item
        )
      );

      setTaskSuccess("Task status updated.");
    } catch (err) {
      setTaskError(err.message || "Could not update task.");
    } finally {
      setBusyTaskId("");
    }
  }

  async function handleDeleteTask(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setTaskError("");
    setTaskSuccess("");
    setBusyTaskId(taskId);

    try {
      await deleteTask(token, taskId);

      setTasks((current) =>
        current.filter((task) => task._id !== taskId)
      );

      setTaskSuccess("Task deleted successfully.");
    } catch (err) {
      setTaskError(err.message || "Could not delete task.");
    } finally {
      setBusyTaskId("");
    }
  }

  // Create a new project through the backend API.
  async function handleCreateProject(event) {
    event.preventDefault();

    const name = projectName.trim();

    if (!name) {
      setProjectError("Please enter a project name.");
      return;
    }

    setProjectError("");
    setProjectSuccess("");
    setSavingProject(true);

    try {
      await createProject(
        sessionStorage.getItem("token"),
        { name }
      );

      setProjectName("");
      setShowProjectForm(false);
      setProjectSuccess("Project created successfully!");

      // Reload the project list from the backend.
      const data = await getProjects(
        sessionStorage.getItem("token")
      );

      const projectList = Array.isArray(data)
        ? data
        : Array.isArray(data.projects)
          ? data.projects
          : Array.isArray(data.data)
            ? data.data
            : [];

      setProjects(projectList);
    } catch (err) {
      setProjectError(
        err.message || "Could not create project."
      );
    } finally {
      setSavingProject(false);
    }
  }

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingCount = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  const activeProjectCount = projects.filter(
    (project) => project.status === "active"
  ).length;

  if (user) {
    return (
      <main className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">
              <Zap size={22} fill="currentColor" />
            </div>
            <span>TaskFlow</span>
          </div>

          <p className="nav-label">WORKSPACE</p>

          <nav className="nav-menu">
            <button
              className={`nav-item ${activePage === "dashboard" ? "active" : ""
                }`}
              type="button"
              onClick={() => setActivePage("dashboard")}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              className={`nav-item ${activePage === "tasks" ? "active" : ""
                }`}
              type="button"
              onClick={() => setActivePage("tasks")}
            >
              <ListTodo size={18} />
              My Tasks
            </button>

            <button
              className={`nav-item ${activePage === "projects" ? "active" : ""
                }`}
              type="button"
              onClick={() => {
                setActivePage("projects");
                setProjectError("");
                setProjectSuccess("");
              }}
            >
              <FolderKanban size={18} />
              Projects
            </button>
          </nav>

          <div className="sidebar-bottom">
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>

            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </aside>

        <section className="main-content">
          <header className="topbar">
            <div>
              <p className="eyebrow">YOUR WORKSPACE</p>
              <h2>
                {activePage === "dashboard"
                  ? "Dashboard"
                  : activePage === "tasks"
                    ? "My Tasks"
                    : "Projects"}
              </h2>
            </div>

            <button
              className="topbar-logout"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Log out
            </button>
          </header>

          {activePage === "dashboard" && (
            <>
              <section className="welcome-card">
                <div>
                  <p className="eyebrow">
                    YOUR SPACE. YOUR PACE.
                  </p>
                  <h1>Welcome back, {user.name}!</h1>
                  <p>
                    You're signed in. Let's make today productive.
                  </p>
                </div>

                <div className="welcome-icon">
                  <Zap size={34} />
                </div>
              </section>

              <div className="dashboard-heading">
                <h3>Your workspace</h3>
                <p>Here's a quick look at your work.</p>
              </div>

              {taskError && (
                <div
                  className="task-message error-message"
                  role="alert"
                >
                  {taskError}
                </div>
              )}

              <div className="dashboard-grid">
                <button
                  className="dashboard-card dashboard-card-button"
                  type="button"
                  onClick={() => setActivePage("tasks")}
                >
                  <div className="dashboard-card-icon">
                    <ListTodo size={22} />
                  </div>
                  <h3>My Tasks</h3>
                  <p>View and organize your personal tasks.</p>
                  <strong className="task-stat">
                    {tasksLoading
                      ? "Loading..."
                      : `${tasks.length} total tasks`}
                  </strong>
                </button>

                <button
                  className="dashboard-card dashboard-card-button"
                  type="button"
                  onClick={() => setActivePage("tasks")}
                >
                  <div className="dashboard-card-icon">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3>Completed</h3>
                  <p>Tasks you've finished.</p>
                  <strong className="task-stat">
                    {completedCount} completed
                  </strong>
                </button>

                <button
                  className="dashboard-card dashboard-card-button"
                  type="button"
                  onClick={() => setActivePage("projects")}
                >
                  <div className="dashboard-card-icon">
                    <FolderKanban size={22} />
                  </div>
                  <h3>Projects</h3>
                  <p>Organize work into projects.</p>
                  <strong className="task-stat">
                    {projects.length} projects
                  </strong>
                </button>
              </div>

              <div className="task-toolbar">
                <div>
                  <h3>Recent tasks</h3>
                  <p>Your latest tasks from the backend.</p>
                </div>

                <button
                  className="secondary-action"
                  type="button"
                  onClick={() => setActivePage("tasks")}
                >
                  View all tasks
                </button>
              </div>

              {tasksLoading ? (
                <p className="task-feedback">
                  Loading your tasks...
                </p>
              ) : tasks.length === 0 ? (
                <div className="empty-tasks">
                  <ListTodo size={28} />
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started.</p>
                  <button
                    className="primary-action"
                    type="button"
                    onClick={() => {
                      setActivePage("tasks");
                      setShowTaskForm(true);
                    }}
                  >
                    <Plus size={17} />
                    Create a task
                  </button>
                </div>
              ) : (
                <div className="task-list">
                  {tasks.slice(0, 3).map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      busy={busyTaskId === task._id}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activePage === "tasks" && (
            <section className="tasks-page">
              <div className="task-page-heading">
                <div>
                  <p className="eyebrow">STAY ORGANIZED</p>
                  <h1>My Tasks</h1>
                  <p>Create tasks and track your progress.</p>
                </div>

                <button
                  className="primary-action"
                  type="button"
                  onClick={() => {
                    setShowTaskForm((current) => !current);
                    setTaskError("");
                    setTaskSuccess("");
                  }}
                >
                  <Plus size={18} />
                  {showTaskForm ? "Close form" : "New task"}
                </button>
              </div>

              {taskError && (
                <div
                  className="task-message error-message"
                  role="alert"
                >
                  {taskError}
                </div>
              )}

              {taskSuccess && (
                <div
                  className="task-message success-message"
                  role="status"
                >
                  {taskSuccess}
                </div>
              )}

              {showTaskForm && (
                <form
                  className="task-form"
                  onSubmit={handleCreateTask}
                >
                  <h3>Create a new task</h3>

                  <label className="field">
                    <span>Task title</span>
                    <input
                      className="task-input"
                      type="text"
                      value={taskForm.title}
                      onChange={(event) =>
                        setTaskForm((current) => ({
                          ...current,
                          title: event.target.value,
                        }))
                      }
                      minLength={3}
                      maxLength={100}
                      placeholder="e.g. Finish backend API"
                      required
                    />
                  </label>

                  <label className="field">
                    <span>Description (optional)</span>
                    <textarea
                      className="task-input task-textarea"
                      value={taskForm.description}
                      onChange={(event) =>
                        setTaskForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="What needs to be done?"
                      rows={3}
                    />
                  </label>

                  <div className="task-form-row">
                    <label className="field">
                      <span>Priority</span>
                      <select
                        className="task-input"
                        value={taskForm.priority}
                        onChange={(event) =>
                          setTaskForm((current) => ({
                            ...current,
                            priority: event.target.value,
                          }))
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </label>

                    <label className="field">
                      <span>Due date (optional)</span>
                      <input
                        className="task-input"
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(event) =>
                          setTaskForm((current) => ({
                            ...current,
                            dueDate: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>

                  <button
                    className="primary-action"
                    type="submit"
                    disabled={savingTask}
                  >
                    <Plus size={17} />
                    {savingTask ? "Saving task..." : "Save task"}
                  </button>
                </form>
              )}

              <div className="task-list-heading">
                <div>
                  <h3>All tasks</h3>
                  <p>
                    {tasks.length} task
                    {tasks.length === 1 ? "" : "s"} in your workspace
                  </p>
                </div>

                <button
                  className="icon-action"
                  type="button"
                  onClick={refreshTasks}
                  disabled={tasksLoading}
                  aria-label="Refresh tasks"
                  title="Refresh tasks"
                >
                  <RefreshCw size={17} />
                </button>
              </div>

              {tasksLoading ? (
                <p className="task-feedback">
                  Loading your tasks...
                </p>
              ) : tasks.length === 0 ? (
                <div className="empty-tasks">
                  <ListTodo size={28} />
                  <h3>No tasks yet</h3>
                  <p>
                    Your tasks will appear here after you create one.
                  </p>
                  {!showTaskForm && (
                    <button
                      className="primary-action"
                      type="button"
                      onClick={() => setShowTaskForm(true)}
                    >
                      <Plus size={17} />
                      Create your first task
                    </button>
                  )}
                </div>
              ) : (
                <div className="task-list">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      busy={busyTaskId === task._id}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {activePage === "projects" && (
            <section className="tasks-page projects-page">
              <div className="task-page-heading">
                <div>
                  <p className="eyebrow">PLAN. BUILD. ACHIEVE.</p>
                  <h1>My Projects</h1>
                  <p>
                    Keep related tasks and goals organized in one place.
                  </p>
                </div>

                <button
                  className="primary-action"
                  type="button"
                  onClick={() => {
                    setShowProjectForm((current) => !current);
                    setProjectError("");
                    setProjectSuccess("");
                  }}
                >
                  <Plus size={18} />
                  {showProjectForm ? "Close form" : "New project"}
                </button>
              </div>

              <div className="dashboard-grid project-stats">
                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <FolderKanban size={22} />
                  </div>
                  <h3>Total projects</h3>
                  <strong className="task-stat">
                    {projects.length}
                  </strong>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <RefreshCw size={22} />
                  </div>
                  <h3>Active projects</h3>
                  <strong className="task-stat">
                    {activeProjectCount}
                  </strong>
                </div>

                <div className="dashboard-card">
                  <div className="dashboard-card-icon">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3>Completed projects</h3>
                  <strong className="task-stat">
                    {
                      projects.filter(
                        (project) => project.status === "completed"
                      ).length
                    }
                  </strong>
                </div>
              </div>

              {projectError && (
                <div
                  className="task-message error-message"
                  role="alert"
                >
                  {projectError}
                </div>
              )}

              {projectSuccess && (
                <div
                  className="task-message success-message"
                  role="status"
                >
                  {projectSuccess}
                </div>
              )}

              {showProjectForm && (
                <form
                  className="task-form project-form"
                  onSubmit={handleCreateProject}
                >
                  <h3>Create a new project</h3>
                  <p>
                    Give your project a clear, memorable name.
                  </p>

                  <label className="field">
                    <span>Project name</span>
                    <input
                      className="task-input"
                      type="text"
                      value={projectName}
                      onChange={(event) => {
                        setProjectName(event.target.value);
                        setProjectError("");
                      }}
                      placeholder="e.g. Portfolio Website"
                      minLength={1}
                      maxLength={100}
                      required
                    />
                  </label>

                  <button
                    className="primary-action"
                    type="submit"
                    disabled={savingProject}
                  >
                    <Plus size={17} />
                    {savingProject
                      ? "Creating project..."
                      : "Create project"}
                  </button>
                </form>
              )}

              <div className="task-list-heading">
                <div>
                  <h3>All projects</h3>
                  <p>Your projects, fetched from the backend.</p>
                </div>

                <button
                  className="icon-action"
                  type="button"
                  onClick={() => setActivePage("dashboard")}
                  aria-label="Back to dashboard"
                  title="Back to dashboard"
                >
                  <LayoutDashboard size={17} />
                </button>
              </div>

              {projectLoading ? (
                <p className="task-feedback">
                  Loading your projects...
                </p>
              ) : projects.length === 0 ? (
                <div className="empty-tasks">
                  <FolderKanban size={30} />
                  <h3>No projects yet</h3>
                  <p>
                    Create your first project and start organizing
                    your work.
                  </p>

                  {!showProjectForm && (
                    <button
                      className="primary-action"
                      type="button"
                      onClick={() => setShowProjectForm(true)}
                    >
                      <Plus size={17} />
                      Create your first project
                    </button>
                  )}
                </div>
              ) : (
                <div className="dashboard-grid project-grid">
                  {projects.map((project) => (
                    <article
                      className="dashboard-card project-card"
                      key={project._id}
                    >
                      <div className="dashboard-card-icon">
                        <FolderKanban size={22} />
                      </div>

                      <h3>{project.name}</h3>

                      <p>
                        Created{" "}
                        {project.createdAt
                          ? new Date(
                            project.createdAt
                          ).toLocaleDateString()
                          : "recently"}
                      </p>

                      <span
                        className={`status-badge status-${project.status || "planning"}`}
                      >
                        {projectStatusLabels[project.status] ||
                          project.status ||
                          "Planning"}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <div className="brand-logo">
          <Zap size={24} fill="currentColor" />
        </div>

        <p className="eyebrow">WORKSPACE, REIMAGINED</p>
        <h1>
          Make space for
          <br />
          <span>great work.</span>
        </h1>
        <p className="brand-description">
          Organize your tasks, manage projects, and keep your momentum
          going.
        </p>

        <div className="feature-list">
          <p><CheckCircle2 size={18} /> One place for all your work</p>
          <p><CheckCircle2 size={18} /> Projects that stay on track</p>
          <p><CheckCircle2 size={18} /> Progress you can actually see</p>
        </div>

        <div className="brand-decoration decoration-one" />
        <div className="brand-decoration decoration-two" />
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="mobile-logo">
            <Zap size={22} fill="currentColor" />
            <span>TaskFlow</span>
          </div>

          <div className="auth-heading">
            <p className="eyebrow">
              {isSignup ? "GET STARTED" : "WELCOME BACK"}
            </p>
            <h2>
              {isSignup
                ? "Create your account"
                : "Sign in to TaskFlow"}
            </h2>
            <p>
              {isSignup
                ? "Create your workspace and get things moving."
                : "Your workspace is waiting for you."}
            </p>
          </div>

          {error && (
            <div className="auth-message error-message" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div
              className="auth-message success-message"
              role="status"
            >
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="field">
                <span>Full name</span>
                <div className="input-wrap">
                  <UserRound size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={80}
                    required
                  />
                </div>
              </label>
            )}

            <label className="field">
              <span>Email address</span>
              <div className="input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label className="field">
              <span>Password</span>
              <div className="input-wrap">
                <LockKeyhole size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  minLength={isSignup ? 8 : undefined}
                  required
                />

                <button
                  className="password-toggle"
                  type="button"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                >
                  {showPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>

              {isSignup && (
                <small className="field-hint">
                  Use at least 8 characters.
                </small>
              )}
            </label>

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Sign in"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <p className="auth-switch">
            {isSignup
              ? "Already have an account?"
              : "New to TaskFlow?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              disabled={loading}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>

          <p className="auth-footer">
            Built for focus. Designed for progress.
          </p>
        </div>
      </section>
    </main>
  );
}

function TaskCard({ task, busy, onStatusChange, onDelete }) {
  return (
    <article className="task-card">
      <div className="task-card-main">
        <div className="task-card-title-row">
          <h3>{task.title}</h3>
          <span
            className={`priority-badge priority-${task.priority || "medium"}`}
          >
            {task.priority || "medium"}
          </span>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <span className={`status-badge status-${task.status}`}>
            {statusLabels[task.status] || task.status}
          </span>

          {task.dueDate && (
            <span className="task-due-date">
              <CalendarDays size={14} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="task-card-actions">
        <label className="status-control">
          <span className="sr-only">Task status</span>
          <select
            value={task.status || "todo"}
            disabled={busy}
            onChange={(event) =>
              onStatusChange(task, event.target.value)
            }
            aria-label={`Change status for ${task.title}`}
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <button
          className="delete-task-button"
          type="button"
          disabled={busy}
          onClick={() => onDelete(task._id)}
          aria-label={`Delete ${task.title}`}
          title="Delete task"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
