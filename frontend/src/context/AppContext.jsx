/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Remove explicit context export to comply with Vite Fast Refresh
// Instead, expose a custom hook to consume the context
import { useContext } from 'react';
const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}
export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState("Candidates");
  const [activeTopTab, setActiveTopTab] = useState("Candidate");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [viewMode, setViewMode] = useState("Kanban"); // Kanban or List
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Right drawer

  const [stages, setStages] = useState(["Applying Period", "Screening", "Interview", "Test"]);
  const [automationRules, setAutomationRules] = useState([
    { id: 1, triggerStage: 'Interview', action: 'email', description: 'Send email on Interview stage', active: true }
  ]);
  const [members, setMembers] = useState([
    { id: 1, name: "Bogus Fikri", role: "Admin", avatar: "" },
    { id: 2, name: "Alice Smith", role: "Recruiter", avatar: "" },
    { id: 3, name: "Bob Johnson", role: "Coordinator", avatar: "" }
  ]);

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [siteSettings, setSiteSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Context Data
  const [currentJob, setCurrentJob] = useState({
    id: "1",
    title: "Research and Development Officer",
    status: "Open",
    department: "Researcher",
    location: "Onsite",
    createdBy: { name: "Bogus Fikri" }
  });

  const [metrics, setMetrics] = useState({ jobsCount: 8, candidatesCount: 551, automationCount: 5 });

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New candidate 'John Doe' applied for Frontend Engineer", time: "2m ago", unread: true, type: 'applicant' },
    { id: 2, text: "Job 'Backend Developer' has been published", time: "1h ago", unread: true, type: 'status' },
    { id: 3, text: "Meeting scheduled with Sarah Jenkins at 2:00 PM", time: "3h ago", unread: false, type: 'calendar' }
  ]);

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const addNotification = (text, type = 'info') => {
    setNotifications(prev => [
      { id: Date.now(), text, time: "Just now", unread: true, type },
      ...prev
    ]);
  };

  const executeRules = (candidate, newStage) => {
    const activeRule = automationRules.find(r => r.active && r.triggerStage === newStage);
    if (activeRule) {
      if (activeRule.action === 'email') {
        addNotification(`Email sent to ${candidate.name} for ${newStage} stage`, 'info');
      } else {
        addNotification(`Automation triggered: ${activeRule.description}`, 'info');
      }
    }
  };

  const fetchContextData = async () => {
    try {
      const res = await axios.get('http://localhost:5005/api/context');
      setCurrentJob(res.data.currentJob);
      setMetrics(res.data.metrics);
    } catch (error) {
      console.error('Error fetching context:', error);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/candidates');
      setCandidates(res.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/jobs');
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/settings');
      setSiteSettings(res.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      const res = await axios.put('http://localhost:5005/api/settings', newSettings);
      setSiteSettings(res.data);
      return res.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const toggleJobPublish = async (jobId, isPublic) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isPublic } : j));
    try {
      await axios.put(`http://localhost:5005/api/jobs/${jobId}/publish`, { isPublic });
    } catch (error) {
      console.error('Error updating job publish state:', error);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isPublic: !isPublic } : j));
    }
  };

  const selectJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setCurrentJob(job);
      setActiveTopTab("Candidate");
    }
  };

  const createJob = async (jobData) => {
    try {
      const res = await axios.post('http://localhost:5005/api/jobs', jobData);
      setJobs(prev => [...prev, res.data]);
      setMetrics(prev => ({ ...prev, jobsCount: prev.jobsCount + 1 }));
      return res.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  const updateCandidateStage = async (candidateId, newStage) => {
    const previousCandidates = [...candidates];
    const candidate = candidates.find(c => c.id === candidateId);

    // Optimistic Update
    setCandidates(prev => prev.map(c =>
      c.id === candidateId ? { ...c, stage: newStage } : c
    ));

    // Automation Check
    if (candidate) {
      executeRules(candidate, newStage);
    }

    try {
      await axios.put(`http://localhost:5005/api/candidates/${candidateId}`, {
        stage: newStage
      });
      // Optionally trigger success toast here
    } catch (error) {
      console.error('Error updating candidate:', error);
      // Revert local state
      setCandidates(previousCandidates);
      // Trigger error toast here
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContextData();
    fetchCandidates();
    fetchJobs();
    fetchSettings();
  }, []);

  const updateJob = async (jobId, jobData) => {
    const prevJob = { ...currentJob };
    if (currentJob?.id === jobId) {
      setCurrentJob(prev => ({ ...prev, ...jobData }));
    }

    try {
      const res = await axios.put(`http://localhost:5005/api/jobs/${jobId}`, jobData);
      setJobs(prev => prev.map(j => j.id === jobId ? res.data : j));
      return res.data;
    } catch (error) {
      console.error('Error updating job:', error);
      if (currentJob?.id === jobId) {
        setCurrentJob(prevJob);
      }
      throw error;
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5005/api/jobs/${jobId}`);
      if (currentJob?.id === jobId) {
        setCurrentJob(null);
      }
      setJobs(prev => prev.filter(j => j.id !== jobId));
      setMetrics(prev => ({ ...prev, jobsCount: prev.jobsCount - 1 }));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const duplicateJob = async (job) => {
    const duplicatedJob = {
      ...job,
      title: `${job.title} (Copy)`,
      candidateCount: 0,
      createdAt: new Date().toISOString()
    };
    delete duplicatedJob.id; // Server will generate a new ID
    
    try {
      const res = await axios.post('http://localhost:5005/api/jobs', duplicatedJob);
      setJobs(prev => [...prev, res.data]);
      setMetrics(prev => ({ ...prev, jobsCount: prev.jobsCount + 1 }));
      return res.data;
    } catch (error) {
      console.error('Error duplicating job:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      activeTopTab, setActiveTopTab,
      activeTab, setActiveTab,
      candidates, setCandidates, fetchCandidates, updateCandidateStage,
      jobs, setJobs, fetchJobs, jobsLoading, selectJob, createJob, toggleJobPublish, updateJob, deleteJob, duplicateJob,
      siteSettings, fetchSettings, updateSettings, settingsLoading,
      notifications, markAllNotificationsRead, addNotification,
      loading,
      globalSearch, setGlobalSearch,
      viewMode, setViewMode,
      selectedCandidate, setSelectedCandidate,
      currentJob, setCurrentJob,
      metrics, setMetrics,
      stages, setStages,
      automationRules, setAutomationRules,
      members, setMembers
    }}>

      {children}
    </AppContext.Provider>
  );
}
