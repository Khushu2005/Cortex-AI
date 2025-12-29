import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/chat/Sidebar";
import ChatListPanel from "../components/chat/ChatListPanel";
import ChatWindow from "../components/chat/ChatWindow";
import ProfilePanel from "../components/chat/ProfilePanel";
import { Menu, SquarePen } from "lucide-react"; 
import api from '../services/api'; 
import socket from '../services/socket'; 
import "../components/chat/ChatComponents.scss";

const ChatInterface = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [activeTab, setActiveTab] = useState("new");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ firstname: "", lastname: "", email: "" });
  const [activeChat, setActiveChat] = useState(null);
  
  
  useEffect(() => {
    const initData = async () => {
        try {
          
            const [userRes, chatRes] = await Promise.all([
              api.get('/auth/me'),
              api.get('/chat')
            ]);
            
            setUserData(userRes.data.user);
            const backendChats = chatRes.data.chats;
            const savedFavs = JSON.parse(localStorage.getItem("favChatIds")) || [];

            
            const formattedChats = backendChats.map(chat => ({
                id: chat._id || chat.id,
                title: chat.title,
                messages: [], 
                isFav: savedFavs.includes(chat._id || chat.id)
            }));

            setChatHistory(formattedChats);

        
            const lastChatId = localStorage.getItem("lastActiveChatId");
            if (lastChatId) {
                const lastChat = formattedChats.find(c => c.id === lastChatId);
                if (lastChat) {
                    setActiveChat(lastChat); 
                } else {
                    localStorage.removeItem("lastActiveChatId"); 
                }
            }

            if (!socket.connected) {
                socket.connect();
                console.log("🟢 Socket Connecting...");
            }

        } catch (error) {
            console.error("Error loading initial data:", error);
            if(error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    initData();
    document.documentElement.setAttribute("data-theme", theme);

    return () => {
        if(socket.connected) {
            socket.disconnect();
            console.log("🔴 Socket Disconnected");
        }
    };
  }, [theme, navigate]);


  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchQuery("");
    if (tabId === "history" || tabId === "fav") {
      setShowRightPanel(true); setShowProfile(false);
    } else if (tabId === "profile") {
      setShowProfile(true); setShowRightPanel(false);
    } else {
      setShowRightPanel(false); setShowProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
        await api.post('/auth/logout');
        if(socket.connected) socket.disconnect();
        localStorage.removeItem("lastActiveChatId"); 
        navigate("/login"); 
    } catch (error) {
        console.error("Logout failed:", error);
        navigate("/login"); 
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
        const res = await api.put('/auth/update-profile', updatedData);
        setUserData(res.data.user); 
        alert("Profile Updated Successfully!");
        return true; 
    } catch (error) {
        console.error("Profile update failed:", error);
        alert(error.response?.data?.message || "Failed to update profile");
        return false; 
    }
  };

 
  const handleNewChat = async () => {
    try {
        const res = await api.post('/chat', { title: "New Chat" });
        const newChat = {
            id: res.data.chat.id,
            title: res.data.chat.title,
            messages: [],
            isFav: false,
        };
        setChatHistory((prev) => [newChat, ...prev]);
        setActiveChat(newChat);
        localStorage.setItem("lastActiveChatId", newChat.id); 
        setActiveTab("new"); 
        setShowRightPanel(false); 
        setIsMobileMenuOpen(false); 
    } catch (error) {
        console.error("Error creating chat:", error);
        alert("Failed to create new chat");
    }
  };


  const handleSelectChat = async (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setActiveChat(chat); 
      localStorage.setItem("lastActiveChatId", chatId); 
      if(window.innerWidth < 768) {
          setShowRightPanel(false); 
          setIsMobileMenuOpen(false);
      }
    }
  };

  const handleToggleFav = (chatId) => {
    const updatedHistory = chatHistory.map((chat) =>
      chat.id === chatId ? { ...chat, isFav: !chat.isFav } : chat
    );
    setChatHistory(updatedHistory);
    const favIds = updatedHistory.filter((c) => c.isFav).map((c) => c.id);
    localStorage.setItem("favChatIds", JSON.stringify(favIds));
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    const originalChats = [...chatHistory];
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    
    if (activeChat && activeChat.id === chatId) {
      setActiveChat(null);
      localStorage.removeItem("lastActiveChatId"); 
      setShowRightPanel(false);
    }

    try {
        await api.delete(`/chat/${chatId}`);
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete chat");
        setChatHistory(originalChats); 
    }
  };

  const handleRenameChat = async (chatId, newTitle) => {
    if (!newTitle.trim()) return;
    const originalChats = [...chatHistory];
    const updatedHistory = chatHistory.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
    );
    setChatHistory(updatedHistory);
    if (activeChat && activeChat.id === chatId) {
        setActiveChat(prev => ({ ...prev, title: newTitle }));
    }
    try {
        await api.put(`/chat/${chatId}`, { title: newTitle });
    } catch (error) {
        console.error("Rename failed:", error);
        alert("Failed to rename chat");
        setChatHistory(originalChats); 
    }
  };

  const handleTitleDoubleClick = () => {
    if (!activeChat) return;
    setIsEditingTitle(true);
    setTitleInput(activeChat.title);
  };

  const handleTitleSave = () => {
    if (!titleInput.trim()) { setIsEditingTitle(false); return; }
    handleRenameChat(activeChat.id, titleInput); 
    setIsEditingTitle(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  let filteredChats = chatHistory;
  if (activeTab === "fav") filteredChats = filteredChats.filter((chat) => chat.isFav);
  if (searchQuery.trim()) filteredChats = filteredChats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="chat-layout">
      {isMobileMenuOpen && (<div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />)}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Sidebar
          activeTab={activeTab} setActiveTab={handleTabChange} onLogout={handleLogout}
          toggleTheme={toggleTheme} theme={theme} onNewChat={handleNewChat}
        />
      </div>
      <div className="main-content">
        <div className="mobile-header">
            <div className="header-left">
                <button onClick={() => setIsMobileMenuOpen(true)} className="menu-btn"><Menu size={24} /></button>
                <span className="mobile-brand">CORTEX <span>AI</span></span>
            </div>
            <button onClick={handleNewChat} className="mobile-new-chat-text-btn"><SquarePen size={18} />New Chat</button>
        </div>
        {activeChat ? (
          <>
            <div className="chat-title-bar" onDoubleClick={handleTitleDoubleClick}>
               {isEditingTitle ? (
                  <input autoFocus type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} onBlur={handleTitleSave} onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} className="title-edit-input" />
               ) : (
                  <span title="Double click to edit">{activeChat.title}</span>
               )}
            </div>
           
            <ChatWindow activeChat={activeChat} key={activeChat.id} /> 
          </>
        ) : (
          <div className="empty-state">
            <p>{loading ? "Loading..." : "Start a new conversation"}</p>
          </div>
        )}
      </div>
      <ChatListPanel
        isOpen={showRightPanel} onClose={() => { setShowRightPanel(false); setActiveTab(""); }}
        title={activeTab === "fav" ? "Favourite Chats" : "Chat History"}
        chatList={filteredChats} activeChatId={activeChat?.id} onSelectChat={handleSelectChat}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} onToggleFav={handleToggleFav}
        onDeleteChat={handleDeleteChat} onRenameChat={handleRenameChat} 
      />
      <ProfilePanel
        isOpen={showProfile} onClose={() => { setShowProfile(false); setActiveTab(""); }}
        userData={userData} onUpdateProfile={handleUpdateProfile} 
      />
    </div>
  );
};

export default ChatInterface;