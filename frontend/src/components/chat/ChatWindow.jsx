import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import api from '../../services/api'; 
import socket from '../../services/socket'; 
import ReactMarkdown from 'react-markdown'; 

const ChatWindow = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); 
  const messagesEndRef = useRef(null);
  const [loadingHistory, setLoadingHistory] = useState(false); 

 
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?.id) return;
      
      setLoadingHistory(true); 
      try {
       
        const res = await api.get(`/chat/${activeChat.id}`);
        
        
        setMessages(res.data.chat.messages || []);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingHistory(false); 
      }
    };

    fetchMessages();
  }, [activeChat?.id]); 

  useEffect(() => {
    const handleAiResponse = (data) => {
        if (data.chat === activeChat?.id) {
            const aiMsg = { role: 'model', content: data.content };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false); 
        }
    };

    const handleError = (err) => {
        console.error("Socket Error:", err);
        setIsTyping(false);
        alert("Connection error! Please refresh.");
    };

    socket.on('ai-response', handleAiResponse);
    socket.on('error', handleError);

    return () => {
        socket.off('ai-response', handleAiResponse);
        socket.off('error', handleError);
    };
  }, [activeChat?.id]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, loadingHistory]);

 
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput(''); 

   
    const tempUserMsg = { role: 'user', content: userText };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true); 


    socket.emit('ai-message', { 
        chat: activeChat.id, 
        content: userText 
    });
  };

  return (
    <div className="chat-window">
      
     
      <div className="messages-container">
        
       
        {loadingHistory ? (
            <div className="history-loader" style={{display:'flex', justifyContent:'center', marginTop:'20px'}}>
                <Loader2 className="spin-icon" size={24} />
            </div>
        ) : (
            messages.length === 0 ? (
                <div className="empty-chat-placeholder" style={{textAlign:'center', color:'var(--text-secondary)', marginTop:'2rem'}}>
                    <p>Start chatting with Cortex AI...</p>
                </div>
            ) : (
                messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message-wrapper ${msg.role === 'user' ? 'user' : 'bot'}`}
                  >
                    <div className="message-bubble">
                        {(msg.role === 'model' || msg.role === 'assistant') ? (
                           <div className="ai-text">
                               <ReactMarkdown>{msg.content || msg.text}</ReactMarkdown>
                           </div> 
                        ) : (
                           msg.content || msg.text
                        )}
                    </div>
                  </div>
                ))
            )
        )}

       
        {isTyping && (
          <div className="message-wrapper bot">
            <div className="message-bubble processing">
              
              <span>Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

    
      <div className="input-area">
        <form onSubmit={handleSend} className="input-capsule">
          <input 
            type="text" 
            placeholder="Ask Cortex..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping} 
          />
          <button type="submit" className="send-btn" disabled={isTyping || !input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;