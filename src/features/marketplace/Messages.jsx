import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMessages } from "../../context/MessageContext";
import { usePlayers } from "../../context/PlayerContext";
import { useAuth } from "../../context/AuthContext";
import ResponsiveView from "../../components/layout/ResponsiveView";
import MessagesMobile from "./components/messages/mobile/MessagesMobile";
import MessagesDesktop from "./components/messages/desktop/MessagesDesktop";
import MessagesTablet from "./components/messages/tablet/MessagesTablet";

export default function Messages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contact = searchParams.get("contact");
  const contactIdParam = searchParams.get("contactId") || contact;
  const ref = searchParams.get("ref");

  const { conversations, getMessages, sendMessage, initChat, getConversationId, blockUser, clearChat, blockedUsers, clearUnreadMessages } = useMessages();
  const { players } = usePlayers();
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState(null);
  const [previewPlayerId, setPreviewPlayerId] = useState(null);

  const getPlayerByName = (name) => {
    return players.find(p => p.name === name || p.displayName === name);
  };

  useEffect(() => {
    clearUnreadMessages();
  }, [clearUnreadMessages]);
  const [inputText, setInputText] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModal, setReportModal] = useState({ isOpen: false, user: null, reason: "", description: "" });
  const reportReasons = ["Abusive Language", "Harassment", "Spam", "Fake Profile", "Inappropriate Content", "Unsportsmanlike Conduct", "Other"];

  const handleReportSubmit = () => {
    if (!reportModal.reason) {
      alert("Please select a reason.");
      return;
    }
    const reports = JSON.parse(localStorage.getItem("v2_reports") || "[]");
    reports.push({
      user: reportModal.user,
      reason: reportModal.reason,
      description: reportModal.description,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("v2_reports", JSON.stringify(reports));
    setReportModal({ isOpen: false, user: null, reason: "", description: "" });
    alert("User reported successfully.");
  };

  useEffect(() => {
    if (contact && contactIdParam && user) {
      const convId = initChat(contactIdParam, contact);
      if (convId) {
        setActiveChat(convId);
      }
    }
  }, [contact, contactIdParam, user, initChat]);

  const messages = activeChat ? getMessages(activeChat) : [];
  
  // Extract contacts from conversations involving the current user
  const contacts = user ? Object.values(conversations)
    .filter(conv => conv.participants && Object.keys(conv.participants).includes(user.id))
    .filter(conv => {
       const otherUserId = Object.keys(conv.participants).find(id => id !== user.id);
       return !blockedUsers.includes(otherUserId);
    })
    .map(conv => {
       const otherUserId = Object.keys(conv.participants).find(id => id !== user.id);
       return {
         id: otherUserId,
         name: conv.participants[otherUserId],
         conversationId: conv.id
       };
    }) : [];

  const handleSend = () => {
    if (!inputText.trim() || !activeChat || !user) return;
    
    // Find the other user's ID and Name from the active conversation
    const activeConv = conversations[activeChat];
    if (!activeConv) return;

    const otherUserId = Object.keys(activeConv.participants).find(id => id !== user.id);
    const otherUserName = activeConv.participants[otherUserId];

    if (!otherUserId) return;

    sendMessage(otherUserId, otherUserName, inputText);
    setInputText("");
  };

  const controllerProps = {
    navigate,
    activeChat, setActiveChat,
    previewPlayerId, setPreviewPlayerId,
    userSearch, setUserSearch,
    menuOpen, setMenuOpen,
    reportModal, setReportModal,
    inputText, setInputText,
    players, contacts, messages, reportReasons, user, getConversationId,
    getPlayerByName, initChat, clearChat, blockUser, handleReportSubmit, handleSend
  };

  return (
    <ResponsiveView
      mobile={<MessagesMobile {...controllerProps} />}
      tablet={<MessagesTablet {...controllerProps} />}
      desktop={<MessagesDesktop {...controllerProps} />}
    />
  );
}
