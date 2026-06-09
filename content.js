/* Auto-updated by sync_resume.py on 2026-06-04 16:35. Edit freely — re-running the script will reformat this block. */
window.SITE_CONTENT = {
  "name": "Lalit More",
  "initials": "LM",
  "setNumber": "2027",
  "eyebrow": "CS + Data Science · Class of 2027",
  "role": "AI Engineer",
  "tagline": "",
  "status": "Open to Work",
  "resumeUrl": "resume.pdf",
  "email": "lalit.anil.more@email.com",
  "socials": {
    "github": "https://github.com/lalitmore",
    "linkedin": "https://www.linkedin.com/in/lalitmore/"
  },
  "stats": [
    {
      "val": "06",
      "lab": "Projects"
    },
    {
      "val": "3.73",
      "lab": "GPA"
    },
    {
      "val": "4",
      "lab": "Languages"
    },
    {
      "val": "∞",
      "lab": "Coffee"
    }
  ],
  "about": {
    "paragraphs": [
      "I'm a senior studying **Computer Science & Data Science**, equally at home shipping production backends and training models that actually move a metric. My sweet spot is the messy middle — getting data into a system, making the system fast, making the output trustworthy.",
      "Recently deep in **distributed systems**, **applied ML**, and the infrastructure connecting them. I care about clean abstractions, reproducible experiments, and shipping things people use.",
      "Outside class I maintain open-source tooling, compete in CTFs and Kaggle, and over-engineer my home lab. Always looking for the next hard problem."
    ],
    "specs": [
      {
        "key": "LOCATION",
        "val": "Pittsburgh, PA"
      },
      {
        "key": "STATUS",
        "val": "Open to Work",
        "highlight": true
      },
      {
        "key": "FOCUS",
        "val": "SWE · ML / Data"
      },
      {
        "key": "LANGUAGES",
        "val": "Py · Go · TS · Rust"
      },
      {
        "key": "GPA",
        "val": "3.73 / 4.00"
      },
      {
        "key": "GRADUATION",
        "val": "April 2027"
      }
    ]
  },
  "skills": [
    {
      "label": "Languages",
      "color": "red",
      "items": [
        "Java",
        "Python",
        "C",
        "C#",
        "SQL",
        "JavaScript",
        "HTML",
        "CSS"
      ]
    },
    {
      "label": "Web / Frontend",
      "color": "blue",
      "items": [
        "React",
        "Next.js",
        "Node.js",
        "FastAPI",
        "Flask",
        "JUnit"
      ]
    },
    {
      "label": "Infra",
      "color": "purple",
      "items": [
        "Git",
        "Docker",
        "dbt",
        "BigQuery",
        "Google Cloud Platform",
        "Google Cloud Run",
        "TravisCI",
        "VS Code",
        "IntelliJ"
      ]
    },
    {
      "label": "Libraries",
      "color": "gold",
      "items": [
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Plotly",
        "PyTorch"
      ]
    }
  ],
  "projects": [
    {
      "setNum": "SET #001",
      "category": "ai",
      "badge": "AI / ML",
      "color": "blue",
      "title": "AI Competitive Intelligence Agent",
      "desc": `
      •  Delivered real-time competitive intelligence on any public company in under 30 seconds (end-to-end API response time) by implementing an agentic LLM loop using the Anthropic Claude API with integrated web search tooling. \n
      • Achieved zero infrastructure cost at rest by deploying a Dockerized FastAPI application to Google Cloud Run, which auto-scales to zero between requests; managed credentials with Secret Manager and persistence with Google Cloud Storage. `,
      "metrics": [
      //   {
        //   "val": "48k",
        //   "lab": "Ops / sec"
        // },
        // {
        //   "val": "5",
        //   "lab": "Node cluster"
        // },
        {
          "val": "99.9%",
          "lab": "Uptime"
        }
      ],
      "tags": [
        "Python",
        "FastAPI",
        "Docker",
        "Google Cloud Run",
        "BigQuery",
        "Anthropic Claude API",
        "React"
      ],
      "links": [
        {
          "label": "View Code",
          "url": "https://github.com/lalitmore/ai-research-agent",
          "primary": true
        }
      //   {
      //     "label": "Live Demo ↗",
      //     "url": "#"
      //   }
      ]
    },
    {
      "setNum": "SET #002",
      "category": "ai",
      "badge": "ML / DATA",
      "color": "red",
      "title": "VO2",
      "desc": `
      • Engineered a full- stack platform(Next.js, FastAPI, Plotly) to ingest and analyze longitudinal WHOOP, Oura, and Garmin biometric data.\n
      • Designed statistically rigorous self - experiments using time - series analysis, hypothesis testing, and retrieval - augmented generation(RAG) grounded in PubMed literature.\n
      • Awarded Best AI for Decision Support at Carnegie Mellon University’s TartanHacks for impact - driven health analytics.`,
      // "metrics": [
      //   {
      //     "val": "48k",
      //     "lab": "Ops / sec"
      //   },
      //   {
      //     "val": "5",
      //     "lab": "Node cluster"
      //   },
      //   {
      //     "val": "99.9%",
      //     "lab": "Uptime"
      //   }
      // ],
      "tags": [
        "Next.js",
        "FastAPI",
        "Plotly"
      ],
      // "links": [
      //   {
      //     "label": "View Code",
      //     "url": "#",
      //     "primary": true
      //   },
      //   {
      //     "label": "Live Demo ↗",
      //     "url": "#"
      //   }
      // ]
    },

    {
      "setNum": "SET #003",
      "category": "ai",
      "badge": "ML / DATA",
      "color": "red",
      "title": "Smart Attendance System",
      "desc": "Built a real-time face recognition and attendance system using Python and OpenCV for image processing. Automated attendance logging by storing records in CSV files for structured data management.",
      "tags": [
        "OpenCV",
        "Python"
      ]
      // "links": [
      //   {
      //     "label": "View Code",
      //     "url": "#",
      //     "primary": true
      //   },
      //   {
      //     "label": "Live Demo ↗",
      //     "url": "#"
      //   }
      // ]
    },

    {
      "setNum": "SET #004",
      "category": "swe",
      "badge": "SWE",
      "color": "orange",
      "title": "Lost in Time",
      "desc": "Developed a 2D platformer game in Unity using C#, offering an experience that promotes social interaction. Integrated Unity’s 2D Physics Engine for gravity, collisions, and platform interactions, improving realism. Implemented character...",
      // "metrics": [
      //   {
      //     "val": "0.87",
      //     "lab": "Mean IoU"
      //   },
      //   {
      //     "val": "14k",
      //     "lab": "Image tiles"
      //   },
      //   {
      //     "val": "4",
      //     "lab": "Spectral bands"
      //   }
      // ],
      "tags": [
        "Unity",
        "C#"
      ]
      // "links": [
      //   {
      //     "label": "View Code",
      //     "url": "#",
      //     "primary": true
      //   },
      //   {
      //     "label": "Live Demo ↗",
      //     "url": "#"
      //   }
      // ]
    },

    {
      "setNum": "SET #005",
      "category": "swe",
      "badge": "SWE",
      "color": "purple",
      "title": "Certifications",
      "desc": "Google Cloud Certified — Associate Cloud Engineer July 2025",
      "metrics": [
        {
          "val": "0.91",
          "lab": "ROC-AUC"
        },
        {
          "val": "120k",
          "lab": "Rows"
        },
        {
          "val": "8",
          "lab": "Features"
        }
      ],
      "tags": [
        "Certifications"
      ],
      "links": [
        {
          "label": "View Certificate",
          "url": "https://www.credly.com/badges/b8e4725a-4dbc-4379-96e2-e7526caeb86e/linked_in_profile",
          "primary": true
        }
        // {
        //   "label": "Live Demo ↗",
        //   "url": "#"
        // }
      ]
    }
  ]
};
