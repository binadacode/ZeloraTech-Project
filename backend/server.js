const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory mock data
let candidates = [
  {
    id: "1",
    name: "Marlon Reynolds",
    stage: "Applying Period",
    applicationDate: "29 Oct, 2023",
    overallScore: 3.5,
    isReferred: true,
    assessmentAdded: false,
    email: "marlon.reynolds@example.com",
    phone: "+1 (555) 123-4567",
    experience: "5 years",
    education: "B.S. Computer Science",
    timeline: [
      { date: "29 Oct, 2023", event: "Applied" }
    ],
    scoreDetails: { "Technical Skills": 4, "Communication": 3, "Culture Fit": 3.5 }
  },
  {
    id: "2",
    name: "Regina Hane",
    stage: "Applying Period",
    applicationDate: "29 Oct, 2023",
    overallScore: 2,
    isReferred: false,
    assessmentAdded: false,
    email: "regina.hane@example.com",
    phone: "+1 (555) 234-5678",
    experience: "2 years",
    education: "B.A. Design",
    timeline: [
      { date: "29 Oct, 2023", event: "Applied" }
    ],
    scoreDetails: { "Technical Skills": 2, "Communication": 2, "Culture Fit": 2 }
  },
  {
    id: "3",
    name: "Curtis Baumbach",
    stage: "Applying Period",
    applicationDate: "29 Oct, 2023",
    overallScore: 3,
    isReferred: true,
    assessmentAdded: false,
    email: "curtis.b@example.com",
    phone: "+1 (555) 345-6789",
    experience: "4 years",
    education: "M.S. Software Engineering",
    timeline: [
      { date: "29 Oct, 2023", event: "Applied" }
    ],
    scoreDetails: { "Technical Skills": 3, "Communication": 3, "Culture Fit": 3 }
  },
  {
    id: "4",
    name: "Jaime Anderson",
    stage: "Applying Period",
    applicationDate: "29 Oct, 2023",
    overallScore: 0,
    isReferred: false,
    assessmentAdded: true,
    email: "jaime.anderson@example.com",
    phone: "+1 (555) 456-7890",
    experience: "1 year",
    education: "Bootcamp Graduate",
    timeline: [
      { date: "29 Oct, 2023", event: "Applied" },
      { date: "30 Oct, 2023", event: "Assessment Sent" }
    ],
    scoreDetails: { "Technical Skills": 0, "Communication": 0, "Culture Fit": 0 }
  },
  {
    id: "5",
    name: "Kristi Sipes",
    stage: "Screening",
    applicationDate: "20 Oct, 2023",
    overallScore: 3.5,
    isReferred: false,
    assessmentAdded: false,
    email: "kristi.sipes@example.com",
    phone: "+1 (555) 567-8901",
    experience: "6 years",
    education: "B.S. Information Technology",
    timeline: [
      { date: "20 Oct, 2023", event: "Applied" },
      { date: "22 Oct, 2023", event: "Moved to Screening" }
    ],
    scoreDetails: { "Technical Skills": 4, "Communication": 3, "Culture Fit": 3.5 }
  },
  {
    id: "6",
    name: "Randy Dibbert",
    stage: "Screening",
    applicationDate: "18 Oct, 2023",
    overallScore: 3.5,
    isReferred: false,
    assessmentAdded: false,
    email: "randy.d@example.com",
    phone: "+1 (555) 678-9012",
    experience: "3 years",
    education: "B.A. Business Administration",
    timeline: [
      { date: "18 Oct, 2023", event: "Applied" },
      { date: "20 Oct, 2023", event: "Moved to Screening" }
    ],
    scoreDetails: { "Technical Skills": 3, "Communication": 4, "Culture Fit": 3.5 }
  },
  {
    id: "7",
    name: "Jane Anderson",
    stage: "Screening",
    applicationDate: "18 Oct, 2023",
    overallScore: 0,
    isReferred: false,
    assessmentAdded: true,
    email: "jane.anderson@example.com",
    phone: "+1 (555) 789-0123",
    experience: "2 years",
    education: "B.S. Computer Science",
    timeline: [
      { date: "18 Oct, 2023", event: "Applied" },
      { date: "19 Oct, 2023", event: "Moved to Screening" },
      { date: "21 Oct, 2023", event: "Assessment Sent" }
    ],
    scoreDetails: { "Technical Skills": 0, "Communication": 0, "Culture Fit": 0 }
  },
  {
    id: "8",
    name: "Shelia Doyle",
    stage: "Screening",
    applicationDate: "13 Oct, 2023",
    overallScore: 4.5,
    isReferred: true,
    assessmentAdded: false,
    email: "shelia.doyle@example.com",
    phone: "+1 (555) 890-1234",
    experience: "8 years",
    education: "M.S. Computer Science",
    timeline: [
      { date: "13 Oct, 2023", event: "Applied" },
      { date: "15 Oct, 2023", event: "Moved to Screening" }
    ],
    scoreDetails: { "Technical Skills": 5, "Communication": 4, "Culture Fit": 4.5 }
  },
  {
    id: "9",
    name: "Cameron Dickens",
    stage: "Interview",
    applicationDate: "03 Sep, 2023",
    overallScore: 4,
    isReferred: false,
    assessmentAdded: false,
    email: "cameron.dickens@example.com",
    phone: "+1 (555) 901-2345",
    experience: "5 years",
    education: "B.S. Software Engineering",
    timeline: [
      { date: "03 Sep, 2023", event: "Applied" },
      { date: "05 Sep, 2023", event: "Moved to Screening" },
      { date: "10 Sep, 2023", event: "Interview Scheduled" }
    ],
    scoreDetails: { "Technical Skills": 4, "Communication": 4, "Culture Fit": 4 }
  },
  {
    id: "10",
    name: "Lola Kirlin",
    stage: "Test",
    applicationDate: "03 Sep, 2023",
    overallScore: 4.5,
    isReferred: true,
    assessmentAdded: false,
    email: "lola.kirlin@example.com",
    phone: "+1 (555) 012-3456",
    experience: "7 years",
    education: "M.S. Artificial Intelligence",
    timeline: [
      { date: "03 Sep, 2023", event: "Applied" },
      { date: "05 Sep, 2023", event: "Moved to Screening" },
      { date: "12 Sep, 2023", event: "Interview Completed" },
      { date: "15 Sep, 2023", event: "Moved to Test" }
    ],
    scoreDetails: { "Technical Skills": 5, "Communication": 4, "Culture Fit": 4.5 }
  }
];

let careerSiteSettings = {
  heroTitle: "Join Our Team",
  heroSubtitle: "We are always looking for talented people to join us.",
  primaryColor: "#2684FF",
  companyBio: "We are an innovative tech company.",
  isPublished: true
};

let jobs = [
  { id: "1", title: "Research and Development Officer", candidateCount: 551, status: "Open", type: "Researcher", location: "Onsite", createdBy: { name: "Bogus Fikri" }, isPublic: true },
  { id: "2", title: "Frontend Engineer", candidateCount: 120, status: "Open", type: "Engineering", location: "Remote", createdBy: { name: "Alice Smith" }, isPublic: true },
  { id: "3", title: "Backend Developer", candidateCount: 85, status: "Open", type: "Engineering", location: "Hybrid", createdBy: { name: "Bob Johnson" }, isPublic: true },
  { id: "4", title: "UI/UX Designer", candidateCount: 230, status: "Closed", type: "Design", location: "Onsite", createdBy: { name: "Charlie Brown" }, isPublic: false },
  { id: "5", title: "Product Manager", candidateCount: 45, status: "Open", type: "Product", location: "Remote", createdBy: { name: "Diana Prince" }, isPublic: false },
  { id: "6", title: "Data Scientist", candidateCount: 300, status: "Open", type: "Data", location: "Onsite", createdBy: { name: "Eve Adams" }, isPublic: true },
  { id: "7", title: "Marketing Specialist", candidateCount: 150, status: "Closed", type: "Marketing", location: "Hybrid", createdBy: { name: "Frank Castle" }, isPublic: false },
  { id: "8", title: "HR Business Partner", candidateCount: 65, status: "Open", type: "HR", location: "Remote", createdBy: { name: "Grace Lee" }, isPublic: true }
];

