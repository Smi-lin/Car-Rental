import React, { useState } from 'react';
import { 
  MdNotifications,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdWarning,
  MdDelete,
  MdDone,
  MdMoreVert
} from 'react-icons/md';

const CarOwnerNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Rental Confirmed',
      message: 'Your vehicle rental has been confirmed for BMW X5',
      timestamp: '2 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'error',
      title: 'Payment Failed',
      message: 'The payment for your recent rental could not be processed',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'New Message',
      message: 'You have received a new message from John regarding your rental',
      timestamp: '3 hours ago',
      read: true,
    },
    {
      id: 4,
      type: 'warning',
      title: 'Maintenance Due',
      message: 'Your vehicle is due for maintenance in 3 days',
      timestamp: '1 day ago',
      read: true,
    },
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <MdCheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <MdError className="w-6 h-6 text-red-500" />;
      case 'info':
        return <MdInfo className="w-6 h-6 text-blue-500" />;
      case 'warning':
        return <MdWarning className="w-6 h-6 text-yellow-500" />;
      default:
        return <MdNotifications className="w-6 h-6 text-gray-500" />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <MdNotifications className="w-8 h-8 text-purple-500 mr-3" />
            <h1 className="text-2xl font-semibold">Notifications</h1>
          </div>
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-gray-800 rounded-lg p-4 transition-all duration-300 hover:shadow-lg 
                ${notification.read ? 'opacity-75' : 'border-l-4 border-purple-500'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-grow">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">{notification.title}</h2>
                      <span className="text-sm text-gray-400">{notification.timestamp}</span>
                    </div>
                    <p className="text-gray-300 mt-1">{notification.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center ml-4 space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                      title="Mark as read"
                    >
                      <MdDone className="w-5 h-5 text-gray-400 hover:text-green-500" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    title="Delete notification"
                  >
                    <MdDelete className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                    title="More options"
                  >
                    <MdMoreVert className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <MdNotifications className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl text-gray-400">No notifications</h3>
              <p className="text-gray-500 mt-2">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarOwnerNotifications;