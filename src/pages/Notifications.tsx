
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellOff, 
  Check, 
  Trash2, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Info,
  TrendingUp,
  User,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'investment' | 'contract' | 'verification';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N001',
      type: 'success',
      title: 'Investment Completed',
      message: 'Your investment of ₹25,000 in Tomato farming by Ramesh Kumar has been successfully processed.',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      actionable: true,
      actionText: 'View Contract',
      actionUrl: '/contracts'
    },
    {
      id: 'N002',
      type: 'info',
      title: 'Crop Update Available',
      message: 'New growth photos uploaded for your Rice farming investment. Check the latest progress.',
      timestamp: '2024-01-14T14:20:00Z',
      read: false,
      actionable: true,
      actionText: 'View Updates',
      actionUrl: '/crop/CROP002'
    },
    {
      id: 'N003',
      type: 'investment',
      title: 'New Investment Opportunity',
      message: 'High-yield Cotton farming available in Warangal with 22% expected ROI. Limited slots available.',
      timestamp: '2024-01-13T09:15:00Z',
      read: true,
      actionable: true,
      actionText: 'Explore',
      actionUrl: '/crop-explorer'
    },
    {
      id: 'N004',
      type: 'warning',
      title: 'Weather Alert',
      message: 'Heavy rainfall predicted in your investment region. Farmer has taken protective measures.',
      timestamp: '2024-01-12T16:45:00Z',
      read: true,
      actionable: false
    },
    {
      id: 'N005',
      type: 'verification',
      title: 'Verification Completed',
      message: 'Land verification for Suresh Reddy completed successfully. Investment can proceed.',
      timestamp: '2024-01-11T11:30:00Z',
      read: true,
      actionable: false
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-purple-600" />;
      case 'contract': return <FileText className="w-5 h-5 text-gray-600" />;
      case 'verification': return <User className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'investment': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-gray-100 text-gray-800';
      case 'verification': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All Marked as Read",
      description: "All notifications have been marked as read",
    });
  };

  const handleAction = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    markAsRead(notification.id);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread') return !notif.read;
    if (activeTab === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-600">Stay updated with your investments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <Check className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {unreadCount} Unread
              </Badge>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Notifications</h3>
                    <p className="text-gray-600">
                      {activeTab === 'unread' && "You're all caught up! No unread notifications."}
                      {activeTab === 'read' && "No read notifications to show."}
                      {activeTab === 'all' && "You don't have any notifications yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`hover:shadow-md transition-all cursor-pointer ${
                        !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            {/* Icon */}
                            <div className={`p-2 rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-white'}`}>
                              {getTypeIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </h3>
                                    <Badge variant="outline" className={getTypeColor(notification.type)}>
                                      {notification.type}
                                    </Badge>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2 ml-4">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification.id);
                                      }}
                                      className="p-2"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Action Button */}
                              {notification.actionable && notification.actionText && (
                                <div className="mt-3">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAction(notification)}
                                    className="text-xs"
                                  >
                                    {notification.actionText}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Notifications;
