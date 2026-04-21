import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import styles from './ScheduleInterviewModal.module.css'; 
import { useAppContext } from '../../context/AppContext';

export default function CustomizeFormModal({ isOpen, onClose, jobId }) {
  const { formConfig, updateFormConfig } = useAppContext();
  const [localFields, setLocalFields] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && formConfig) {
      setLocalFields([...formConfig]);
    }
  }, [isOpen, formConfig]);

  if (!isOpen) return null;

  const handleToggleEnable = (id) => {
    setLocalFields(localFields.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const handleToggleRequired = (id) => {
    setLocalFields(localFields.map(f => 
      f.id === id ? { ...f, required: !f.required } : f
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateFormConfig(jobId, localFields);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Customize Application Form</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>

        <div className={styles.body}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Choose which fields candidates should see and which are mandatory.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', padding: '10px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ flex: 2 }}>Field Name</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Visible</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Required</div>
            </div>

            {localFields.map((field) => (
              <div key={field.id} style={{ 
                display: 'flex', 
                padding: '12px 10px', 
                alignItems: 'center',
                borderBottom: '1px solid var(--border-color)',
                opacity: field.enabled ? 1 : 0.6
              }}>
                <div style={{ flex: 2, fontSize: '14px', fontWeight: 500 }}>{field.label}</div>
                
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={() => handleToggleEnable(field.id)}
                    style={{ 
                      width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)',
                      background: field.enabled ? 'var(--color-primary)' : 'transparent',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                  >
                    {field.enabled && <Check size={14} />}
                  </button>
                </div>

                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={() => handleToggleRequired(field.id)}
                    disabled={!field.enabled}
                    style={{ 
                      width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border-color)',
                      background: field.required && field.enabled ? '#000' : 'transparent',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: field.enabled ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {field.required && field.enabled && <Check size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
