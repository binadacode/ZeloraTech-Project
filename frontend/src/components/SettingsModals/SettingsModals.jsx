import React, { useState } from 'react';
import { X, GripVertical, Plus, Trash2, Mail, Users, Archive, ToggleLeft as Toggle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import CreateRuleModal from '../Modals/CreateRuleModal';
import styles from './SettingsModals.module.css';

export function ColumnConfigModal({ onClose }) {
  const { stages, bulkUpdateStages } = useAppContext();
  const [localStages, setLocalStages] = useState([...stages]);

  const handleAdd = () => setLocalStages([...localStages, "New Column"]);
  const handleRemove = (index) => setLocalStages(localStages.filter((_, i) => i !== index));
  const handleChange = (index, val) => {
    const next = [...localStages];
    next[index] = val;
    setLocalStages(next);
  };

  const handleSave = async () => {
    await bulkUpdateStages(localStages);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Column Configuration</h3>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.stageList}>
            {localStages.map((stage, i) => (
              <div key={i} className={styles.stageItem}>
                <GripVertical size={16} className={styles.dragHandle} />
                <input 
                  className={styles.stageInput} 
                  value={stage} 
                  onChange={(e) => handleChange(i, e.target.value)} 
                />
                <button className={styles.removeStageBtn} onClick={() => handleRemove(i)}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <button className={styles.addStageBtn} onClick={handleAdd}><Plus size={16} /> Add Column</button>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export function AutomationRulesModal({ onClose }) {
  const { automationRules, toggleAutomationRule, deleteAutomationRule } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Automated Rules</h3>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          <div style={{marginBottom: '16px', fontSize: '13px', color: '#64748b'}}>
            Define triggers that happen automatically when a candidate is moved.
          </div>
          {automationRules.map(rule => (
            <div key={rule.id} className={styles.ruleCard}>
              <div style={{flex: 1}}>
                <div className={styles.ruleDesc}>{rule.description}</div>
                <div className={styles.ruleMeta}>
                  {rule.action === 'email' ? <Mail size={12} style={{display: 'inline', marginRight: '4px'}} /> : <Bell size={12} style={{display: 'inline', marginRight: '4px'}} />}
                  Trigger: {rule.triggerStage}
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <label className={styles.switch}>
                  <input type="checkbox" checked={rule.active} onChange={() => toggleAutomationRule(rule.id)} />
                  <span className={styles.slider}></span>
                </label>
                <button 
                  onClick={() => deleteAutomationRule(rule.id)}
                  style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex'}}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          <button className={styles.addStageBtn} onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={16} /> Create New Rule
          </button>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.submitBtn} onClick={onClose}>Done</button>
        </div>
      </div>
      {isCreateModalOpen && <CreateRuleModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />}
    </div>
  );
}

export function PermissionsModal({ onClose }) {
  const { members, addNotification } = useAppContext();

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Workflow Permissions</h3>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          <div style={{marginBottom: '16px', fontSize: '13px', color: '#64748b'}}>
            Manage who can view and edit this recruitment board.
          </div>
          {members.map(member => (
            <div key={member.id} className={styles.memberItem}>
              <div className={styles.avatar}>{member.name.split(' ').map(n=>n[0]).join('')}</div>
              <div className={styles.memberName}>{member.name}</div>
              <span className={`${styles.pill} ${styles['pill' + member.role]}`}>{member.role}</span>
            </div>
          ))}
          <button className={styles.addStageBtn} onClick={() => addNotification("Invite functionality coming soon", 'info')}>
            <Plus size={16} /> Invite Member
          </button>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.submitBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

export function ArchiveBoardModal({ onClose }) {
  const { currentJob, updateJob, addNotification } = useAppContext();

  const handleArchive = async () => {
    try {
      await updateJob(currentJob.id, { status: 'Archived' });
      addNotification(`Board "${currentJob.title}" has been archived`, 'success');
      onClose();
    } catch (e) {
      addNotification("Failed to archive board", 'error');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{maxWidth: '400px'}}>
        <div className={styles.modalHeader}>
          <h3>Archive Board?</h3>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.archiveWarning}>
            Warning: Archiving this board will set its status to "Closed" and remove it from active workflows. This action can be undone from Job Settings.
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.submitBtn} style={{background: '#ef4444'}} onClick={handleArchive}>Archive Now</button>
        </div>
      </div>
    </div>
  );
}
