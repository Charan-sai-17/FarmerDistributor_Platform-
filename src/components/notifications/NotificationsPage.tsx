
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationsPageProps {
  onBack: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const notifications = [
    {
      id: '1',
      title: 'Crop Verified',
      message: 'Your tomato crop has been verified by Agent Ramesh. You can now proceed with contract negotiations.',
      time: '2 hours ago',
      type: 'success',
      unread: true
    },
    {
      id: '2',
      title: 'New Contract Offer',
      message: 'Distributor Kumar sent a contract offer for your rice crop with price ₹45,000',
      time: '4 hours ago',
      type: 'info',
      unread: true
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Milestone payment of ₹15,000 received for tomato crop delivery',
      time: '1 day ago',
      type: 'success',
      unread: false
    },
    {
      id: '4',
      title: 'Verification Pending',
      message: 'Your rice crop is pending agent verification. Agent will visit within 2 days.',
      time: '2 days ago',
      type: 'warning',
      unread: false
    },
    {
      id: '5',
      title: 'Welcome to AgroConnect',
      message: 'Welcome to the AgroConnect platform. Start by adding your first crop for verification.',
      time: '1 week ago',
      type: 'info',
      unread: false
    }
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-heading font-bold">All Notifications</h1>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`${notification.unread ? 'ring-2 ring-blue-200' : ''}`}>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{notification.title}</h3>
                      <div className="flex items-center space-x-2">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <Badge className={getNotificationColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-400">{notification.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
