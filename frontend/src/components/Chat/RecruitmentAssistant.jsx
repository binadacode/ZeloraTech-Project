import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, User, Bot, Download, Search, Layout, FilePlus, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';
import styles from './RecruitmentAssistant.module.css';

export default function RecruitmentAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { role: 'ai', text: 'Hi! I\'m your Recruitment Assistant. How can I help you manage your talent pipeline today?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const { 
    setActiveTab, 
    setGlobalSearch, 
    addNotification, 
    createJob, 
    fetchActivities 
  } = useAppContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isThinking]);

  const handleAction = async (action) => {
    if (!action) return;

    switch (action.type) {
      case 'NAVIGATE':
        setActiveTab(action.payload);
        break;
      case 'FILTER':
        setGlobalSearch(action.payload);
        setActiveTab('Candidates');
        break;
      case 'SUMMARIZE':
        // Text is already in response, but we could do more here if needed
        break;
      case 'DOWNLOAD_REPORT':
        addNotification(`Downloading report: ${action.payload.fileName}`, 'info');
        // Simulate download
        setTimeout(() => {
          addNotification('Report downloaded successfully', 'success');
        }, 3000);
        break;
      case 'SUBMIT_JOB':
        try {
          await createJob(action.payload);
          addNotification(`Job "${action.payload.title}" created via Assistant`, 'success');
          fetchActivities();
        } catch (error) {
          addNotification('Failed to create job via Assistant', 'error');
        }
        break;
      default:
        console.log('Unknown action type:', action.type);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim() || isThinking) return;

    const userMsg = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    try {
      const response = await axios.post('http://localhost:5005/api/chat', { 
        message: userMsg 
      });

      const aiResponse = response.data;
      setHistory(prev => [...prev, { role: 'ai', text: aiResponse.text }]);
      
      if (aiResponse.action) {
        handleAction(aiResponse.action);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setHistory(prev => [...prev, { role: 'ai', text: 'Sorry, I ran into an error connecting to the server.' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const quickActions = [
    { label: 'Summarize Pipeline', icon: Layout },
    { label: 'Show Screening', icon: Search },
    { label: 'Go to Calendar', icon: ChevronRight },
    { label: 'New Job for HR', icon: FilePlus }
  ];

  if (!isOpen) {
    return (
      <button className={styles.fab} onClick={() => setIsOpen(true)}>
        <Sparkles size={28} strokeWidth={2.5} />
      </button>
    );
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <div className={styles.iconWrapper}><Sparkles size={18} /></div>
          AI Recruitment Assistant
        </div>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.messages}>
        {history.map((msg, i) => (
          <div key={i} className={`${styles.message} ${msg.role === 'ai' ? styles.aiMessage : styles.userMessage}`}>
            {msg.text}
          </div>
        ))}
        {isThinking && (
          <div className={styles.thinking}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.quickActions}>
        {quickActions.map((action, i) => (
          <div 
            key={i} 
            className={styles.quickAction} 
            onClick={() => {
              setMessage(action.label);
              // Small delay to allow state to update before handleSend is called by some other trigger if any
              setTimeout(() => handleSend(), 10);
            }}
          >
            <action.icon size={12} style={{marginRight: '4px'}} />
            {action.label}
          </div>
        ))}
      </div>

      <form className={styles.inputArea} onSubmit={handleSend}>
        <div className={styles.inputWrapper}>
          <input 
            className={styles.input}
            type="text" 
            placeholder="Ask me anything..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendBtn} disabled={!message.trim() || isThinking}>
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
