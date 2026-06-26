export const questionBank = {
  "Software Engineer": [
    {
      category: "Technical",
      prompt: "Walk me through a recent project from your resume. What problem did it solve, and what tradeoffs did you make?",
      expectedTopics: ["problem framing", "technical decisions", "impact"],
    },
    {
      category: "Technical",
      prompt: "How would you design a scalable API for a feature that may receive sudden traffic spikes?",
      expectedTopics: ["rate limiting", "caching", "queues", "observability"],
    },
    {
      category: "Behavioral",
      prompt: "Tell me about a time you received difficult feedback and how you used it.",
      expectedTopics: ["ownership", "learning", "measurable improvement"],
    },
    {
      category: "Role Fit",
      prompt: "Which requirement from this job description matches your strongest experience, and why?",
      expectedTopics: ["role alignment", "evidence", "confidence"],
    },
  ],
  "Frontend Developer": [
    {
      category: "Technical",
      prompt: "How do you keep a React application maintainable as it grows?",
      expectedTopics: ["component boundaries", "state management", "testing"],
    },
    {
      category: "Technical",
      prompt: "Explain how you would improve the performance of a slow dashboard page.",
      expectedTopics: ["profiling", "memoization", "network requests", "code splitting"],
    },
    {
      category: "Behavioral",
      prompt: "Describe a time you had to balance design quality with delivery speed.",
      expectedTopics: ["prioritization", "communication", "iteration"],
    },
    {
      category: "Role Fit",
      prompt: "What parts of this role connect most directly to your resume?",
      expectedTopics: ["skills", "projects", "job requirements"],
    },
  ],
  "Data Analyst": [
    {
      category: "Technical",
      prompt: "How would you investigate a sudden drop in a key business metric?",
      expectedTopics: ["segmentation", "hypothesis", "data quality", "experimentation"],
    },
    {
      category: "Technical",
      prompt: "Tell me about a dashboard or report you built and how stakeholders used it.",
      expectedTopics: ["metrics", "visualization", "business impact"],
    },
    {
      category: "Behavioral",
      prompt: "Describe a time your analysis changed a team's decision.",
      expectedTopics: ["insight", "influence", "outcome"],
    },
    {
      category: "Role Fit",
      prompt: "Which tools from this job description have you used most confidently?",
      expectedTopics: ["tools", "experience depth", "examples"],
    },
  ],
};

export const fallbackQuestions = questionBank["Software Engineer"];

