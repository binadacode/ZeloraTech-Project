import React, { useState } from 'react';
import styles from './ShareModal.module.css';
import { X, Copy, Globe, Mail, MessageCircle, Check } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, job }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `http://localhost:5005/jobs/${job?.id}`; // Mock URL
  const shareText = `Check out this job opening: ${job?.title}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=600');
  };

  const shareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareEmail = () => {
    const url = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent('I thought you might be interested in this job: ' + shareUrl)}`;
    window.location.href = url;
  };

  const handleGeneralShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Share & Promote</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.content}>
          <p className={styles.subtitle}>Promote "{job?.title}" to attract more candidates.</p>
          
          <div className={styles.linkSection}>
            <label>Public Career Site Link</label>
            <div className={styles.inputGroup}>
              <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                className={styles.linkInput} 
              />
              <button 
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} 
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />} 
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div className={styles.socialSection}>
            <label>Share via Social Media</label>
            <div className={styles.socialIcons}>
              <button 
                className={styles.socialBtn} 
                style={{ color: '#0A66C2' }} 
                title="Share on LinkedIn"
                onClick={shareLinkedIn}
              >
                <div style={{ fontWeight: 'bold' }}>in</div>
              </button>
              <button 
                className={styles.socialBtn} 
                style={{ color: '#25D366' }} 
                title="Share on WhatsApp"
                onClick={shareWhatsApp}
              >
                <MessageCircle size={24} />
              </button>
              <button 
                className={styles.socialBtn} 
                style={{ color: '#2684FF' }} 
                title="More Share Options"
                onClick={handleGeneralShare}
              >
                <Globe size={24} />
              </button>
              <button 
                className={styles.socialBtn} 
                style={{ color: '#EA4335' }} 
                title="Share via Email"
                onClick={shareEmail}
              >
                <Mail size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
