import { createContext, useState, useContext, useEffect } from "react";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("v2_messages");
    if (saved) return JSON.parse(saved);
    return {
      "Team Admin": [
        { id: 1, sender: "Team Admin", text: "Welcome to the team!", time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), date: new Date().toISOString() }
      ]
    };
  });

  const [blockedUsers, setBlockedUsers] = useState(() => {
    const saved = localStorage.getItem("v2_blocked");
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(() => {
    const saved = localStorage.getItem("v2_unread_messages");
    if (saved) return JSON.parse(saved);
    return 0;
  });

  useEffect(() => {
    localStorage.setItem("v2_messages", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("v2_blocked", JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    localStorage.setItem("v2_unread_messages", JSON.stringify(unreadMessagesCount));
  }, [unreadMessagesCount]);

  const clearUnreadMessages = () => {
    setUnreadMessagesCount(0);
  };

  const blockUser = (contact) => {
    if (!blockedUsers.includes(contact)) {
      setBlockedUsers(prev => [...prev, contact]);
    }
  };

  const clearChat = (contact) => {
    setConversations(prev => ({
      ...prev,
      [contact]: []
    }));
  };

  const getMessages = (contact) => conversations[contact] || [];

  const sendMessage = (contact, text, sender = "You") => {
    if (blockedUsers.includes(contact) || blockedUsers.includes(sender)) return; // Enforce Block rules

    const newMsg = {
      id: Date.now(),
      sender,
      text,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: new Date().toISOString()
    };
    
    setConversations(prev => ({
      ...prev,
      [contact]: [...(prev[contact] || []), newMsg]
    }));

    if (sender !== "You") {
      setUnreadMessagesCount(prev => prev + 1);
    }
  };

  const initChat = (contact, refText) => {
    if (blockedUsers.includes(contact)) return;
    if (!conversations[contact]) {
      setConversations(prev => ({
        ...prev,
        [contact]: [
          { id: Date.now(), sender: "You", text: `Hi ${contact}, I saw your request: "${refText}". I'm interested!`, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), date: new Date().toISOString() }
        ]
      }));
    }
  };

  return (
    <MessageContext.Provider value={{ conversations, getMessages, sendMessage, initChat, blockUser, clearChat, blockedUsers, unreadMessagesCount, clearUnreadMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMessages = () => useContext(MessageContext);
