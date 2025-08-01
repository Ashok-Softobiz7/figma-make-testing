import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Home, ArrowLeft, Search, FileQuestion } from 'lucide-react';

export default function NotFoundPage() {
  const context = useContext(AppContext);

  if (!context) return null;

  const { navigateTo, user } = context;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileQuestion className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-3xl text-gray-900">404</CardTitle>
            <CardDescription className="text-lg">
              Page Not Found
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div>
              <p className="text-gray-600 mb-4">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
              <p className="text-sm text-gray-500">
                It might have been deleted, or you may have entered the wrong URL.
              </p>
            </div>

            <div className="space-y-3">
              {user ? (
                <>
                  <Button 
                    onClick={() => navigateTo('dashboard')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.history.back()}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>

                  <Button 
                    variant="ghost" 
                    onClick={() => navigateTo('tasks')}
                    className="w-full"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Tasks
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigateTo('login')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Login
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigateTo('signup')}
                    className="w-full"
                  >
                    Create Account
                  </Button>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Need help? Contact support at support@taskflow.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Common pages you might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {user ? (
              <>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigateTo('tasks')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Tasks
                </Button>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigateTo('projects')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Projects
                </Button>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigateTo('team')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Team
                </Button>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigateTo('profile')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigateTo('login')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Sign In
                </Button>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => navigateTo('signup')}
                  className="text-purple-600 hover:text-purple-700"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}