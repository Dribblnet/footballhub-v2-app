import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMessages } from "../../context/MessageContext";
import { usePlayers } from "../../context/PlayerContext";
import ResponsiveView from "../../components/layout/ResponsiveView";
import MessagesMobile from "./components/messages/mobile/MessagesMobile";
import MessagesDesktop from "./components/messages/desktop/MessagesDesktop";
import MessagesTablet from "./components/messages/tablet/MessagesTablet";

export default function Messages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contact = searchParams.get("contact");
  const ref = searchParams.get("ref");

  const { conversations, getMessages, sendMessage, initChat, blockUser, clearChat, blockedUsers, clearUnreadMessages } = useMessages();
  const { players } = usePlayers();
  const [activeChat, setActiveChat] = useState(contact || null);
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
    if (contact && ref) {
      initChat(contact, ref);
    }
  }, [contact, ref, initChat]);

  const messages = activeChat ? getMessages(activeChat) : [];
  const contacts = Object.keys(conversations).filter(c => !blockedUsers.includes(c));

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    sendMessage(activeChat, inputText, "You");
    setInputText("");

    setTimeout(() => {
      sendMessage(activeChat, "Sounds good, let's coordinate the details.", activeChat);
    }, 1500);
  };

  const controllerProps = {
    navigate,
    activeChat, setActiveChat,
    previewPlayerId, setPreviewPlayerId,
    userSearch, setUserSearch,
    menuOpen, setMenuOpen,
    reportModal, setReportModal,
    inputText, setInputText,
    players, contacts, messages, reportReasons,
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
