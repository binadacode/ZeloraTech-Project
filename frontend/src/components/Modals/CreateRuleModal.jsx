import React, { useState } from 'react';
import { X, Mail, Bell, MessageSquare } from 'lucide-react';
import styles from './CreateRuleModal.module.css'; 
import { useAppContext } from '../../context/AppContext';

export default function CreateRuleModal({ isOpen, onClose, defaultStage }) {
  const { addAutomationRule, stages } = useAppContext();
  const [ruleData, setRuleData] = useState({
    description: '',
    triggerStage: defaultStage || stages[0] || 'Applying Period',
    action: 'email'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addAutomationRule(ruleData);
    onClose();
    setRuleData({ description: '', triggerStage: stages[0], action: 'email' });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Create Automation Rule</h2>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>
            <div className={styles.formGroup}>
              <label>Rule Description</label>
              <input 
                className={styles.input}
                placeholder="e.g. Send welcome email"
                value={ruleData.description}
                onChange={e => setRuleData({...ruleData, description: e.target.value})}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>When candidate reaches stage:</label>
              <select 
                className={styles.select}
                value={ruleData.triggerStage}
                onChange={e => setRuleData({...ruleData, triggerStage: e.target.value})}
              >
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Perform Action:</label>
              <div className={styles.actionGrid}>
                <button 
                  type="button"
                  onClick={() => setRuleData({...ruleData, action: 'email'})}
                  className={`${styles.actionBtn} ${ruleData.action === 'email' ? styles.actionBtnActive : ''}`}
                >
                  <Mail size={16} /> Email
                </button>
                <button 
                  type="button"
                  onClick={() => setRuleData({...ruleData, action: 'notify'})}
                  className={`${styles.actionBtn} ${ruleData.action === 'notify' ? styles.actionBtnActive : ''}`}
                >
                  <Bell size={16} /> Notify
                </button>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Create Rule</button>
          </div>
        </form>
      </div>
    </div>
  );
}
