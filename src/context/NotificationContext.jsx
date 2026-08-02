import { createContext, useState, useContext } from "react";
import { Calendar, Users, Trophy } from "lucide-react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "MATCH", text: "Your match starts in 15 minutes", time: "Just now", read: false, icon: <Calendar size={16} /> },
    { id: 2, type: "SOCIAL", text: "Alex started following you", time: "2h ago", read: false, icon: <Users size={16} /> },
    { id: 3, type: "TOURNAMENT", text: "City Cup bracket updated", time: "5h ago", read: true, icon: <Trophy size={16} /> },
    { id: 4, type: "MATCH", text: "Halftime: Rovers 1 - 0 United", time: "1d ago", read: true, icon: <Calendar size={16} /> },
  ]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, clearAll, notificationsEnabled, setNotificationsEnabled }}>
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);
