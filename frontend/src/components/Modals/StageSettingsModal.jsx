import React, { useState } from 'react';
import { X, Settings, Trash2, Mail, Bell, Plus, Info, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import styles from './StageSettingsModal.module.css';

export default function StageSettingsModal({ stageName, onClose, onOpenCreateRule }) {
  const { 
    stages, 
    candidates, 
    automationRules, toggleAutomationRule, deleteAutomationRule,
    renameStage, deleteStage, moveStage,
    addNotification 
  } = useAppContext();

  const [localName, setLocalName] = useState(stageName);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Filter rules for this stage
  const stageRules = automationRules.filter(r => r.triggerStage === stageName);
  const stageIndex = stages.indexOf(stageName);

  const handleSaveName = async () => {
    if (!localName.trim()) return;
    if (localName === stageName) {
      onClose();
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await renameStage(stageName, localName);
      if (success) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = async (direction) => {
    setIsSaving(true);
    const success = await moveStage(stageName, direction);
    // After reordering, the stage name remains the same, but its position in 'stages' changes.
    // The modal can stay open.
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsSaving(true);
    const success = await deleteStage(stageName);
    if (success) {
      onClose();
    }
    setIsSaving(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3><Settings size={20} /> Stage Settings: {stageName}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* 1. General Configuration (Rename & Move) */}
          <div className={styles.settingsSection}>
            <h4>General Configuration</h4>
            <div className={styles.formGroup}>
              <label>Stage Name</label>
              <input 
                className={styles.input}
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                placeholder="e.g. Initial Interview"
                disabled={isSaving}
              />
              <p style={{fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <Info size={12} /> Renaming will update {candidates.filter(c => c.stage === stageName).length} active candidates.
              </p>
            </div>

            <label style={{fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px'}}>Board Position</label>
            <div className={styles.reorderActions}>
              <button 
                className={styles.iconBtn} 
                onClick={() => handleMove('left')}
                disabled={stageIndex === 0 || isSaving}
              >
                <ChevronLeft size={16} /> Move Left
              </button>
              <button 
                className={styles.iconBtn} 
                onClick={() => handleMove('right')}
                disabled={stageIndex === stages.length - 1 || isSaving}
              >
                <ChevronRight size={16} /> Move Right
              </button>
            </div>
          </div>

          {/* 2. Automation Rules */}
          <div className={styles.settingsSection}>
            <h4>Automation Rules</h4>
            <div className={styles.rulesList}>
              {stageRules.length > 0 ? (
                stageRules.map(rule => (
                  <div key={rule.id} className={styles.ruleCard}>
                    <div className={styles.ruleInfo}>
                      <div className={styles.ruleDesc}>{rule.description}</div>
                      <div className={styles.ruleAction}>
                        {rule.action === 'email' ? <Mail size={12} /> : <Bell size={12} />}
                        Action: {rule.action}
                      </div>
                    </div>
                    <div className={styles.ruleActions}>
                      <label className={styles.switch}>
                        <input 
                          type="checkbox" 
                          checked={rule.active} 
                          onChange={() => toggleAutomationRule(rule.id)} 
                        />
                        <span className={styles.slider}></span>
                      </label>
                      <button 
                        className={styles.closeBtn}
                        onClick={() => deleteAutomationRule(rule.id)}
                        style={{color: '#ef4444'}}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  No automation rules set for this stage.
                </div>
              )}
              <button className={styles.addBtn} onClick={() => onOpenCreateRule(stageName)}>
                <Plus size={16} /> Add Automation Rule
              </button>
            </div>
          </div>

          {/* 3. Danger Zone (Delete) */}
          <div className={styles.settingsSection}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '12px'}}>
              <AlertTriangle size={16} />
              <h4 style={{margin: 0, color: 'inherit'}}>Danger Zone</h4>
            </div>
            {!showDeleteConfirm ? (
              <button 
                className={styles.deleteBtn} 
                style={{backgroundColor: '#fff', color: '#ef4444', border: '1px solid #ef4444'}}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete this Stage
              </button>
            ) : (
              <div className={styles.dangerZone}>
                <p style={{fontSize: '13px', color: '#7f1d1d', margin: '0 0 12px 0'}}>
                  Are you sure? All {candidates.filter(c => c.stage === stageName).length} candidates will be moved to <strong>{stages[0]}</strong>.
                </p>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button className={styles.deleteBtn} onClick={handleDelete} disabled={isSaving}>
                    {isSaving ? 'Deleting...' : 'Yes, Delete Stage'}
                  </button>
                  <button 
                    className={styles.cancelBtn} 
                    style={{flex: 1}} 
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={isSaving}>Cancel</button>
          <button 
            className={styles.saveBtn} 
            onClick={handleSaveName}
            disabled={isSaving || !localName.trim()}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
