import React, { useContext, useState } from 'react';
import { Search, Plus, MapPin, Briefcase, User, Users, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './JobsView.module.css';

export default function JobsView() {
  const { jobs, jobsLoading, selectJob, createJob } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({ title: '', type: 'Engineering', location: 'Onsite' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createJob(newJobData);
      setIsModalOpen(false);
      setNewJobData({ title: '', type: 'Engineering', location: 'Onsite' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (jobsLoading) {
    return <div className={styles.loadingState}>Loading Jobs...</div>;
  }

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.jobsContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}>Active Jobs</h2>
        <div className={styles.headerActions}>
          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Create New Job
          </button>
        </div>
      </header>

      <div className={styles.jobsGrid}>
        {filteredJobs.map(job => (
          <div 
            key={job.id} 
            className={styles.jobCard} 
            onClick={() => selectJob(job.id)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.jobTitle}>{job.title}</h3>
              <span className={`${styles.statusBadge} ${job.status === 'Open' ? styles.statusOpen : styles.statusClosed}`}>
                {job.status}
              </span>
            </div>
            
            <div className={styles.metadataGrid}>
              <div className={styles.metaItem}>
                <Briefcase size={16} className={styles.icon} />
                {job.type}
              </div>
              <div className={styles.metaItem}>
                <MapPin size={16} className={styles.icon} />
                {job.location}
              </div>
              <div className={styles.metaItem}>
                <User size={16} className={styles.icon} />
                Created by {job.createdBy?.name || "Unknown"}
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <div className={styles.candidateCount}>
                <Users size={16} />
                {job.candidateCount} Candidates
              </div>
            </div>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <div style={{ color: '#5e6c84', padding: '20px' }}>No jobs found matching your search.</div>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Create New Job</h3>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Frontend Engineer" 
                    value={newJobData.title}
                    onChange={e => setNewJobData({...newJobData, title: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Department / Type</label>
                  <select 
                    value={newJobData.type}
                    onChange={e => setNewJobData({...newJobData, type: e.target.value})}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <select 
                    value={newJobData.location}
                    onChange={e => setNewJobData({...newJobData, location: e.target.value})}
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.cancelBtn} 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting || !newJobData.title.trim()}
                >
                  {isSubmitting ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
