import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../core/firebase";
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState({});
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
    localStorage.setItem("v2_blocked", JSON.stringify(blockedUsers));
  }, [blockedUsers]);

  useEffect(() => {
    localStorage.setItem("v2_unread_messages", JSON.stringify(unreadMessagesCount));
  }, [unreadMessagesCount]);

  useEffect(() => {
    if (!user) {
      setConversations({});
      return;
    }
    const q = query(
      collection(db, "conversations"),
      where("participantIds", "array-contains", user.id)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = {};
      snapshot.forEach(doc => {
        convs[doc.id] = doc.data();
      });
      setConversations(convs);
    });
    return () => unsubscribe();
  }, [user]);

  const clearUnreadMessages = () => {
    setUnreadMessagesCount(0);
  };

  const blockUser = (userId) => {
    if (!blockedUsers.includes(userId)) {
      setBlockedUsers(prev => [...prev, userId]);
    }
  };

  const clearChat = async (conversationId) => {
    // We only remove it from the UI locally or we could delete the doc.
    // For simplicity, we just delete it from Firestore for both parties if one clears,
    // or ideally just soft-delete. Let's just do soft-delete by clearing messages.
    if (!user) return;
    try {
      const convRef = doc(db, "conversations", conversationId);
      await updateDoc(convRef, { messages: [] });
    } catch (err) {
      console.error("Error clearing chat", err);
    }
  };

  const getMessages = (conversationId) => {
    if (!conversations[conversationId]) return [];
    return conversations[conversationId].messages || [];
  };

  const getConversationId = (id1, id2) => {
    if (!id1 || !id2) return null;
    return [String(id1), String(id2)].sort().join("_");
  };

  const sendMessage = async (contactId, contactName, text) => {
    if (!user) return;
    if (blockedUsers.includes(contactId)) return;

    const convId = getConversationId(user.id, contactId);
    if (!convId) return;

    const newMsg = {
      id: Date.now(),
      senderId: user.id,
      text,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: new Date().toISOString()
    };
    
    try {
      const convRef = doc(db, "conversations", convId);
      const convSnap = await getDoc(convRef);
      if (!convSnap.exists()) {
        await setDoc(convRef, {
          id: convId,
          participantIds: [user.id, contactId],
          participants: {
            [user.id]: user.name,
            [contactId]: contactName
          },
          messages: [newMsg],
          lastUpdated: new Date().toISOString()
        });
      } else {
        await updateDoc(convRef, {
          messages: arrayUnion(newMsg),
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const initChat = (contactId, contactName) => {
    if (!user) return null;
    if (blockedUsers.includes(contactId)) return null;
    
    const convId = getConversationId(user.id, contactId);
    if (!convId) return null;

    // We don't necessarily need to create it in Firestore until a message is sent,
    // but the UI expects it to be in `conversations`.
    // Let's create it proactively if it doesn't exist.
    const createConv = async () => {
      try {
        const convRef = doc(db, "conversations", convId);
        const convSnap = await getDoc(convRef);
        if (!convSnap.exists()) {
          await setDoc(convRef, {
            id: convId,
            participantIds: [user.id, contactId],
            participants: {
              [user.id]: user.name,
              [contactId]: contactName
            },
            messages: [],
            lastUpdated: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Error init chat", err);
      }
    };
    
    if (!conversations[convId]) {
      createConv();
    }
    
    return convId;
  };

  return (
    <MessageContext.Provider value={{ conversations, getMessages, sendMessage, initChat, getConversationId, blockUser, clearChat, blockedUsers, unreadMessagesCount, clearUnreadMessages }}>
      {children}
    </MessageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMessages = () => useContext(MessageContext);
