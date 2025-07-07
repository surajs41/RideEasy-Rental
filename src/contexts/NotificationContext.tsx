import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: number;
  user_id: string;
  user_type: 'admin' | 'user';
  type: 'booking' | 'payment' | 'offer' | 'general';
  message: string;
  status: 'approved' | 'rejected' | 'info';
  is_read: boolean;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: number) => void;
  fetchNotifications: (userId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const socket: Socket = io('http://localhost:4000'); // Change if backend runs elsewhere

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    socket.on('notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
    });
    return () => {
      socket.off('notification');
    };
  }, []);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = async (notificationId: number) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n));
    await fetch('http://localhost:4000/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notification_id: notificationId })
    });
  };

  const fetchNotifications = async (userId: string) => {
    const res = await fetch(`http://localhost:4000/notifications/${userId}`);
    const data = await res.json();
    setNotifications(data);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx;
}; 