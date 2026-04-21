import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import styles from './ScheduleInterviewModal.module.css'; // Reusing similar layout styles
import { useAppContext } from '../../context/AppContext';

export default function EditScoreCardModal({ isOpen, onClose, jobId }) {
  const { scoreCard, updateScoreCard } = useAppContext();
  const [localCriteria, setLocalCriteria] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && scoreCard) {
      setLocalCriteria([...scoreCard]);
    }
  }, [isOpen, scoreCard]);

  if (!isOpen) return null;

  const handleAddCriteria = () => {
    setLocalCriteria([
      ...localCriteria,
      { id: Date.now().toString(), title: "New Criteria", weight: "10%", description: "" }
    ]);
  };

  const handleRemoveCriteria = (id) => {
    setLocalCriteria(localCriteria.filter(c => c.id !== id));
  };

  const handleUpdateCriteria = (id, field, value) => {
    setLocalCriteria(localCriteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateScoreCard(jobId, localCriteria);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Edit Score Card Template</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.body} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            Define the criteria and weights used to evaluate candidates for this position.
          </p>
          
          {localCriteria.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
              No criteria defined. Click below to add one.
            </div>
          )}

          {localCriteria.map((item) => (
            <div key={item.id} style={{ 
              display: 'flex', 
              gap: '12px', 
              padding: '12px', 
              background: 'var(--bg-main)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '8px',
              alignItems: 'flex-start'
            }}>
              <div style={{ color: 'var(--text-secondary)', paddingTop: '10px' }}>
                <GripVertical size={16} />
              </div>
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    className={styles.input} 
                    style={{ flex: 3 }}
                    placeholder="Criteria Title (e.g. Technical Skills)"
                    value={item.title}
                    onChange={e => handleUpdateCriteria(item.id, 'title', e.target.value)}
                  />
                  <input 
                    className={styles.input} 
                    style={{ flex: 1 }}
                    placeholder="Weight %"
                    value={item.weight}
                    onChange={e => handleUpdateCriteria(item.id, 'weight', e.target.value)}
                  />
                </div>
                <textarea 
                  className={styles.input} 
                  placeholder="Short description of what to look for..."
                  style={{ minHeight: '60px', width: '100%', resize: 'vertical' }}
                  value={item.description}
                  onChange={e => handleUpdateCriteria(item.id, 'description', e.target.value)}
                />
              </div>

              <button 
                onClick={() => handleRemoveCriteria(item.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', paddingTop: '10px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button 
            className={styles.cancelBtn} 
            style={{ width: '100%', borderStyle: 'dashed', marginTop: '10px' }}
            onClick={handleAddCriteria}
          >
            <Plus size={16} style={{ marginRight: '4px' }} /> Add Evaluation Criteria
          </button>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>
    </div>
  );
}
