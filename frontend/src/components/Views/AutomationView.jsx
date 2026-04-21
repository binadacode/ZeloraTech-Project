import React, { useState } from 'react';
import styles from './Views.module.css';
import { Trash2, Mail, Bell, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import CreateRuleModal from '../Modals/CreateRuleModal';

export default function AutomationView() {
  const { automationRules, toggleAutomationRule, deleteAutomationRule } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.cardHeader}>
        <h2>Workflow Rule Automation</h2>
        <button 
          className={styles.primaryBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} /> New Rule
        </button>
      </div>

      <div className={styles.rulesList}>
        {automationRules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No automation rules defined yet.
          </div>
        ) : (
          automationRules.map((rule) => (
            <div key={rule.id} className={styles.ruleCard}>
              <div className={styles.ruleIcon}>
                {rule.action === 'email' ? <Mail size={20} color="var(--color-primary)" /> : <Bell size={20} color="var(--color-warning)" />}
              </div>
              <div className={styles.ruleInfo}>
                <h4>{rule.description}</h4>
                <p>Trigger: Candidate reaches <strong>{rule.triggerStage}</strong></p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div 
                  className={`${styles.toggleSwitch} ${rule.active ? styles.active : ''}`}
                  onClick={() => toggleAutomationRule(rule.id)}
                >
                  <div className={styles.toggleKnob}></div>
                </div>
                <button 
                  className={styles.iconBtnDanger} 
                  onClick={() => deleteAutomationRule(rule.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateRuleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
