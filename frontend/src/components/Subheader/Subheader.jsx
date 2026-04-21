import React, { useContext, useState, useRef, useEffect } from 'react';
import styles from './Subheader.module.css';
import { Search, ChevronLeft, MoreHorizontal, Share, UserPlus, Settings, LayoutGrid, ChevronDown, Edit, Copy, Trash2, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import ShareModal from './ShareModal';

export default function Subheader() {
  const { currentJob, setActiveTab, setActiveTopTab, updateJob, deleteJob, duplicateJob } = useAppContext();
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editData, setEditData] = useState({ title: '', department: '', location: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusRef = useRef(null);
  const moreRef = useRef(null);

  useEffect(() => {
    if (currentJob) {
      setEditData({
        title: currentJob.title || '',
        department: currentJob.department || '',
        location: currentJob.location || ''
      });
    }
  }, [currentJob]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentJob) return null;

  const handleStatusChange = async (newStatus) => {
    setIsStatusMenuOpen(false);
    try {
      await updateJob(currentJob.id, { status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const handleDuplicate = async () => {
    setIsMoreMenuOpen(false);
    try {
      const newJob = await duplicateJob(currentJob);
      // Optionally navigate to the new job
      alert(`Job duplicated: ${newJob.title}`);
    } catch (error) {
      console.error("Failed to duplicate job", error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateJob(currentJob.id, editData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to edit job", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async () => {
    setIsDeleteModalOpen(false);
    try {
      await deleteJob(currentJob.id);
      setActiveTopTab("Jobs");
    } catch (error) {
      console.error("Failed to delete job", error);
      alert("Failed to delete job. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Open') return { bg: '#dcfce7', text: '#166534', dot: '#166534' };
    if (status === 'Closed') return { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };
    if (status === 'On Hold') return { bg: '#fef3c7', text: '#92400e', dot: '#d97706' };
    if (status === 'Archive') return { bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' };
    return { bg: '#dcfce7', text: '#166534', dot: '#166534' };
  };

  const currentStatusStyle = getStatusColor(currentJob.status);
  return (
    <div className={styles.subheader}>
      <div className={styles.topRow}>
        <div className={styles.titleGroup}>
          <button className={styles.backBtn} onClick={() => setActiveTopTab('Jobs')}><ChevronLeft size={18} /></button>
          <h1 className={styles.jobTitle}>{currentJob.title}</h1>
          <div className={styles.badges}>
            <div className={styles.statusDropdownContainer} ref={statusRef}>
              <button 
                className={styles.statusBadge} 
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                style={{ backgroundColor: currentStatusStyle.bg, color: currentStatusStyle.text }}
              >
                <div className={styles.statusDot} style={{ backgroundColor: currentStatusStyle.dot }}></div>
                {currentJob.status}
                <ChevronDown size={14} className={`${styles.chevron} ${isStatusMenuOpen ? styles.rotated : ''}`} />
              </button>
              
              {isStatusMenuOpen && (
                <div className={styles.dropdownMenu}>
                  {['Open', 'Closed', 'On Hold', 'Archive'].map(status => (
                    <div 
                      key={status}
                      className={`${styles.dropdownItem} ${currentJob.status === status ? styles.activeItem : ''}`}
                      onClick={() => handleStatusChange(status)}
                    >
                      <div className={styles.statusDot} style={{ backgroundColor: getStatusColor(status).dot }}></div>
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className={styles.metaInfo}>{currentJob.department} • {currentJob.location} • Created by {currentJob.createdBy?.name || "System"}</span>
          </div>
        </div>
        <div className={styles.actions}>
          <div className={styles.moreDropdownContainer} ref={moreRef}>
            <button className={styles.moreBtn} onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}>
              <MoreHorizontal size={18} color="#6b7280" />
            </button>
            {isMoreMenuOpen && (
              <div className={styles.dropdownMenu} style={{ right: 0, left: 'auto' }}>
                <div className={styles.dropdownItem} onClick={() => { setIsMoreMenuOpen(false); setIsEditModalOpen(true); }}><Edit size={14}/> Edit Job</div>
                <div className={styles.dropdownItem} onClick={handleDuplicate}><Copy size={14}/> Duplicate</div>
                <div className={`${styles.dropdownItem} ${styles.dangerItem}`} onClick={() => { setIsMoreMenuOpen(false); setIsDeleteModalOpen(true); }}><Trash2 size={14}/> Delete Job</div>
              </div>
            )}
          </div>
          <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)}><Share size={16} /> Share & Promote</button>
        </div>
      </div>
      
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} job={currentJob} />

      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Edit Job Details</h3>
              <button className={styles.closeBtnModal} onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Job Title</label>
                  <input 
                    type="text" 
                    value={editData.title}
                    onChange={e => setEditData({...editData, title: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Department</label>
                  <input 
                    type="text" 
                    value={editData.department}
                    onChange={e => setEditData({...editData, department: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <select 
                    value={editData.location}
                    onChange={e => setEditData({...editData, location: e.target.value})}
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '400px' }}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: '#ef4444' }}>Delete Job?</h3>
              <button className={styles.closeBtnModal} onClick={() => setIsDeleteModalOpen(false)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Are you sure you want to delete <strong>{currentJob.title}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button type="button" className={styles.submitBtn} style={{ background: '#ef4444' }} onClick={handleDeleteJob}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Edit Job Details</h3>
              <button className={styles.closeBtnModal} onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Job Title</label>
                  <input 
                    type="text" 
                    value={editData.title}
                    onChange={e => setEditData({...editData, title: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Department</label>
                  <input 
                    type="text" 
                    value={editData.department}
                    onChange={e => setEditData({...editData, department: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <select 
                    value={editData.location}
                    onChange={e => setEditData({...editData, location: e.target.value})}
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
