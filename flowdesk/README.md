# FlowDesk 🚀

A full-stack Team Task Manager with role-based access (Admin/Member), Kanban boards, and real-time-ready architecture.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS      |
| State      | Zustand + TanStack Query            |
| Backend    | Node.js + Express                   |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (Bearer tokens)                 |
| Deployment | Railway                             |

---

## Project Structure

```
flowdesk/
├── backend/
│   ├── config/         # JWT helpers
│   ├── controllers/    # auth, project, task, user
│   ├── middleware/     # auth + role guard
│   ├── models/         # User, Project, Task, Activity
│   ├── routes/         # REST API routes
│   └── server.js       # Express entry point
├── frontend/
│   └── src/
│       ├── components/ # UI, layout, tasks, projects
│       ├── context/    # AuthContext
│       ├── hooks/      # useTasks, useProjects
│       ├── pages/      # Dashboard, Login, Signup, etc.
│       ├── router/     # ProtectedRoute, AdminRoute
│       ├── services/   # Axios API client
│       └── store/      # Zustand stores
└── package.json        # Root scripts
```

---

## Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/flowdesk.git
cd flowdesk
npm run install:all
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Run Dev Servers

```bash
# From root — runs both frontend + backend
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api

---

## API Endpoints

### Auth
| Method | Endpoint           | Access  |
|--------|--------------------|---------|
| POST   | /api/auth/signup   | Public  |
| POST   | /api/auth/login    | Public  |
| GET    | /api/auth/me       | Private |

### Projects
| Method | Endpoint                     | Access        |
|--------|------------------------------|---------------|
| GET    | /api/projects                | Private       |
| POST   | /api/projects                | Private       |
| GET    | /api/projects/:id            | Private       |
| PATCH  | /api/projects/:id            | Private       |
| DELETE | /api/projects/:id            | Admin only    |
| POST   | /api/projects/:id/members    | Private       |

### Tasks
| Method | Endpoint             | Access  |
|--------|----------------------|---------|
| GET    | /api/tasks           | Private |
| POST   | /api/tasks           | Private |
| PATCH  | /api/tasks/:id       | Private |
| DELETE | /api/tasks/:id       | Private |
| GET    | /api/tasks/dashboard | Private |

### Users (Admin)
| Method | Endpoint               | Access     |
|--------|------------------------|------------|
| GET    | /api/users             | Admin only |
| PATCH  | /api/users/:id/role    | Admin only |
| GET    | /api/users/activity    | Private    |

---

## Deployment on Railway

1. Push to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add **MongoDB** plugin from Railway dashboard
4. Set environment variables for the backend service:
   ```
   MONGO_URI=<from Railway MongoDB plugin>
   JWT_SECRET=your_secret_here
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.railway.app
   ```
5. Add a second service for the frontend:
   - Build command: `cd frontend && npm install && npm run build`
   - Start command: `npx serve frontend/dist`
6. Both services get public URLs from Railway automatically

---

## Features

- ✅ JWT Authentication (Signup / Login)
- ✅ Role-based access: Admin vs Member
- ✅ Create & manage Projects with color labels
- ✅ Kanban Board (Todo → In Progress → Review → Done)
- ✅ Task creation with priority, due date, assignment
- ✅ Overdue task detection
- ✅ Activity logging on every action
- ✅ Admin Panel: view all users, promote/demote roles
- ✅ Dashboard with stats overview
- ✅ List + Kanban toggle view
- ✅ Responsive layout with collapsible sidebar

---

## Demo Video

> Record a 2–5 min walkthrough covering:
> 1. Signup as Admin + as Member
> 2. Create a project, add tasks
> 3. Move tasks through Kanban columns
> 4. Show Admin Panel (role management)
> 5. Show overdue task detection on Dashboard

---

Made with ❤️ using FlowDesk