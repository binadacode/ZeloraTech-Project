import React, { useState, useMemo } from 'react';
import styles from './Views.module.css';
import { useAppContext } from '../../context/AppContext';
import ScheduleInterviewModal from '../Modals/ScheduleInterviewModal';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function CalendarView() {
  const { interviews, cancelInterview } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date('2026-04-20')); // Monday of current week
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialValues, setModalInitialValues] = useState(null);

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);

    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const handleCellClick = (day, hour) => {
    const dateStr = day.toISOString().split('T')[0];
    setModalInitialValues({ date: dateStr, time: hour });
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setModalInitialValues(null);
    setIsModalOpen(true);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const navigateWeek = (direction) => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(nextDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date('2026-04-20'));
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
          <h2>Interview Calendar</h2>
          <div style={{display:'flex', gap:'4px'}}>
            <button className={styles.outlineBtn} onClick={() => navigateWeek(-1)} style={{padding: '4px 8px'}}><ChevronLeft size={16}/></button>
            <button className={styles.outlineBtn} onClick={() => navigateWeek(1)} style={{padding: '4px 8px'}}><ChevronRight size={16}/></button>
          </div>
        </div>
        <div style={{display:'flex', gap:'8px'}}>
          <button className={styles.outlineBtn} onClick={goToToday}>Today</button>
          <button className={styles.primaryBtn} onClick={handleCreateNew}>+ Schedule Interview</button>
        </div>
      </div>
      
      <div className={styles.calendarGrid}>
        <div className={styles.timeColumn}>
          <div className={styles.headerLabel}>Time</div>
          {hours.map(h => <div key={h} className={styles.timeSlot}>{h}</div>)}
        </div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className={styles.dayColumn}>
            <div className={styles.headerLabel}>{formatDate(day)}</div>
            <div className={styles.slotsWrapper}>
              {hours.map(h => {
                const hourInt = parseInt(h.split(':')[0]);
                const dayInterviews = interviews.filter(i => {
                  const iDate = new Date(i.dateTime);
                  return isSameDay(iDate, day) && iDate.getHours() === hourInt;
                });

                return (
                  <div 
                    key={h} 
                    className={styles.slottCell} 
                    onClick={() => handleCellClick(day, h)}
                    style={{ cursor: 'pointer' }}
                  >
                    {dayInterviews.map(interview => (
                      <div 
                        key={interview.id} 
                        className={styles.eventBlock} 
                        onClick={(e) => e.stopPropagation()} // Prevent cell click
                        style={{
                          backgroundColor: interview.type.includes('Coding') ? 'var(--bg-test)' : 'var(--bg-interview)', 
                          borderLeft: `4px solid ${interview.type.includes('Coding') ? 'var(--color-test)' : 'var(--color-primary)'}`,
                          position: 'relative'
                        }}
                      >
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <strong>{interview.candidateName}</strong>
                          <button 
                            onClick={() => cancelInterview(interview.id)}
                            style={{background:'none', border:'none', cursor:'pointer', color:'#999', padding:0}}
                            title="Cancel Interview"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                        {interview.type}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <ScheduleInterviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialValues={modalInitialValues}
      />
    </div>
  );
}
