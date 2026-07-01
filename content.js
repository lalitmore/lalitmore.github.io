/* Updated 2026-06-04. Edit freely — re-running sync_resume.py will reformat this block. */
window.SITE_CONTENT = {
  "name": "Lalit More",
  "initials": "LM",
  "setNumber": "2027",
  "eyebrow": "CS + Data Science · Class of 2027",
  "role": "AI Engineer",
  "tagline": "building intelligent systems — from multi-agent pipelines to full-stack data platforms.",
  "status": "Open to Work",
  "resumeUrl": "resume.pdf",
  "email": "lalit.anil.more@email.com",
  "socials": {
    "github": "https://github.com/lalitmore",
    "linkedin": "https://www.linkedin.com/in/lalitmore/"
  },
  "stats": [
    { "val": "06", "lab": "Projects" },
    { "val": "3.73", "lab": "GPA" },
    { "val": "4", "lab": "Languages" },
    { "val": "\u221e", "lab": "Coffee" }
  ],
  "about": {
    "paragraphs": [
      "I'm a senior studying **Computer Science & Data Science**, equally at home shipping production backends and training models that actually move a metric. My sweet spot is the messy middle — getting data into a system, making the system fast, making the output trustworthy.",
      "Recently deep in **distributed systems**, **applied ML**, and the infrastructure connecting them. I care about clean abstractions, reproducible experiments, and shipping things people use.",
      "Outside class I maintain open-source tooling, compete in CTFs and Kaggle, and over-engineer my home lab. Always looking for the next hard problem."
    ],
    "specs": [
      { "key": "LOCATION",   "val": "Pittsburgh, PA" },
      { "key": "STATUS",     "val": "Open to Work", "highlight": true },
      { "key": "FOCUS",      "val": "SWE · ML / Data" },
      { "key": "LANGUAGES",  "val": "Py · Go · TS · Rust" },
      { "key": "GPA",        "val": "3.73 / 4.00" },
      { "key": "GRADUATION", "val": "April 2027" }
    ]
  },
  "skills": [
    {
      "label": "Languages", "color": "red",
      "items": ["Java", "Python", "C", "C#", "SQL", "JavaScript", "HTML", "CSS"]
    },
    {
      "label": "Web / Frontend", "color": "blue",
      "items": ["React", "Next.js", "Node.js", "FastAPI", "Flask", "JUnit"]
    },
    {
      "label": "Infra", "color": "purple",
      "items": ["Git", "Docker", "dbt", "BigQuery", "Google Cloud Platform", "Google Cloud Run", "TravisCI", "VS Code", "IntelliJ"]
    },
    {
      "label": "Libraries", "color": "gold",
      "items": ["Pandas", "NumPy", "Matplotlib", "Plotly", "PyTorch"]
    }
  ],
  "projects": [
    {
      "setNum": "SET #001",
      "category": "ds",
      "badge": "AI / ML",
      "color": "blue",
      "title": "Atlas AI \u2014 Multi-Agent Travel Planner",
      "desc": "Built and deployed a live multi-agent travel planner that turns one plain-English prompt into a grounded, route-optimized day-by-day itinerary in 40\u201360 seconds. Orchestrates 4 specialized Gemini 2.5 agents on Google ADK. Cut routing errors to near-zero by offloading trip sequencing from the LLM to a deterministic pure-Python 2-opt TSP solver. Eliminated hallucinated recommendations via typed Pydantic schemas, live Google Maps deep-links, Flash/Flash-Lite model tiering, and per-IP rate limiting.",
      "metrics": [
        { "val": "40-60s", "lab": "End-to-end" },
        { "val": "4", "lab": "Agents" },
        { "val": "~$0", "lab": "Cost at rest" }
      ],
      "tags": ["Python", "Google ADK", "Gemini 2.5", "FastAPI", "Docker", "Google Cloud Run", "Next.js", "Vercel"],
      "links": [
        { "label": "View Code", "url": "https://github.com/lalitmore/Atlas-AI", "primary": true }
      ]
    },
    {
      "setNum": "SET #002",
      "category": "ds",
      "badge": "AI / ML",
      "color": "red",
      "title": "AI Competitive Intelligence Agent",
      "desc": "Delivered real-time competitive intelligence on any public company in under 30 seconds by implementing an agentic LLM loop using the Anthropic Claude API with integrated web search tooling. Achieved zero infrastructure cost at rest by deploying a Dockerized FastAPI app to Google Cloud Run with auto-scale-to-zero.",
      "metrics": [
        { "val": "<30s", "lab": "Response time" },
        { "val": "$0", "lab": "Cost at rest" }
      ],
      "tags": ["Python", "FastAPI", "Docker", "Google Cloud Run", "Anthropic Claude API", "React"],
      "links": [
        { "label": "View Code", "url": "https://github.com/lalitmore/ai-research-agent", "primary": true }
      ]
    },
    {
      "setNum": "SET #003",
      "category": "ds",
      "badge": "ML / DATA",
      "color": "orange",
      "title": "VO2",
      "desc": "Engineered a full-stack platform to ingest and analyze longitudinal WHOOP, Oura, and Garmin biometric data. Designed statistically rigorous self-experiments using time-series analysis, hypothesis testing, and RAG grounded in PubMed literature. Awarded Best AI for Decision Support at Carnegie Mellon University's TartanHacks.",
      "metrics": [
        { "val": "\ud83c\udfc6", "lab": "TartanHacks" }
      ],
      "tags": ["Next.js", "FastAPI", "Plotly"],
      "links": []
    },
    {
      "setNum": "SET #004",
      "category": "ds",
      "badge": "ML / DATA",
      "color": "green",
      "title": "Smart Attendance System",
      "desc": "Built a real-time face recognition and attendance system using Python and OpenCV for image processing. Automated attendance logging by storing records in CSV files for structured data management.",
      "metrics": [],
      "tags": ["OpenCV", "Python"],
      "links": []
    },
    {
      "setNum": "SET #005",
      "category": "swe",
      "badge": "SWE",
      "color": "purple",
      "title": "Lost in Time",
      "desc": "Developed a 2D platformer game in Unity using C#, offering an experience that promotes social interaction. Integrated Unity's 2D Physics Engine for gravity, collisions, and platform interactions, improving realism.",
      "metrics": [],
      "tags": ["Unity", "C#"],
      "links": []
    },
    {
      "setNum": "SET #006",
      "category": "swe",
      "badge": "SWE",
      "color": "gold",
      "title": "Certifications",
      "desc": "Google Cloud Certified \u2014 Associate Cloud Engineer, July 2025.",
      "metrics": [],
      "tags": ["Google Cloud"],
      "links": [
        { "label": "View Certificate", "url": "https://www.credly.com/badges/b8e4725a-4dbc-4379-96e2-e7526caeb86e/linked_in_profile", "primary": true }
      ]
    }
  ]
};