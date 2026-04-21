import React from 'react';
import styles from './Views.module.css';

export default function CalendarView() {
  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
  const days = ["Mon, Oct 30", "Tue, Oct 31", "Wed, Nov 1", "Thu, Nov 2", "Fri, Nov 3"];

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>Interview Calendar</h2>
        <div style={{display:'flex', gap:'8px'}}>
          <button className={styles.outlineBtn}>Today</button>
          <button className={styles.primaryBtn}>+ Schedule Interview</button>
        </div>
      </div>
      
      <div className={styles.calendarGrid}>
        <div className={styles.timeColumn}>
          <div className={styles.headerLabel}>Time</div>
          {hours.map(h => <div key={h} className={styles.timeSlot}>{h}</div>)}
        </div>
        {days.map((day, idx) => (
          <div key={day} className={styles.dayColumn}>
            <div className={styles.headerLabel}>{day}</div>
            <div className={styles.slotsWrapper}>
              {hours.map(h => (
                <div key={h} className={styles.slottCell}>
                  {idx === 1 && h === '10:00' && (
                    <div className={styles.eventBlock} style={{backgroundColor: 'var(--bg-interview)', borderLeft: '4px solid var(--color-primary)'}}>
                      <strong>Cameron Dickens</strong><br/>Technical Interview
                    </div>
                  )}
                  {idx === 3 && h === '14:00' && (
                    <div className={styles.eventBlock} style={{backgroundColor: 'var(--bg-test)', borderLeft: '4px solid var(--color-test)'}}>
                      <strong>Lola Kirlin</strong><br/>Live Coding Test
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
