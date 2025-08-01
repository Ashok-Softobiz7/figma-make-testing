import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Plus,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const context = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!context) return null;

  const { tasks, projects, teamMembers, navigateTo } = context;

  // Calculate dashboard stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== 'completed';
  }).length;

  const activeProjects = projects.length;
  const avgProjectProgress = projects.reduce((acc, project) => acc + project.progress, 0) / projects.length;

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-10xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's an overview of your tasks and projects.</p>
              </div>
              <Button 
                onClick={() => navigateTo('tasks')}
                className="mt-4 sm:mt-0 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tasks Due</p>
                      <p className="text-2xl">{inProgressTasks + tasks.filter(t => t.status === 'todo').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Projects Active</p>
                      <p className="text-2xl">{activeProjects}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Completed Tasks</p>
                      <p className="text-2xl">{completedTasks}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Team Members</p>
                      <p className="text-2xl">{teamMembers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recent Tasks
                  </CardTitle>
                  <CardDescription>
                    Your latest task updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          context.setSelectedTask(task);
                          navigateTo('task-detail');
                        }}
                      >
                        <div className="flex-1">
                          <p className="text-sm mb-1">{task.title}</p>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                task.status === 'completed' ? 'default' :
                                task.status === 'in-progress' ? 'secondary' : 
                                'outline'
                              }
                              className={
                                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                task.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {task.status}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={
                                task.priority === 'high' ? 'border-red-200 text-red-800' :
                                task.priority === 'medium' ? 'border-yellow-200 text-yellow-800' :
                                'border-green-200 text-green-800'
                              }
                            >
                              {task.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => navigateTo('tasks')}
                  >
                    View All Tasks
                  </Button>
                </CardContent>
              </Card>

              {/* Project Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Project Overview
                  </CardTitle>
                  <CardDescription>
                    Current project status and progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm">{project.name}</h4>
                          <span className="text-xs text-gray-500">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="mb-2" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{project.taskCount} tasks</span>
                          <span>{project.members.length} members</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => navigateTo('projects')}
                  >
                    View All Projects
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks you might want to perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => navigateTo('tasks')}
                  >
                    <Plus className="h-6 w-6" />
                    <span>Create Task</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => navigateTo('projects')}
                  >
                    <Target className="h-6 w-6" />
                    <span>New Project</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => navigateTo('team')}
                  >
                    <Users className="h-6 w-6" />
                    <span>Invite Member</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => navigateTo('settings')}
                  >
                    <TrendingUp className="h-6 w-6" />
                    <span>View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}