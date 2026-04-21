import React from 'react';
import styles from './Views.module.css';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

export default function JobInfoView({ job, onEdit }) {
  if (!job) return <div className={styles.loading}>Loading Job Info...</div>;

  const requirementsList = job.requirements ? job.requirements.split('\n') : [];

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>{job.title} Job Description</h2>
        <button className={styles.editBtn} onClick={onEdit}>Edit Details</button>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoRow}><Briefcase size={16}/> <strong>Department:</strong> {job.department}</div>
        <div className={styles.infoRow}><MapPin size={16}/> <strong>Location:</strong> {job.location}</div>
        <div className={styles.infoRow}><DollarSign size={16}/> <strong>Salary:</strong> {job.salaryRange || 'Not Specified'}</div>
        <div className={styles.infoRow}><Clock size={16}/> <strong>Type:</strong> {job.jobType || 'Not Specified'}</div>
      </div>

      <div className={styles.section}>
        <h3>About the Role</h3>
        <p className={styles.descriptionText}>{job.description || 'No description provided.'}</p>
      </div>

      <div className={styles.section}>
        <h3>Requirements</h3>
        {requirementsList.length > 0 ? (
          <ul className={styles.list}>
            {requirementsList.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        ) : (
          <p>No requirements listed.</p>
        )}
      </div>
    </div>
  );
}

