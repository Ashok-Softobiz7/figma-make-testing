import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  MessageSquare, 
  Paperclip,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Save,
  X
} from 'lucide-react';

export default function TaskDetailPage() {
  const context = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  if (!context) return null;

  const { selectedTask, navigateTo, updateTask } = context;

  if (!selectedTask) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2>No task selected</h2>
              <Button onClick={() => navigateTo('tasks')} className="mt-4">
                Back to Tasks
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const subtasks = selectedTask.subtasks || [];
  const comments = selectedTask.comments || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'todo': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const updatedSubtasks = [
        ...subtasks,
        {
          id: Date.now().toString(),
          title: newSubtask,
          completed: false
        }
      ];
      updateTask(selectedTask.id, { subtasks: updatedSubtasks });
      setNewSubtask('');
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask(selectedTask.id, { subtasks: updatedSubtasks });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const updatedComments = [
        ...comments,
        {
          id: Date.now().toString(),
          user: context.user!,
          message: newComment,
          date: new Date().toISOString()
        }
      ];
      updateTask(selectedTask.id, { comments: updatedComments });
      setNewComment('');
    }
  };

  const StatusIcon = getStatusIcon(selectedTask.status);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-10xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => navigateTo('tasks')}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl text-gray-900">{selectedTask.title}</h1>
                  <p className="text-gray-600 mt-1">Task details and progress</p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Task Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <StatusIcon className="h-5 w-5 mr-2" />
                      Task Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm mb-2">Description</h3>
                        {isEditing ? (
                          <Textarea
                            value={selectedTask.description}
                            onChange={(e) => updateTask(selectedTask.id, { description: e.target.value })}
                            rows={3}
                          />
                        ) : (
                          <p className="text-gray-700">{selectedTask.description}</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Due: {new Date(selectedTask.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        {selectedTask.assignee && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Assigned to: {selectedTask.assignee.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Badge 
                          variant="outline"
                          className={getPriorityColor(selectedTask.priority)}
                        >
                          {selectedTask.priority} priority
                        </Badge>
                        <Badge 
                          variant="secondary"
                          className={getStatusColor(selectedTask.status)}
                        >
                          {selectedTask.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subtasks */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Subtasks ({completedSubtasks}/{subtasks.length})</CardTitle>
                      <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
                    </div>
                    {subtasks.length > 0 && (
                      <Progress value={progress} className="mt-2" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subtasks.map((subtask) => (
                        <div key={subtask.id} className="flex items-center space-x-3">
                          <Checkbox
                            checked={subtask.completed}
                            onCheckedChange={() => handleToggleSubtask(subtask.id)}
                          />
                          <span className={`flex-1 ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                      
                      <div className="flex items-center space-x-2 pt-2 border-t">
                        <Input
                          placeholder="Add new subtask..."
                          value={newSubtask}
                          onChange={(e) => setNewSubtask(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                        />
                        <Button size="sm" onClick={handleAddSubtask}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Comments ({comments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} />
                            <AvatarFallback>
                              {comment.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm">{comment.user.name}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(comment.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.message}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex space-x-2 pt-4 border-t">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={context.user?.avatar} />
                          <AvatarFallback>
                            {context.user?.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                          />
                          <Button size="sm" onClick={handleAddComment}>
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Assignee */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assignee</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTask.assignee ? (
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={selectedTask.assignee.avatar} />
                          <AvatarFallback>
                            {selectedTask.assignee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{selectedTask.assignee.name}</p>
                          <p className="text-xs text-gray-500">{selectedTask.assignee.email}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No assignee</p>
                    )}
                  </CardContent>
                </Card>

                {/* Attachments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">No attachments</p>
                      <Button variant="outline" size="sm">
                        Upload File
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-gray-600">Task created</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-gray-600">Status updated to in-progress</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-gray-600">Due date set</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}