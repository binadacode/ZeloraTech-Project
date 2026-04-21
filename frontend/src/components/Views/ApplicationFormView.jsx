import React, { useState } from 'react';
import styles from './Views.module.css';
import { useAppContext } from '../../context/AppContext';
import CustomizeFormModal from '../Modals/CustomizeFormModal';

export default function ApplicationFormView() {
  const { formConfig, formConfigLoading, currentJob } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (formConfigLoading) {
    return <div className={styles.loading}>Loading Form Preview...</div>;
  }

  const enabledFields = formConfig.filter(f => f.enabled);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>Application Form Preview</h2>
        <button 
          className={styles.outlineBtn}
          onClick={() => setIsModalOpen(true)}
        >
          Customize Form
        </button>
      </div>

      <div className={styles.formPreview}>
        {enabledFields.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No fields enabled. Candidates will see an empty form.
          </div>
        ) : (
          enabledFields.map((field) => (
            <div key={field.id} className={styles.formGroup}>
              <label>
                {field.label} {field.required && <span className={styles.required}>*</span>}
              </label>
              
              {field.type === 'textarea' ? (
                <textarea placeholder={`Enter ${field.label.toLowerCase()}...`} disabled className={styles.textareaPreview}></textarea>
              ) : field.type === 'file' ? (
                <div className={styles.uploadPreview}>
                  <span>Drag and drop file here, or click to browse</span>
                </div>
              ) : (
                <input type={field.type} placeholder={`Enter ${field.label.toLowerCase()}...`} disabled className={styles.inputPreview} />
              )}
            </div>
          ))
        )}

        <button className={styles.primaryBtn} disabled style={{ marginTop: '20px' }}>Submit Application</button>
      </div>

      <CustomizeFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        jobId={currentJob?.id}
      />
    </div>
  );
}
