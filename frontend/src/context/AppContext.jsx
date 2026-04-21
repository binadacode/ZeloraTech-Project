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

  const [interviews, setInterviews] = useState([]);
  const [interviewsLoading, setInterviewsLoading] = useState(true);

  const [scoreCard, setScoreCard] = useState([]);
  const [scoreCardLoading, setScoreCardLoading] = useState(true);

  const [formConfig, setFormConfig] = useState([]);
  const [formConfigLoading, setFormConfigLoading] = useState(true);

  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

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

  const fetchInterviews = async () => {
    setInterviewsLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/interviews');
      setInterviews(res.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setInterviewsLoading(false);
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/activities');
      setActivities(res.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const scheduleInterview = async (interviewData) => {
    try {
      const res = await axios.post('http://localhost:5005/api/interviews', interviewData);
      setInterviews(prev => [...prev, res.data]);
      addNotification(`Interview scheduled with ${interviewData.candidateName}`, 'calendar');
      fetchActivities(); // Refresh feed
      return res.data;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  };

  const cancelInterview = async (interviewId) => {
    try {
      await axios.delete(`http://localhost:5005/api/interviews/${interviewId}`);
      setInterviews(prev => prev.filter(i => i.id !== interviewId));
      addNotification(`Interview cancelled`, 'info');
    } catch (error) {
      console.error('Error cancelling interview:', error);
      throw error;
    }
  };

  const fetchScoreCard = async (jobId) => {
    setScoreCardLoading(true);
    try {
      const res = await axios.get(`http://localhost:5005/api/jobs/${jobId}/scorecard`);
      setScoreCard(res.data);
    } catch (error) {
      console.error('Error fetching scorecard:', error);
    } finally {
      setScoreCardLoading(false);
    }
  };

  const updateScoreCard = async (jobId, newTemplate) => {
    try {
      const res = await axios.put(`http://localhost:5005/api/jobs/${jobId}/scorecard`, newTemplate);
      setScoreCard(res.data);
      addNotification("Score card template updated", "success");
      return res.data;
    } catch (error) {
      console.error('Error updating scorecard:', error);
      addNotification("Failed to update score card", "error");
      throw error;
    }
  };

  const fetchFormConfig = async (jobId) => {
    setFormConfigLoading(true);
    try {
      const res = await axios.get(`http://localhost:5005/api/jobs/${jobId}/form`);
      setFormConfig(res.data);
    } catch (error) {
      console.error('Error fetching form config:', error);
    } finally {
      setFormConfigLoading(false);
    }
  };

  const updateFormConfig = async (jobId, newConfig) => {
    try {
      const res = await axios.put(`http://localhost:5005/api/jobs/${jobId}/form`, newConfig);
      setFormConfig(res.data);
      addNotification("Application form custom fields updated", "success");
      return res.data;
    } catch (error) {
      console.error('Error updating form config:', error);
      addNotification("Failed to update form layout", "error");
      throw error;
    }
  };

  const addAutomationRule = (rule) => {
    setAutomationRules(prev => [...prev, { ...rule, id: Date.now() }]);
    addNotification("New automation rule created", "success");
  };

  const toggleAutomationRule = (id) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    const rule = automationRules.find(r => r.id === id);
    if (rule) addNotification(`${rule.description} ${!rule.active ? 'enabled' : 'disabled'}`, 'info');
  };

  const deleteAutomationRule = (id) => {
    setAutomationRules(prev => prev.filter(r => r.id !== id));
    addNotification("Automation rule deleted", "info");
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
      fetchActivities(); // Refresh feed
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
      fetchActivities(); // Refresh feed
      // Optionally trigger success toast here
    } catch (error) {
      console.error('Error updating candidate:', error);
      // Revert local state
      setCandidates(previousCandidates);
      // Trigger error toast here
    }
  };

  useEffect(() => {
    // Initial data fetch
    fetchContextData();
    fetchCandidates();
    fetchJobs();
    fetchInterviews();
    fetchSettings();
    fetchActivities();
  }, []);

  useEffect(() => {
    // Fetch job-specific data when job changes
    if (currentJob?.id) {
      fetchScoreCard(currentJob.id);
      fetchFormConfig(currentJob.id);
    }
  }, [currentJob?.id]);

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
      interviews, setInterviews, fetchInterviews, interviewsLoading, scheduleInterview, cancelInterview,
      siteSettings, fetchSettings, updateSettings, settingsLoading,
      notifications, markAllNotificationsRead, addNotification,
      loading,
      globalSearch, setGlobalSearch,
      viewMode, setViewMode,
      selectedCandidate, setSelectedCandidate,
      currentJob, setCurrentJob,
      metrics, setMetrics,
      stages, setStages,
      automationRules, 
      members, setMembers,
      scoreCard, scoreCardLoading, updateScoreCard,
      formConfig, formConfigLoading, updateFormConfig,
      addAutomationRule, toggleAutomationRule, deleteAutomationRule,
      activities, activitiesLoading, fetchActivities
    }}>

      {children}
    </AppContext.Provider>
  );
}
