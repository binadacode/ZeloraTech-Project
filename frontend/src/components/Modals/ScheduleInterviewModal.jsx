import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './ScheduleInterviewModal.module.css';
import { useAppContext } from '../../context/AppContext';

export default function ScheduleInterviewModal({ isOpen, onClose, initialValues }) {
  const { candidates, scheduleInterview } = useAppContext();
  const [formData, setFormData] = useState({
    candidateId: '',
    type: 'Technical Interview',
    date: '',
    time: '10:00',
    duration: '60'
  });
  const [loading, setLoading] = useState(false);

  // Sync with initialValues when they change or modal opens
  React.useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({
        ...prev,
        date: initialValues.date || prev.date,
        time: initialValues.time || prev.time
      }));
    }
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const candidate = candidates.find(c => c.id === formData.candidateId);
    const dateTime = `${formData.date}T${formData.time}:00`;
    
    try {
      await scheduleInterview({
        candidateId: formData.candidateId,
        candidateName: candidate ? candidate.name : 'Unknown',
        type: formData.type,
        dateTime,
        duration: parseInt(formData.duration)
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Schedule Interview</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label>Candidate</label>
              <select 
                className={styles.select}
                value={formData.candidateId}
                onChange={e => setFormData({...formData, candidateId: e.target.value})}
                required
              >
                <option value="">Select a candidate</option>
                {candidates.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Interview Type</label>
              <select 
                className={styles.select}
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Technical Interview">Technical Interview</option>
                <option value="HR Interview">HR Interview</option>
                <option value="Live Coding Test">Live Coding Test</option>
                <option value="Culture Fit">Culture Fit</option>
                <option value="Manager Round">Manager Round</option>
              </select>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input 
                  type="date" 
                  className={styles.input}
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Time</label>
                <input 
                  type="time" 
                  className={styles.input}
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Duration (minutes)</label>
              <select 
                className={styles.select}
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
