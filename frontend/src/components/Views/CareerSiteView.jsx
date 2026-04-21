import React, { useContext, useState, useEffect } from 'react';
import { Settings, Eye, Globe, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './CareerSiteView.module.css';

const presetColors = ['#2684FF', '#36B37E', '#FF5630', '#6554C0', '#00B8D9', '#172B4D'];

export default function CareerSiteView() {
  const { siteSettings, settingsLoading, updateSettings, jobs, toggleJobPublish } = useAppContext();
  const [localSettings, setLocalSettings] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (siteSettings) {
      setLocalSettings(siteSettings);
    }
  }, [siteSettings]);

  if (settingsLoading || !localSettings) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#5E6C84', fontSize: '18px' }}>Loading Settings...</div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const publicJobs = jobs.filter(j => j.isPublic);

  return (
    <div className={styles.container}>
      {/* Left Pane: Customization Controls */}
      <div className={styles.leftPane}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}><Settings size={20} /> Site Customization</h2>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Global Branding</h3>
          <div className={styles.formGroup}>
            <label>Hero Title</label>
            <input 
              type="text" 
              value={localSettings.heroTitle}
              onChange={e => setLocalSettings({...localSettings, heroTitle: e.target.value})}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Hero Subtitle</label>
            <textarea 
              rows={2}
              value={localSettings.heroSubtitle}
              onChange={e => setLocalSettings({...localSettings, heroSubtitle: e.target.value})}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Primary Theme Color</label>
            <div className={styles.colorPicker}>
              {presetColors.map(color => (
                <button
                  key={color}
                  className={`${styles.colorBtn} ${localSettings.primaryColor === color ? styles.active : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setLocalSettings({...localSettings, primaryColor: color})}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Job Postings Visibility</h3>
          <div className={styles.jobList}>
            {jobs.map(job => (
              <div key={job.id} className={styles.jobItem}>
                <div className={styles.jobInfo}>
                  <div className={styles.jobLabel}>{job.title}</div>
                  <div className={styles.jobMeta}>{job.department || job.type} • {job.location}</div>
                </div>
                <div 
                  className={`${styles.toggleSwitch} ${job.isPublic ? styles.active : ''}`}
                  onClick={() => toggleJobPublish(job.id, !job.isPublic)}
                >
                  <div className={styles.toggleKnob}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.saveSection}>
          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Right Pane: Live Preview */}
      <div className={styles.rightPane}>
        <div className={styles.previewWindow}>
          <div className={styles.previewHeader}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
            <span style={{marginLeft: 'auto', fontSize: '12px', color: '#172B4D', display: 'flex', alignItems: 'center', gap: '4px'}}>
              <Globe size={12}/> Live Preview <Eye size={12}/>
            </span>
          </div>
          
          <div className={styles.previewNav}>
            <div className={styles.previewLogo}>tiimi</div>
            <div style={{color: localSettings.primaryColor, fontWeight: 500, fontSize: '14px'}}>Career Portal</div>
          </div>

          <div className={styles.previewHero} style={{ backgroundColor: localSettings.primaryColor }}>
            <h1>{localSettings.heroTitle || 'Your Awesome Title'}</h1>
            <p>{localSettings.heroSubtitle || 'A cool subtitle here'}</p>
          </div>

          <div className={styles.previewContent}>
            <h2>Current Openings ({publicJobs.length})</h2>
            <div className={styles.previewJobsGrid}>
              {publicJobs.length === 0 ? (
                <div style={{color: '#5E6C84'}}>No jobs currently published.</div>
              ) : (
                publicJobs.map(job => (
                  <div key={job.id} className={styles.previewJobCard}>
                    <div className={styles.previewJobInfo}>
                      <h4>{job.title}</h4>
                      <span className={styles.previewJobMeta}>{job.type} • {job.location}</span>
                    </div>
                    <button className={styles.previewBtn} style={{ backgroundColor: localSettings.primaryColor }}>
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
