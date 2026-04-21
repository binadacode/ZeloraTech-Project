import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronLeft, MoreHorizontal, Share, UserPlus, Settings, LayoutGrid, ChevronDown, Plus } from 'lucide-react';
import { ColumnConfigModal, AutomationRulesModal, PermissionsModal, ArchiveBoardModal } from '../SettingsModals/SettingsModals';
import { useAppContext } from '../../context/AppContext';
import KanbanBoard from '../KanbanBoard/KanbanBoard';
import JobInfoView from '../Views/JobInfoView';
import CalendarView from '../Views/CalendarView';
import ScoreCardView from '../Views/ScoreCardView';
import ApplicationFormView from '../Views/ApplicationFormView';
import AutomationView from '../Views/AutomationView';
import JobsView from '../Views/JobsView';
import CareerSiteView from '../Views/CareerSiteView';
import CandidateDrawer from '../CandidateDrawer/CandidateDrawer';
import Subheader from '../Subheader/Subheader';
import styles from './DashboardLayout.module.css';

const TABS = [
  "Candidates", "Job Info", "Calendar", "Score Card", "Activity", "Application Form", "Automation"
];

function EmptyState({ title, message }) {
  return (
    <div className={styles.emptyState}>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default function DashboardLayout() {

  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [scoreRange, setScoreRange] = useState(0); // 0 = all
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isScoreDropdownOpen, setIsScoreDropdownOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [referData, setReferData] = useState({ name: '', email: '', position: '' });
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsModal, setActiveSettingsModal] = useState(null); // 'columns', 'rules', 'permissions', 'archive'



  const { 
    activeTopTab, setActiveTopTab,
    activeTab, setActiveTab, 
    candidates, setCandidates, updateCandidateStage, loading,
    globalSearch, setGlobalSearch,
    viewMode, setViewMode,
    currentJob, metrics,
    selectedCandidate, setSelectedCandidate,
    createJob, selectJob, updateJob, notifications, markAllNotificationsRead,
    fetchCandidates, addNotification
  } = useAppContext();


  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [newJobData, setNewJobData] = useState({ title: '', department: '', location: 'Onsite' });
  const [editJobData, setEditJobData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const searchInputRef = useRef(null);
  const notifRef = useRef(null);
  const dateRef = useRef(null);
  const scoreRef = useRef(null);
  const viewRef = useRef(null);
  const settingsRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDatePickerOpen(false);
      }
      if (scoreRef.current && !scoreRef.current.contains(event.target)) {
        setIsScoreDropdownOpen(false);
      }
      if (viewRef.current && !viewRef.current.contains(event.target)) {
        setIsViewDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateJob(currentJob.id, editJobData);
      setIsEditJobModalOpen(false);
      addNotification(`Job "${editJobData.title}" updated successfully`, 'success');
    } catch (error) {
      console.error("Failed to update job", error);
      addNotification("Failed to update job details", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = () => {
    setEditJobData(currentJob);
    setIsEditJobModalOpen(true);
  };

  const handleCreateJob = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createJob(newJobData);
      setIsCreateModalOpen(false);
      setNewJobData({ title: '', department: '', location: 'Onsite' });
      selectJob(result.id);
    } catch (error) {
      console.error("Failed to create job", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReferSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mock API call or use existing candidate post if available
      // For now, optimistic update
      const newCand = {
        id: Date.now().toString(),
        name: referData.name,
        email: referData.email,
        stage: "Applying Period",
        applicationDate: new Date().toLocaleDateString('en-GB'),
        overallScore: 0,
        timeline: [{ event: "Referred", date: "Today" }],
        scoreDetails: { "Technical Skills": 0, "Communication": 0, "Culture Fit": 0 }
      };
      setCandidates(prev => [...prev, newCand]);
      setIsReferModalOpen(false);
      setReferData({ name: '', email: '', position: '' });
      addNotification(`New referral: ${referData.name}`, 'info');
    } catch (error) {
      console.error("Failed to refer person", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 10);
  };

  const handleSearchBlur = () => {
    if (!globalSearch) {
      setIsSearchExpanded(false);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const closeDrawer = () => setSelectedCandidate(null);

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(globalSearch.toLowerCase());
    const matchesScore = scoreRange === 0 || c.overallScore >= scoreRange;
    
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        // Handle DD/MM/YYYY
        if (dateStr.includes('/')) {
          const [d, m, y] = dateStr.split('/');
          return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        }
        // Handle DD MMM, YYYY (e.g. 03 Sep, 2023)
        return new Date(dateStr);
      };

      const candDate = parseDate(c.applicationDate);
      if (candDate) {
        if (dateRange.start) {
          const startDate = new Date(dateRange.start + 'T00:00:00');
          if (candDate < startDate) matchesDate = false;
        }
        if (dateRange.end) {
          const endDate = new Date(dateRange.end + 'T23:59:59');
          if (candDate > endDate) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesScore && matchesDate;


  });


  const renderListView = () => (
    <div className={styles.listView}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Stage</th>
            <th>Score</th>
            <th>Applied Date</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map(c => (
            <tr key={c.id} onClick={() => setSelectedCandidate(c)}>
              <td><div className={styles.nameCell}><div className={styles.avatarMini}>{c.name[0]}</div> {c.name}</div></td>
              <td><span className={styles.stageTag}>{c.stage}</span></td>
              <td><div className={styles.scoreCell}>{c.overallScore} / 5</div></td>
              <td>{c.applicationDate}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Candidates':
        return (
          <>
            <div className={styles.toolbar}>
              <div className={styles.toolbarLeft}>
                <div className={styles.searchWrapper}>
                  <Search size={16} className={styles.searchIcon} strokeWidth={2.5}/>
                  <input type="text" placeholder="Search Candidates..." className={styles.searchInput} value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />
                </div>
                
                <div className={styles.dropdownContainer} ref={dateRef}>
                  <button className={styles.dropdownBtn} onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
                    Date Range <ChevronDown size={14} />
                  </button>
                  {isDatePickerOpen && (
                    <div className={styles.filterMenu}>
                      <div className={styles.datePickerBody}>
                        <div className={styles.dateInputGroup}>
                          <label>Start Date</label>
                          <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} />
                        </div>
                        <div className={styles.dateInputGroup}>
                          <label>End Date</label>
                          <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} />
                        </div>
                        <button className={styles.applyFilterBtn} onClick={() => setIsDatePickerOpen(false)}>Apply</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.dropdownContainer} ref={scoreRef}>
                  <button className={styles.dropdownBtn} onClick={() => setIsScoreDropdownOpen(!isScoreDropdownOpen)}>
                    Score Range <ChevronDown size={14} />
                  </button>
                  {isScoreDropdownOpen && (
                    <div className={styles.filterMenu}>
                      {[0, 4, 3, 2, 1].map(score => (
                        <div 
                          key={score} 
                          className={`${styles.menuItem} ${scoreRange === score ? styles.menuItemActive : ''}`}
                          onClick={() => { setScoreRange(score); setIsScoreDropdownOpen(false); }}
                        >
                          {score === 0 ? "All Scores" : `${score}+ Stars`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button className={styles.dropdownBtn}>Advance Filter <ChevronDown size={14} /></button>
              </div>
              <div className={styles.toolbarRight}>
                <button className={styles.referBtn} onClick={() => setIsReferModalOpen(true)}><UserPlus size={16} /> Refer People</button>
                
                <div className={styles.dropdownContainer} ref={settingsRef}>
                  <button className={styles.settingsBtn} onClick={() => setIsSettingsOpen(!isSettingsOpen)} title="Settings">
                    <Settings size={20} />
                  </button>
                  {isSettingsOpen && (
                    <div className={styles.filterMenu} style={{right: 0, left: 'auto', width: '220px'}}>
                      <div className={styles.menuHeader}>Board Settings</div>
                      <div className={styles.menuItem} onClick={() => { setActiveSettingsModal('columns'); setIsSettingsOpen(false); }}>Column Configuration</div>
                      <div className={styles.menuItem} onClick={() => { setActiveSettingsModal('rules'); setIsSettingsOpen(false); }}>Automated Rules</div>
                      <div className={styles.menuItem} onClick={() => { setActiveSettingsModal('permissions'); setIsSettingsOpen(false); }}>Workflow Permissions</div>
                      <div className={styles.menuDivider}></div>
                      <div className={styles.menuItem} style={{color: '#ef4444'}} onClick={() => { setActiveSettingsModal('archive'); setIsSettingsOpen(false); }}>Archive Board</div>
                    </div>
                  )}
                </div>

                
                <div className={styles.dropdownContainer} ref={viewRef}>

                  <button className={styles.kanbanToggleBtn} onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}>
                    <LayoutGrid size={16} /> {viewMode} <ChevronDown size={14}/>
                  </button>
                  {isViewDropdownOpen && (
                    <div className={styles.filterMenu} style={{right: 0, left: 'auto'}}>
                      {["Kanban", "List"].map(mode => (
                        <div 
                          key={mode} 
                          className={`${styles.menuItem} ${viewMode === mode ? styles.menuItemActive : ''}`}
                          onClick={() => { setViewMode(mode); setIsViewDropdownOpen(false); }}
                        >
                          {mode} View
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>Loading Candidates...</div>
            ) : viewMode === "Kanban" ? (
              <KanbanBoard 
                candidates={filteredCandidates} 
                setCandidates={setCandidates}
                onStageChange={updateCandidateStage}
                onCandidateClick={setSelectedCandidate}
              />
            ) : (
              renderListView()
            )}
          </>
        );

      case 'Job Info': return <JobInfoView job={currentJob} onEdit={openEditModal} />;

      case 'Calendar': return <CalendarView />;
      case 'Score Card': return <ScoreCardView />;
      case 'Application Form': return <ApplicationFormView />;
      case 'Automation': return <AutomationView />;
      default:
        return <EmptyState title={activeTab} message="This module is under construction." />;
    }
  };

  return (
    <div className={styles.layout}>
      {/* A. Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.logoSquare}></div>
          <span className={styles.brandTitle}>
            tiimi <span style={{color: '#9ca3af', fontWeight: 400}}>Recruitment</span>
          </span>
        </div>
        
        <div className={styles.navCenter}>
          <button 
            className={`${styles.navLink} ${activeTopTab === 'Jobs' ? styles.navLinkActive : ''}`}
            onClick={() => setActiveTopTab('Jobs')}
          >
            Jobs <span className={styles.badgeDark}>{metrics.jobsCount}</span>
          </button>
          <button 
            className={`${styles.navLink} ${activeTopTab === 'Candidate' ? styles.navLinkActive : ''}`}
            onClick={() => setActiveTopTab('Candidate')}
          >
            Candidate <span className={styles.badgeOrange}>{metrics.candidatesCount}</span>
          </button>
          <button 
            className={`${styles.navLink} ${activeTopTab === 'Career Site' ? styles.navLinkActive : ''}`}
            onClick={() => setActiveTopTab('Career Site')}
          >
            Career Site
          </button>
        </div>
        
        <div className={styles.navRight}>
          <button className={styles.addBtn} onClick={() => setIsCreateModalOpen(true)} title="Create New Job">
            <Plus size={18} strokeWidth={2.5} />
          </button>
          
          <div className={`${styles.searchBar} ${isSearchExpanded ? styles.expanded : ''}`} onClick={handleSearchClick}>
            <Search size={20} style={{minWidth: '20px'}}/>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Global Search..." 
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              onBlur={handleSearchBlur}
            />
          </div>

          <div style={{ position: 'relative' }} ref={notifRef}>
            <button className={styles.iconBtn} onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}>
              <Bell size={20} />
              {unreadCount > 0 && <span className={styles.bellDot}></span>}
            </button>

            {isNotificationsOpen && (
              <div className={styles.notifDropdown}>
                <div className={styles.notifHeader}>
                  <h3>Notifications</h3>
                  <button className={styles.markReadBtn} onClick={markAllNotificationsRead}>Mark all as read</button>
                </div>
                <div className={styles.notifList}>
                  {notifications.map(notif => (
                    <div key={notif.id} className={`${styles.notifItem} ${notif.unread ? styles.unread : ''}`}>
                      <div className={styles.notifContent}>
                        <div className={styles.notifText}>{notif.text}</div>
                        <div className={styles.notifTime}>{notif.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.notifFooter}>View all notifications</div>
              </div>
            )}
          </div>

          <button className={styles.avatarBtn} title={currentJob?.createdBy?.name || "User"}>
            {currentJob?.createdBy?.name ? currentJob.createdBy.name.split(' ').map(n=>n[0]).join('') : 'BF'}
          </button>
        </div>
      </nav>

      {/* Global Create Job Modal */}
      {isCreateModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Create New Job</h3>
              <button className={styles.closeBtn} onClick={() => setIsCreateModalOpen(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleCreateJob}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Frontend Engineer"
                    value={newJobData.title}
                    onChange={e => setNewJobData({...newJobData, title: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Department</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Engineering"
                    value={newJobData.department}
                    onChange={e => setNewJobData({...newJobData, department: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <select 
                    value={newJobData.location}
                    onChange={e => setNewJobData({...newJobData, location: e.target.value})}
                  >
                    <option value="Onsite">Onsite</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Global Edit Job Modal */}
      {isEditJobModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{maxWidth: '600px'}}>
            <div className={styles.modalHeader}>
              <h3>Edit Job Details</h3>
              <button className={styles.closeBtn} onClick={() => setIsEditJobModalOpen(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleEditJob}>
              <div className={styles.modalBody} style={{maxHeight: '70vh', overflowY: 'auto'}}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{flex: 1}}>
                    <label>Title</label>
                    <input 
                      type="text" 
                      value={editJobData.title || ''}
                      onChange={e => setEditJobData({...editJobData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup} style={{flex: 1}}>
                    <label>Department</label>
                    <input 
                      type="text" 
                      value={editJobData.department || ''}
                      onChange={e => setEditJobData({...editJobData, department: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{flex: 1}}>
                    <label>Location</label>
                    <input 
                      type="text" 
                      value={editJobData.location || ''}
                      onChange={e => setEditJobData({...editJobData, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup} style={{flex: 1}}>
                    <label>Salary Range</label>
                    <input 
                      type="text" 
                      placeholder="e.g. $100k - $120k"
                      value={editJobData.salaryRange || ''}
                      onChange={e => setEditJobData({...editJobData, salaryRange: e.target.value})}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>About the Role</label>
                  <textarea 
                    rows={4}
                    style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'inherit', fontSize: '14px'}}
                    value={editJobData.description || ''}
                    onChange={e => setEditJobData({...editJobData, description: e.target.value})}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Requirements (one per line)</label>
                  <textarea 
                    rows={4}
                    style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'inherit', fontSize: '14px'}}
                    value={editJobData.requirements || ''}
                    onChange={e => setEditJobData({...editJobData, requirements: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsEditJobModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Global Refer People Modal */}
      {isReferModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Refer Someone</h3>
              <button className={styles.closeBtn} onClick={() => setIsReferModalOpen(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleReferSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    value={referData.name}
                    onChange={e => setReferData({...referData, name: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. john@example.com"
                    value={referData.email}
                    onChange={e => setReferData({...referData, email: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Position</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Backend Engineer"
                    value={referData.position}
                    onChange={e => setReferData({...referData, position: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsReferModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>{isSubmitting ? 'Referring...' : 'Refer Candidate'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className={styles.mainContent}>

        {activeTopTab === 'Candidate' ? (
          <>
            {/* B. Page Header (Subheader Component) */}
            <Subheader />

            {/* C. Main Tab Navigation */}
            <div className={styles.tabsContainer}>
              {TABS.map(tab => (
                <button 
                  key={tab}
                  className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                  {tab === "Automation" && <span className={styles.badgeAutomation}>{metrics.automationCount}</span>}
                </button>
              ))}
            </div>

            {/* D. Main Content based on active tab */}
            {renderTabContent()}
          </>
        ) : activeTopTab === 'Jobs' ? (
          <JobsView />
        ) : activeTopTab === 'Career Site' ? (
          <CareerSiteView />
        ) : (
          <EmptyState 
            title={`${activeTopTab} Dashboard`} 
            message={`The ${activeTopTab} section is currently under development.`} 
          />
        )}
      </main>

      {/* Settings Modals */}
      {activeSettingsModal === 'columns' && <ColumnConfigModal onClose={() => setActiveSettingsModal(null)} />}
      {activeSettingsModal === 'rules' && <AutomationRulesModal onClose={() => setActiveSettingsModal(null)} />}
      {activeSettingsModal === 'permissions' && <PermissionsModal onClose={() => setActiveSettingsModal(null)} />}
      {activeSettingsModal === 'archive' && <ArchiveBoardModal onClose={() => setActiveSettingsModal(null)} />}

      {/* Right Drawer Overlay */}
      {activeTopTab === 'Candidate' && (
        <CandidateDrawer candidate={selectedCandidate} onClose={closeDrawer} />
      )}
    </div>
  );
}

