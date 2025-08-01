import React, { useContext } from "react";
import { AppContext } from "../App";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Users,
  User,
  Settings,
  LogOut,
  X,
  Bell,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const context = useContext(AppContext);

  if (!context) return null;

  const {
    currentPage,
    navigateTo,
    logout,
    user,
    getUnreadNotificationCount,
  } = context;

  const unreadCount = getUnreadNotificationCount();

  const navigation = [
    {
      name: "Dashboard",
      href: "dashboard",
      icon: LayoutDashboard,
    },
    { name: "Tasks", href: "tasks", icon: CheckSquare },
    { name: "Projects", href: "projects", icon: FolderOpen },
    { name: "Team", href: "team", icon: Users },
    {
      name: "Notifications",
      href: "notifications",
      icon: Bell,
      badge:
        unreadCount > 0 ? unreadCount.toString() : undefined,
    },
    { name: "Profile", href: "profile", icon: User },
    { name: "Settings", href: "settings", icon: Settings },
  ];

  const handleNavigate = (href: string) => {
    navigateTo(href);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
                <CheckSquare className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-xl text-white">
                TaskFlow
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden text-white hover:bg-purple-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.href;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.href)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors relative
                    ${
                      isActive
                        ? "bg-purple-700 text-white border-r-2 border-purple-300"
                        : "text-purple-100 hover:bg-purple-700 hover:text-white"
                    }
                  `}
                >
                  <Icon
                    className={`h-5 w-5 mr-3 ${isActive ? "text-white" : "text-purple-200"}`}
                  />
                  <span className="flex-1 text-left">
                    {item.name}
                  </span>
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0 ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-purple-700">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center mr-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-purple-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-purple-200 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-purple-100 hover:text-white hover:bg-purple-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}