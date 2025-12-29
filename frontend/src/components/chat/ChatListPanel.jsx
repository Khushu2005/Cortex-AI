import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MessageSquare, X, MoreVertical, Edit2, Trash2, Star, Check } from 'lucide-react';

const ChatListPanel = ({ 
  isOpen, 
  onClose, 
  title, 
  chatList, 
  activeChatId, 
  onSelectChat,
  searchQuery,
  setSearchQuery,
  onToggleFav,
  onDeleteChat,
  onRenameChat 
}) => {
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  
  // 🔥 States for Inline Editing
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (e, chatId) => {
    e.stopPropagation(); 
    setActiveMenuId(activeMenuId === chatId ? null : chatId);
  };

  // 🔥 Start Editing
  const startEditing = (chat) => {
    setEditingChatId(chat.id);
    setEditTitleValue(chat.title);
    setActiveMenuId(null); 
  };

  // 🔥 Save Editing
  const saveEditing = (chatId) => {
    if (editTitleValue.trim()) {
      onRenameChat(chatId, editTitleValue);
    }
    setEditingChatId(null);
  };

  const handleKeyDown = (e, chatId) => {
    if (e.key === 'Enter') saveEditing(chatId);
    if (e.key === 'Escape') setEditingChatId(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: 320, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="right-sidebar"
        >
          <div className="panel-header">
            <h3>{title}</h3>
            <button onClick={onClose} className="close-btn">
              <X size={20} />
            </button>
          </div>

          <div className="search-box">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="chat-list-container">
            {chatList.length > 0 ? (
              chatList.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                  onClick={() => onSelectChat(chat.id)}
               
                  style={{ zIndex: activeMenuId === chat.id ? 50 : 1 }}
                >
                  <MessageSquare size={18} className="chat-icon"/>
                  
                  
                  {editingChatId === chat.id ? (
                    <input 
                        type="text"
                        autoFocus
                        value={editTitleValue}
                        onChange={(e) => setEditTitleValue(e.target.value)}
                        onBlur={() => saveEditing(chat.id)}
                        onKeyDown={(e) => handleKeyDown(e, chat.id)}
                        onClick={(e) => e.stopPropagation()} 
                        className="sidebar-edit-input"
                    />
                  ) : (
                    <span className="chat-title">{chat.title}</span>
                  )}
                  
                 
                  {!editingChatId && ( 
                  <div className="menu-wrapper" style={{position: 'relative'}}>
                    <button 
                      className="more-btn"
                      onClick={(e) => handleMenuClick(e, chat.id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenuId === chat.id && (
                      <div className="popup-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
                        
                       
                        <button onClick={() => startEditing(chat)}>
                          <Edit2 size={14} /> Edit
                        </button>
                        
                        <button onClick={() => { onToggleFav(chat.id); setActiveMenuId(null); }}>
                          <Star size={14} fill={chat.isFav ? "currentColor" : "none"} color={chat.isFav ? "#FFC107" : "currentColor"} /> 
                          {chat.isFav ? "Unfavourite" : "Favourite"}
                        </button>

                        <button className="delete-opt" onClick={() => { onDeleteChat(chat.id); setActiveMenuId(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>

                      </div>
                    )}
                  </div>
                  )}

                </div>
              ))
            ) : (
              <div className="no-results">No chats found.</div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatListPanel;