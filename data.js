const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    fullName: "Abhishek Hingmire",
    firstName: "Abhishek",
    lastName: "Hingmire",
    eyebrow: "Mumbai, India — Available Immediately",
    roles: [
      "Data Analyst",
      "BFSI & Fintech Analytics",
      "Python & SQL Specialist",
      "Business Intelligence",
      "MIS & Dashboard Developer"
    ],
    photo: "profile.jpg",
    photoBadge: "Available for Hire",
    resumeUrl: "Abhishek_Hingmire_Resume.pdf",
    resumeButtonText: "Download Resume",
    ctaText: "Get In Touch ↗",
    secondaryCtaText: "Explore Projects ↓",
    heroMeta: [
      { title: "3+ Years Exp", subtitle: "BFSI & Financial Data Operations" },
      { title: "SG Analytics", subtitle: "Associate Analyst (BFSI/Fintech)" },
      { title: "Python & Power BI", subtitle: "Automated Reporting & ETL Pipelines" }
    ],
    aboutText: [
      "Data Analyst with <strong>3+ years of experience</strong> in BFSI, Fintech & Exchange data analytics, business intelligence reporting, and MIS reporting across <strong>SG Analytics</strong> and <strong>Webshield Solutions</strong>.",
      "Proficient in <strong>Python, SQL, and Advanced Excel</strong>, with hands-on experience in data validation, reconciliation, and statistical analysis to support business decision-making. Skilled in building interactive dashboards, monitoring KPI performance, and delivering actionable business insights for cross-functional stakeholders.",
      "Strong exposure to Machine Learning techniques including <strong>Regression, Decision Trees, and NLP</strong> for exploratory and predictive data analysis. Passionate about automating repetitive data workflows and converting raw data into strategic intelligence."
    ],
    stats: [
      { num: "3+", label: "Years Experience in BFSI & Data Analytics" },
      { num: "100%", label: "Data Accuracy & Reconciliation Standards" },
      { num: "03+", label: "Enterprise Analytics & ETL Systems Shipped" }
    ],
    contact: {
      email: "abhishekhingmire2171@gmail.com",
      emailLabel: "abhishekhingmire2171@gmail.com",
      phone: "+91-8623921350",
      phoneDisplay: "+91 86239 21350",
      phoneLabel: "+91 86239 21350",
      location: "Mumbai, India",
      linkedin: "https://www.linkedin.com/in/abhishek-hingmire",
      linkedinLabel: "LinkedIn ↗",
      github: "https://github.com/abhishekhingmire",
      githubLabel: "GitHub ↗",
      availability: "Available Immediately"
    }
  },
  marqueeSkills: [
    "Python",
    "SQL (MySQL)",
    "Power BI",
    "DAX Measures",
    "Advanced Excel",
    "Power Query",
    "Tableau",
    "Google Looker Studio",
    "BFSI & Fintech",
    "MIS Reporting",
    "FastAPI & PostgreSQL",
    "Machine Learning",
    "Data Validation",
    "ETL Pipelines"
  ],
  skillCategories: [
    {
      category: "Querying & Programming",
      skills: ["SQL", "MySQL (Joins, Subqueries, Window Functions)", "Python (Pandas, NumPy, Data Cleaning)", "FastAPI"]
    },
    {
      category: "BI & Visualization",
      skills: ["Power BI (DAX, Calculated Columns, Semantic Models)", "Tableau", "Google Looker Studio", "KPI Scorecards", "Data Visualization"]
    },
    {
      category: "Advanced Excel",
      skills: ["Pivot Tables & Charts", "Power Query Transformations", "XLOOKUP / VLOOKUP", "Advanced Formulas", "Conditional Formatting"]
    },
    {
      category: "Data Analytics & ML",
      skills: ["Exploratory Data Analysis (EDA)", "Trend & Variance Analysis", "Statistical Analysis", "Data Validation & Reconciliation", "Regression & Decision Trees", "NLP Exposure"]
    },
    {
      category: "MIS & Operations",
      skills: ["Operational MIS Reports", "KPI Tracking & Scorecards", "Forecasting Support", "MTD / YTD / QTD Reporting", "Workflow Automation", "Root Cause Analysis (RCA)"]
    },
    {
      category: "Domain Expertise",
      skills: ["BFSI Analytics", "Fintech & Exchange Data", "Financial Data Operations", "Banking Domain Reporting"]
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Associate Analyst — BFSI, Fintech & Exchange Team",
      company: "SG Analytics",
      location: "Pune, India",
      tagline: "Client Support & Financial Data Operations",
      date: "Nov 2024 – Present",
      bullets: [
        "Analyzed structured financial and banking datasets using SQL and Python to identify reporting discrepancies, validation gaps, and workflow inconsistencies, improving data accuracy across the BFSI, Fintech & Exchange portfolio.",
        "Executed financial data mapping, validation, and reconciliation across multiple reporting workflows, ensuring data integrity for downstream MIS and client reporting outputs.",
        "Delivered operational MIS reports, KPI summaries, and workflow tracking dashboards that supported stakeholder decision-making across BFSI client engagements.",
        "Applied trend and variance analysis to support forecasting discussions, and collaborated cross-functionally on root cause analysis (RCA) to reduce recurring reporting errors."
      ]
    },
    {
      id: "exp-2",
      role: "Data Analyst — Excel & Power BI",
      company: "Webshield Solutions",
      location: "Pune, India",
      tagline: "Technology & Data Solutions Firm",
      date: "Jul 2023 – Nov 2024",
      bullets: [
        "Analyzed business datasets using SQL, Advanced Excel, and Power BI to uncover trends, reporting gaps, and actionable insights that informed strategic and operational decisions.",
        "Designed and developed interactive Power BI dashboards and KPI scorecards, improving reporting visibility and enabling data-driven decision making for business stakeholders.",
        "Automated recurring reporting and data preparation workflows using Power Query and Excel automation, reducing manual effort and increasing reporting turnaround speed.",
        "Partnered with business teams to translate MIS reporting requirements into structured Power BI and Excel-based reporting solutions."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Synaptiqo — Adaptive Document Intelligence Platform",
      category: "Full Stack & AI Data Pipeline",
      thumbnail: "synaptiqo-thumb.svg",
      screenshots: [
        "synaptiqo-thumb.svg",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Designed an end-to-end ETL pipeline to extract, validate, and classify structured information from unstructured documents using Python and FastAPI with PostgreSQL schema design. Built asynchronous worker pipelines with queue management, retry handling, OCR-based extraction, human-in-the-loop retraining, and vector database embeddings for semantic search.",
      tools: ["Python", "FastAPI", "PostgreSQL", "Docker", "Vector DB", "OCR", "Semantic Search"],
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      linkText: "View Case Study →",
      githubUrl: "https://github.com/abhishekhingmire",
      demoUrl: "https://github.com/abhishekhingmire"
    },
    {
      id: "proj-2",
      title: "Sales & Finance Performance Report — Retail Company",
      category: "Retail Analytics & Financial Modeling",
      thumbnail: "sales-finance-thumb.svg",
      screenshots: [
        "sales-finance-thumb.svg",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Built Excel-based sales and finance reporting dashboards using Pivot Tables and advanced formulas; performed financial data validation, reconciliation, and consistency checks across revenue and cost datasets to improve reporting accuracy.",
      tools: ["Advanced Excel", "Pivot Tables", "Power Query", "Financial Reconciliation", "KPI Dashboards"],
      youtubeUrl: "",
      linkText: "View Case Study →",
      githubUrl: "https://github.com/abhishekhingmire",
      demoUrl: "https://github.com/abhishekhingmire"
    },
    {
      id: "proj-3",
      title: "Business Insights Dashboard — AtliQ Hardware",
      category: "Power BI & Business Intelligence",
      thumbnail: "atliq-hardware-thumb.svg",
      screenshots: [
        "atliq-hardware-thumb.svg",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
      ],
      description: "Developed Power BI dashboards using DAX measures, calculated columns, and Power Query transformations; conducted variance, reconciliation, and trend analysis to generate business insights and improve financial reporting accuracy.",
      tools: ["Power BI", "DAX Measures", "Calculated Columns", "Data Modeling", "Power Query", "Excel"],
      youtubeUrl: "",
      linkText: "View Case Study →",
      githubUrl: "https://github.com/abhishekhingmire",
      demoUrl: "https://github.com/abhishekhingmire"
    }
  ],
  certifications: [
    { name: "Full Stack Data Science Cert.", issuer: "Almabetter", date: "2023 – 2024" },
    { name: "5-Star & Intermediate SQL Cert.", issuer: "HackerRank", date: "Verified" },
    { name: "4-Star Python Badge", issuer: "HackerRank", date: "Verified" },
    { name: "Data Analyst Badge", issuer: "Psyliq", date: "Verified" }
  ],
  education: [
    {
      degree: "Full Stack Data Science Certification",
      institution: "Almabetter",
      period: "2023 – 2024",
      details: "Hands-on certification in Python, SQL, Machine Learning, Statistical Analysis, ETL pipelines and Data Visualization."
    },
    {
      degree: "Bachelor of Commerce (B.Com)",
      institution: "University of Mumbai",
      period: "Graduated Jun 2023",
      details: "Comprehensive coursework in Financial Accounting, Business Statistics, Economics, and Commercial Operations."
    }
  ],
  sectionHeadings: {
    about: { text: "About Me", size: "2.5rem" },
    skills: { text: "Skills & Core Stack", size: "2.5rem" },
    experience: { text: "Experience", size: "2.5rem" },
    projects: { text: "Selected Work & Projects", size: "2.5rem" },
    credentials: { text: "Education & Credentials", size: "2.5rem" },
    contact: { text: "Contact", size: "2.5rem" },
    contactHeadline: { text: "Let's turn complex data into <em>actionable insights.</em>", size: "3.2rem" }
  },
  customization: {
    accentColor: "#c9a664",
    accentTeal: "#4fd1c5",
    adminPin: "2171"
  }
};
