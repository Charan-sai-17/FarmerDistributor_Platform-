
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  unread: boolean;
}

interface NotificationsDropdownProps {
  onViewAll: () => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onViewAll }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Crop Verified',
      message: 'Your tomato crop has been verified by Agent Ramesh',
      time: '2 hours ago',
      type: 'success',
      unread: true
    },
    {
      id: '2',
      title: 'New Contract Offer',
      message: 'Distributor Kumar sent a contract offer',
      time: '4 hours ago',
      type: 'info',
      unread: true
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Milestone payment of ₹15,000 received',
      time: '1 day ago',
      type: 'success',
      unread: false
    },
    {
      id: '4',
      title: 'Verification Pending',
      message: 'Rice crop pending agent verification',
      time: '2 days ago',
      type: 'warning',
      unread: false
    },
    {
      id: '5',
      title: 'Welcome',
      message: 'Welcome to AgroConnect platform',
      time: '1 week ago',
      type: 'info',
      unread: false
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.unread) {
      markAsRead(notification.id);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto bg-white border shadow-lg z-50">
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className="p-3 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex space-x-3 w-full">
                  <span className="text-lg flex-shrink-0">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm font-medium line-clamp-1 ${notification.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            <div className="p-3 border-t bg-gray-50">
              <Button 
                variant="ghost" 
                onClick={onViewAll} 
                className="w-full text-sm hover:bg-gray-100 transition-colors"
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
