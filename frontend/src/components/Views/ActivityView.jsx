import React, { useMemo } from 'react';
import { UserPlus, Calendar, Globe, Clock, History } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './ActivityView.module.css';
import commonStyles from './Views.module.css';

export default function ActivityView() {
  const { activities, activitiesLoading } = useAppContext();

  const groupedActivities = useMemo(() => {
    if (!activities) return {};
    const groups = {};
    activities.forEach(activity => {
      const dateObj = new Date(activity.timestamp);
      const date = dateObj.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      
      const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      let groupName = date;
      if (date === today) groupName = 'Today';
      else if (date === yesterday) groupName = 'Yesterday';

      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(activity);
    });
    return groups;
  }, [activities]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'job': return <Globe size={18} className={styles.iconJob} />;
      case 'candidate': return <UserPlus size={18} className={styles.iconCandidate} />;
      case 'calendar': return <Calendar size={18} className={styles.iconCalendar} />;
      default: return <History size={18} />;
    }
  };

  const formatTime = (ts) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (activitiesLoading) {
    return <div className={commonStyles.viewContainer}><div className={styles.loading}>Loading activity feed...</div></div>;
  }

  return (
    <div className={commonStyles.viewContainer}>
      <div className={commonStyles.cardHeader}>
        <h2>Activity Feed</h2>
        <div className={styles.headerAction}>
          <Clock size={16} /> History
        </div>
      </div>

      <div className={styles.feedWrapper}>
        {Object.entries(groupedActivities).length > 0 ? (
          Object.entries(groupedActivities).map(([date, items]) => (
            <div key={date} className={styles.dateGroup}>
              <h4 className={styles.dateTitle}>{date}</h4>
              <div className={styles.groupItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.activityItem}>
                    <div className={styles.iconWrapper}>
                      {getActivityIcon(item.type)}
                    </div>
                    <div className={styles.itemContent}>
                      <div className={styles.mainText}>
                        <span className={styles.userName}>{item.user}</span>{' '}
                        {item.action}{' '}
                        <span className={styles.targetName}>{item.target}</span>
                      </div>
                      {item.detail && <div className={styles.detailText}>{item.detail}</div>}
                      <div className={styles.timeText}>{formatTime(item.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <History size={48} />
            <p>No activity recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