// Context Mock Data for global state options
const contextData = {
  currentJob: {
    id: "1",
    title: "Research and Development Officer",
    status: "Open",
    department: "Researcher",
    location: "Onsite",
    salaryRange: "$110,000 - $140,000",
    jobType: "Full-Time",
    description: "We are looking for a highly capable Research and Development Officer to join our innovative team. You will be responsible for researching new technologies, prototyping, and integrating robust solutions.",
    requirements: "Minimum 5 years of experience in Software R&D.\nStrong proficiency in React, Node.js, and Cloud Infrastructure.\nExcellent problem-solving skills and critical thinking.",
    createdBy: { name: "Bogus Fikri", avatar: "" }
  },
  metrics: {
    jobsCount: 8,
    candidatesCount: 551,
    automationCount: 5
  }
};



// GET /api/context (Used for header info)
app.get('/api/context', (req, res) => {
  console.log('Sending contextData:', JSON.stringify(contextData.currentJob, null, 2));
  res.json({ ...contextData, metrics: { ...contextData.metrics, jobsCount: jobs.length } });
});

// GET /api/settings
app.get('/api/settings', (req, res) => {
  res.json(careerSiteSettings);
});

// PUT /api/settings
app.put('/api/settings', (req, res) => {
  careerSiteSettings = { ...careerSiteSettings, ...req.body };
  res.json(careerSiteSettings);
});

// GET /api/jobs
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// POST /api/jobs
app.post('/api/jobs', (req, res) => {
  const newJob = {
    id: Date.now().toString(),
    candidateCount: 0,
    status: "Open",
    isPublic: true,
    ...req.body,
    createdBy: req.body.createdBy || { name: "Current User" }
  };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// PUT /api/jobs/:id
app.put('/api/jobs/:id', (req, res) => {
  const index = jobs.findIndex(j => j.id === req.params.id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...req.body };
    res.json(jobs[index]);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// DELETE /api/jobs/:id
app.delete('/api/jobs/:id', (req, res) => {
  jobs = jobs.filter(j => j.id !== req.params.id);
  res.status(204).end();
});

// PUT /api/jobs/:id/publish
app.put('/api/jobs/:id/publish', (req, res) => {
  const index = jobs.findIndex(j => j.id === req.params.id);
  if (index !== -1) {
    jobs[index].isPublic = req.body.isPublic;
    res.json(jobs[index]);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// GET /api/candidates
app.get('/api/candidates', (req, res) => {
  res.json(candidates);
});

// GET /api/candidates/:id
app.get('/api/candidates/:id', (req, res) => {
  const candidate = candidates.find(c => c.id === req.params.id);
  if (candidate) {
    res.json(candidate);
  } else {
    res.status(404).json({ error: "Candidate not found" });
  }
});

// POST /api/candidates
app.post('/api/candidates', (req, res) => {
  const newCandidate = {
    id: Date.now().toString(),
    ...req.body,
    timeline: [{ date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), event: "Applied" }],
    scoreDetails: req.body.scoreDetails || { "Technical Skills": 0, "Communication": 0, "Culture Fit": 0 }
  };
  candidates.push(newCandidate);
  res.status(201).json(newCandidate);
});

// PUT /api/candidates/:id
app.put('/api/candidates/:id', (req, res) => {
  const index = candidates.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    candidates[index] = { ...candidates[index], ...req.body };
    res.json(candidates[index]);
  } else {
    res.status(404).json({ error: "Candidate not found" });
  }
});

// DELETE /api/candidates/:id
app.delete('/api/candidates/:id', (req, res) => {
  candidates = candidates.filter(c => c.id !== req.params.id);
  res.status(204).end();
});

let interviews = [
  { id: "101", candidateId: "9", candidateName: "Cameron Dickens", type: "Technical Interview", dateTime: "2026-04-21T10:00:00", duration: 60 },
  { id: "102", candidateId: "10", candidateName: "Lola Kirlin", type: "Live Coding Test", dateTime: "2026-04-23T14:00:00", duration: 90 }
];

// GET /api/interviews
app.get('/api/interviews', (req, res) => {
  res.json(interviews);
});

// POST /api/interviews
app.post('/api/interviews', (req, res) => {
  const newInterview = {
    id: Date.now().toString(),
    ...req.body
  };
  interviews.push(newInterview);
  res.status(201).json(newInterview);
});

// DELETE /api/interviews/:id
app.delete('/api/interviews/:id', (req, res) => {
  interviews = interviews.filter(i => i.id !== req.params.id);
  res.status(204).end();
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
