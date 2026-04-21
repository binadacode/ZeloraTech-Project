import React from 'react';
import styles from './Views.module.css';

export default function ApplicationFormView() {
  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>Application Form Preview</h2>
        <button className={styles.outlineBtn}>Customize Form</button>
      </div>

      <div className={styles.formPreview}>
        <div className={styles.formGroup}>
          <label>Full Name <span className={styles.required}>*</span></label>
          <input type="text" placeholder="John Doe" disabled className={styles.inputPreview} />
        </div>
        
        <div className={styles.formGroup}>
          <label>Email Address <span className={styles.required}>*</span></label>
          <input type="email" placeholder="john@example.com" disabled className={styles.inputPreview} />
        </div>

        <div className={styles.formGroup}>
          <label>Resume / CV <span className={styles.required}>*</span></label>
          <div className={styles.uploadPreview}>
            <span>Drag and drop file here, or click to browse</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Cover Letter</label>
          <textarea placeholder="Write your cover letter here..." disabled className={styles.textareaPreview}></textarea>
        </div>

        <button className={styles.primaryBtn} disabled>Submit Application</button>
      </div>
    </div>
  );
}
