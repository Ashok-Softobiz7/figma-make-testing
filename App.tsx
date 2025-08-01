import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import TaskListPage from './components/TaskListPage';
import TaskDetailPage from './components/TaskDetailPage';
import ProjectsPage from './components/ProjectsPage';
import TeamPage from './components/TeamPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import NotificationPage from './components/NotificationPage';
import NotFoundPage from './components/NotFoundPage';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
};

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  assignee?: User;
  projectId?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
  comments?: { id: string; user: User; message: string; date: string }[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  progress: number;
  members: User[];
  taskCount: number;
};

export type NotificationType = 'task' | 'mention' | 'reminder' | 'team' | 'system';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  relatedTask?: {
    id: string;
    title: string;
  };
};

export type AppContextType = {
  user: User | null;
  currentPage: string;
  navigateTo: (page: string, params?: any) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  tasks: Task[];
  projects: Project[];
  teamMembers: User[];
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  getUnreadNotificationCount: () => number;
};

export const AppContext = React.createContext<AppContextType | null>(null);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageParams, setPageParams] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Mock data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Design user dashboard',
      description: 'Create wireframes and mockups for the main dashboard',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-08-05',
      assignee: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'member' },
      projectId: '1'
    },
    {
      id: '2',
      title: 'Implement authentication',
      description: 'Set up user login and registration system',
      priority: 'high',
      status: 'todo',
      dueDate: '2025-08-10',
      assignee: { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
      projectId: '1'
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all API endpoints for the backend',
      priority: 'medium',
      status: 'completed',
      dueDate: '2025-07-28',
      assignee: { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' },
      projectId: '2'
    }
  ]);

  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'Task Management App',
      description: 'Building a comprehensive task management system',
      progress: 65,
      members: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'member' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
      ],
      taskCount: 12
    },
    {
      id: '2',
      name: 'API Development',
      description: 'RESTful API for the application backend',
      progress: 80,
      members: [
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' }
      ],
      taskCount: 8
    }
  ]);

  const [teamMembers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'member' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'member' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'viewer' }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'task',
      title: 'Task completed',
      message: 'John Doe completed the task "Design user dashboard"',
      isRead: false,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      user: { id: '1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' },
      relatedTask: { id: '1', title: 'Design user dashboard' }
    },
    {
      id: '2',
      type: 'mention',
      title: 'You were mentioned',
      message: 'Sarah Wilson mentioned you in a comment: "Can you review this?"',
      isRead: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      user: { id: '4', name: 'Sarah Wilson' },
      relatedTask: { id: '2', title: 'Implement authentication' }
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Task due soon',
      message: 'The task "Implement authentication" is due in 2 hours',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      relatedTask: { id: '2', title: 'Implement authentication' }
    },
    {
      id: '4',
      type: 'team',
      title: 'New team member',
      message: 'Alex Johnson joined the team',
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      user: { id: '5', name: 'Alex Johnson' }
    },
    {
      id: '5',
      type: 'system',
      title: 'System maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '6',
      type: 'task',
      title: 'Task assigned',
      message: 'You have been assigned to "Write API documentation"',
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      relatedTask: { id: '3', title: 'Write API documentation' }
    }
  ]);

  const navigateTo = (page: string, params?: any) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would make an API call
    if (email && password) {
      setUser({
        id: '2',
        name: 'Jane Smith',
        email: email,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=64&h=64&fit=crop&crop=face'
      });
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const contextValue: AppContextType = {
    user,
    currentPage,
    navigateTo,
    login,
    logout,
    tasks,
    projects,
    teamMembers,
    selectedTask,
    setSelectedTask,
    addTask,
    updateTask,
    deleteTask,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationCount
  };

  const renderPage = () => {
    if (!user && currentPage !== 'signup') {
      return <LoginPage />;
    }

    switch (currentPage) {
      case 'signup':
        return <SignUpPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskListPage />;
      case 'task-detail':
        return <TaskDetailPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'team':
        return <TeamPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'notifications':
        return <NotificationPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {renderPage()}
      </div>
    </AppContext.Provider>
  );
}