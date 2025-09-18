import mongoose from "mongoose";
import dotenv from "dotenv";

// Import your Mongoose models
import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { UserFollow } from "../models/userFollow.model.js";

// Import utilities
import {
  generateSlug,
  generateExcerpt,
} from "../utils/genSlugAndExcerpt.utils.js";
import connectDB from "../db/index.js";
import { Category } from "../models/category.model.js";

// --- 1. INITIAL SETUP ---

dotenv.config({
  path: "./.env",
});

if (!process.env.MONGODB_URL) {
  console.error("FATAL ERROR: MONGODB_URL is not defined in the .env file.");
  process.exit(1);
}

// --- 2. SAMPLE DATA ---

const sampleTiptapContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "A Default Blog Post" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "This is some default content used when specific blog content isn't available.",
        },
      ],
    },
  ],
};

const blogContentMap = {
  // --- Rohan Sharma's Tech Blogs ---
  "intro-to-node-js": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "An Introduction to Node.js" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Node.js is not a framework or a library; it's a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript on the server, opening up a whole new world of possibilities beyond the browser.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Why is Node.js So Popular?" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Asynchronous and Event-Driven:",
                  },
                  {
                    type: "text",
                    text: " Node.js uses a non-blocking I/O model, making it incredibly efficient and perfect for building scalable, data-intensive applications like chat apps and streaming services.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Single Programming Language:",
                  },
                  {
                    type: "text",
                    text: " It allows developers to use JavaScript for both the frontend and the backend, streamlining the development process.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "With Node.js, you can build a full-stack application using just one language, which is a massive productivity booster.",
              },
            ],
          },
        ],
      },
    ],
  },
  "mastering-react-hooks": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Mastering React Hooks" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "React Hooks have revolutionized how we write components. They let you use state and other React features without writing a class. In this post, we'll explore the most common Hooks and how to use them effectively.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [
          { type: "text", text: "The Power of useState and useEffect" },
        ],
      },
      {
        type: "codeBlock",
        content: [
          {
            type: "text",
            text: `import React, { useState, useEffect } from 'react';\n\nfunction DataFetcher() {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetch('https://api.example.com/data').then(res => res.json()).then(setData);\n  }, []);\n\n  return <div>{JSON.stringify(data)}</div>;\n}`,
          },
        ],
      },
    ],
  },
  "building-a-rest-api-with-express": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Building a REST API with Express.js" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Express.js remains one of the most popular frameworks for building APIs with Node.js due to its simplicity and flexibility.",
          },
        ],
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Initialize a new Node.js project." },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Install Express." }],
              },
            ],
          },
        ],
      },
    ],
  },
  "understanding-docker": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Understanding Docker in 5 Minutes" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Docker is a platform that uses OS-level virtualization to deliver software in packages called containers. It solves the classic 'it works on my machine' problem by bundling an application's code with all the files and libraries it needs to run.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Key Docker Concepts" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Dockerfile:",
                  },
                  {
                    type: "text",
                    text: " A text file with instructions on how to build a Docker image.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Image:" },
                  {
                    type: "text",
                    text: " A lightweight, standalone, executable package.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  "graphql-vs-rest": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "GraphQL vs. REST: Which is Right for You?" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "GraphQL allows clients to request exactly the data they need, solving the over-fetching and under-fetching problems common in REST APIs.",
          },
        ],
      },
    ],
  },
  "ci-cd-pipelines-explained": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "CI/CD Pipelines Explained" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Continuous Integration and Continuous Delivery (CI/CD) is a set of practices that automate the software release process. It allows development teams to deliver code changes more frequently and reliably.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Stages of a Pipeline" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A typical pipeline includes stages for building the code, running automated tests (unit, integration, etc.), and deploying the application to staging and production environments.",
          },
        ],
      },
    ],
  },
  "javascript-event-loop": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Demystifying the JavaScript Event Loop" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "JavaScript is single-threaded, so how does it handle asynchronous tasks? The answer lies in the event loop, the call stack, and the callback queue.",
          },
        ],
      },
    ],
  },
  "websockets-for-real-time-apps": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "WebSockets for Real-Time Apps" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "HTTP is great, but for truly real-time applications like chat or live dashboards, you need a persistent, two-way communication channel. This is where WebSockets shine.",
          },
        ],
      },
    ],
  },
  "microservices-architecture": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "An Introduction to Microservices Architecture",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Instead of building a single, monolithic application, a microservices architecture structures an application as a collection of loosely coupled services. This improves modularity and makes applications easier to develop, test, and deploy.",
          },
        ],
      },
    ],
  },
  "securing-your-web-app": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Top 5 Tips for Securing Your Web App" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Web security is a vast topic, but following a few fundamental best practices can significantly reduce your application's attack surface.",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Always validate user input on the server-side.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "Use HTTPS everywhere." }],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Implement strong password hashing (e.g., bcrypt).",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // --- Priya Singh's Design Blogs ---
  "the-principles-of-good-ui": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "The Core Principles of Good UI Design" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Great UI design is not just about aesthetics; it's about creating an intuitive and efficient experience for the user. While design trends change, the core principles remain timeless.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Key Principles" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Clarity:" },
                  {
                    type: "text",
                    text: " The interface should be clear and unambiguous.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [{ type: "bold" }],
                    text: "Consistency:",
                  },
                  {
                    type: "text",
                    text: " Similar elements should look and behave similarly.",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  "figma-for-beginners": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Figma for Beginners: A Quick Start Guide" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Figma has become the industry standard for UI/UX design, and for good reason. It's a powerful, collaborative, and browser-based tool. This guide will get you started with the basics.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "The Interface" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The Figma interface is divided into three main sections: the Layers Panel on the left, the Canvas in the middle, and the Properties Panel on the right.",
          },
        ],
      },
    ],
  },
  "creating-a-design-system": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Creating a Design System from Scratch" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications. It's the single source of truth for your entire team.",
          },
        ],
      },
    ],
  },
  "the-psychology-of-color": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "The Psychology of Color in Design" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Color is a powerful tool in a designer's arsenal. It can evoke emotions, influence decisions, and create a strong brand identity. Understanding color psychology is essential for effective communication.",
          },
        ],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Red:" },
                  { type: "text", text: " Evokes passion and urgency." },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", marks: [{ type: "bold" }], text: "Blue:" },
                  { type: "text", text: " Conveys trust and security." },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  "user-research-methods": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "An Overview of User Research Methods" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "User research helps us understand user behaviors, needs, and motivations. This is crucial for designing products that are not only beautiful but also truly useful.",
          },
        ],
      },
    ],
  },
  "mobile-first-design": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Why Mobile-First Design is a Game-Changer" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Designing for the smallest screen first forces you to prioritize content and create a cleaner, more focused user experience. This approach scales up to larger screens much more effectively than designing for desktop first.",
          },
        ],
      },
    ],
  },
  "accessibility-in-web-design": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Designing for Everyone: An Intro to Web Accessibility",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Web accessibility (a11y) is the practice of ensuring that your websites are usable by people with disabilities. This includes providing alternative text for images, ensuring proper color contrast, and making sites navigable by keyboard.",
          },
        ],
      },
    ],
  },
  "typography-best-practices": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Typography Best Practices for Readability" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Good typography is invisible. It makes reading effortless. Key factors include choosing a legible font, maintaining a consistent line height (around 1.5x the font size), and ensuring a comfortable line length.",
          },
        ],
      },
    ],
  },
  "prototyping-with-invision": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Creating Interactive Prototypes with InVision",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A static mockup can only communicate so much. Prototyping tools like InVision allow you to link your designs together, creating clickable prototypes that simulate the final user experience for better feedback.",
          },
        ],
      },
    ],
  },
  "my-freelance-journey": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "My First Year as a Freelance Designer" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Transitioning from a full-time job to freelance was both terrifying and exhilarating. In this post, I share the biggest lessons I've learned, from finding clients to managing finances.",
          },
        ],
      },
    ],
  },

  // --- Amit Kumar's Student Blogs ---
  "a-guide-to-git-and-github": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "A Beginner's Guide to Git and GitHub" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Version control is a critical skill for any developer. Git is the tool, and GitHub is the service that hosts your Git repositories. Let's cover the absolute essentials.",
          },
        ],
      },
    ],
  },
  "how-to-ace-your-coding-interview": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "How to Ace Your Coding Interview" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Technical interviews can be daunting. Preparation is key. Focus on understanding core concepts rather than memorizing solutions.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Key Areas" }],
      },
      {
        type: "orderedList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Data Structures & Algorithms" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: "System Design" }],
              },
            ],
          },
        ],
      },
    ],
  },
  "learning-data-structures": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Learning Data Structures: The Foundation of Efficient Code",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Understanding data structures is fundamental to writing efficient and scalable algorithms. They are the building blocks of software engineering.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Common Data Structures" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Start with the basics: Arrays, Linked Lists, Stacks, and Queues. Then move on to more complex structures like Trees, Graphs, and Hash Tables.",
          },
        ],
      },
    ],
  },
  "python-for-data-science": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Python for Data Science: Getting Started" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Python has become the de facto language for data science, thanks to its simplicity and a rich ecosystem of libraries.",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Essential Libraries" }],
      },
      {
        type: "codeBlock",
        content: [
          {
            type: "text",
            text: "# NumPy: For numerical operations\nimport numpy as np\n\n# Pandas: For data manipulation and analysis\nimport pandas as pd\n\n# Matplotlib & Seaborn: For data visualization\nimport matplotlib.pyplot as plt",
          },
        ],
      },
    ],
  },
  "time-management-for-students": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Effective Time Management for Students" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Juggling classes, assignments, and personal projects can be overwhelming. Developing strong time management skills is crucial for success.",
          },
        ],
      },
    ],
  },
  "building-my-portfolio": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Tips for Building an Impressive Developer Portfolio",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Your portfolio is your digital resume. It's a chance to showcase your skills and projects to potential employers. Make it count.",
          },
        ],
      },
    ],
  },
  "effective-note-taking-strategies": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Effective Note-Taking Strategies for Technical Subjects",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Simply writing down what the professor says isn't enough. Active note-taking methods like the Cornell Method or creating mind maps can significantly improve retention and understanding.",
          },
        ],
      },
    ],
  },
  "top-10-vs-code-extensions": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Top 10 VS Code Extensions for Students" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The right tools can make all the difference. Here are ten VS Code extensions that have boosted my productivity, from better linting to live code sharing.",
          },
        ],
      },
    ],
  },
  "my-first-hackathon-experience": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "What I Learned at My First Hackathon" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "A hackathon is a whirlwind of coding, collaboration, and little sleep. It was an incredible learning experience that taught me more about teamwork and rapid prototyping than any class could.",
          },
        ],
      },
    ],
  },
  "overcoming-imposter-syndrome": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Overcoming Imposter Syndrome as a Student Developer",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Feeling like you don't belong or aren't as smart as your peers is incredibly common. Recognizing imposter syndrome is the first step. The next is realizing that everyone is on their own learning journey.",
          },
        ],
      },
    ],
  },

  // --- Sneha Gupta's Marketing Blogs ---
  "seo-basics-for-2025": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "SEO Basics for 2025: A Modern Approach" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Search Engine Optimization is constantly evolving, but the fundamentals remain crucial for online visibility. In 2025, the focus is more than ever on user experience and high-quality content.",
          },
        ],
      },
    ],
  },
  "content-marketing-that-converts": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Creating Content Marketing That Actually Converts",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Content marketing is about more than just getting views; it's about turning readers into customers. This requires a strategic approach that focuses on value and clear calls-to-action.",
          },
        ],
      },
    ],
  },
  "the-power-of-email-newsletters": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "The Power of Email Newsletters" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "In an age of social media algorithms, an email list is one of the few direct lines of communication you own. It's a powerful tool for building a loyal audience.",
          },
        ],
      },
    ],
  },
  "building-a-brand-on-instagram": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "How to Build a Powerful Brand on Instagram" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Instagram is a visual platform, making it a perfect place to build a strong brand identity. Consistency in your visuals, voice, and values is key to standing out.",
          },
        ],
      },
    ],
  },
  "google-analytics-deep-dive": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "A Deep Dive into Google Analytics 4" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Google Analytics 4 (GA4) represents a major shift from Universal Analytics. It's built around events and users, giving you a more complete picture of the customer journey.",
          },
        ],
      },
    ],
  },
  "running-successful-ad-campaigns": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "5 Steps to Running Successful Ad Campaigns" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "From defining your audience to crafting compelling ad copy and analyzing the results, a successful ad campaign requires careful planning and execution.",
          },
        ],
      },
    ],
  },
  "social-media-analytics": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "Making Sense of Social Media Analytics" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Likes and follows are vanity metrics. True success is measured by engagement, reach, and conversion. We'll break down which metrics matter most for your business goals.",
          },
        ],
      },
    ],
  },
  "keyword-research-guide": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "A Beginner's Guide to Keyword Research" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Keyword research is the foundation of SEO. It's the process of finding the terms and phrases that people are searching for, so you can create content that meets their needs.",
          },
        ],
      },
    ],
  },
  "the-aida-model-in-action": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "The AIDA Model in Action" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The AIDA model—Attention, Interest, Desire, Action—is a classic marketing funnel. It describes the four stages a consumer goes through before making a purchase decision. Your content should guide them through each stage.",
          },
        ],
      },
    ],
  },
  "affiliate-marketing-tips": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Top 5 Affiliate Marketing Tips for Beginners",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Affiliate marketing can be a great source of passive income, but it requires trust. Only recommend products you genuinely believe in, and always be transparent with your audience about your affiliate relationships.",
          },
        ],
      },
    ],
  },

  // --- Vikram Reddy's Writing Blogs ---
  "overcoming-writers-block": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Practical Techniques to Overcome Writer's Block",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Every writer faces it: the dreaded blank page. It isn't a lack of talent; it's a temporary creative hurdle. Here are some practical strategies to jump over it.",
          },
        ],
      },
    ],
  },
  "finding-your-writers-voice": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Finding Your Unique Writer's Voice" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Your writer's voice is the unique personality that comes through in your writing. It's a combination of your tone, style, and point of view. It's what makes your writing yours.",
          },
        ],
      },
    ],
  },
  "the-art-of-the-short-story": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "The Art of the Short Story" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The short story is a masterclass in economy. Every word must count. Unlike a novel, you don't have the luxury of time; you must create an impact quickly and efficiently.",
          },
        ],
      },
    ],
  },
  "crafting-compelling-characters": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "The Art of Crafting Compelling Characters" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Great stories are driven by great characters. A compelling character is one who is flawed, relatable, and has clear motivations. They feel like real people, and readers will connect with their struggles and triumphs.",
          },
        ],
      },
    ],
  },
  "editing-your-first-draft": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Editing Your First Draft: A Step-by-Step Guide",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The first draft is just the beginning. The real magic of writing happens during the editing process. Here's how to approach it without feeling overwhelmed.",
          },
        ],
      },
    ],
  },
  "world-building-in-fantasy-fiction": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "The Art of World-Building in Fantasy Fiction",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Creating a believable world is the foundation of any great fantasy story. From geography and history to magic systems and cultures, every detail adds to the reader's immersion.",
          },
        ],
      },
    ],
  },
  "daily-writing-habits": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Cultivating Daily Writing Habits" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Consistency is more important than inspiration. Writing a little bit every day, even when you don't feel like it, builds momentum and makes writing a natural part of your routine.",
          },
        ],
      },
    ],
  },
  "poetry-for-beginners": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          { type: "text", text: "An Introduction to Poetry for Beginners" },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Poetry is about more than just rhymes. It's about using language to create imagery, evoke emotion, and explore complex ideas in a condensed form. Don't be intimidated; start by reading poets you enjoy.",
          },
        ],
      },
    ],
  },
  "self-publishing-vs-traditional": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "Self-Publishing vs. Traditional: Which is Right for You?",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Traditional publishing offers prestige and professional support, but self-publishing provides greater creative control and higher royalty rates. The right path depends on your goals as an author.",
          },
        ],
      },
    ],
  },
  "the-heros-journey": {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [
          {
            type: "text",
            text: "The Hero's Journey: A Timeless Story Structure",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "From ancient myths to modern blockbusters, the Hero's Journey is a narrative pattern that resonates with audiences. It describes a hero who goes on an adventure, wins a victory in a decisive crisis, and comes home changed or transformed.",
          },
        ],
      },
    ],
  },
};
const blogTitlesByUser = {
  rohan_sharma88: [
    "Intro to Node.js",
    "Mastering React Hooks",
    "Building a REST API with Express",
    "Understanding Docker",
    "GraphQL vs REST",
    "CI/CD Pipelines Explained",
    "JavaScript Event Loop",
    "WebSockets for Real-Time Apps",
    "Microservices Architecture",
    "Securing Your Web App",
  ],
  priya_designs: [
    "The Principles of Good UI",
    "Figma for Beginners",
    "Creating a Design System",
    "The Psychology of Color",
    "User Research Methods",
    "Mobile-First Design",
    "Accessibility in Web Design",
    "Typography Best Practices",
    "Prototyping with InVision",
    "My Freelance Journey",
  ],
  amit_learns: [
    "How to Ace Your Coding Interview",
    "Effective Note-Taking Strategies",
    "Top 10 VS Code Extensions",
    "My First Hackathon Experience",
    "Learning Data Structures",
    "A Guide to Git and GitHub",
    "Time Management for Students",
    "Building My Portfolio",
    "Python for Data Science",
    "Overcoming Imposter Syndrome",
  ],
  sneha_marketing: [
    "SEO Basics for 2025",
    "Content Marketing That Converts",
    "The Power of Email Newsletters",
    "Running Successful Ad Campaigns",
    "Social Media Analytics",
    "Building a Brand on Instagram",
    "Keyword Research Guide",
    "The AIDA Model in Action",
    "Affiliate Marketing Tips",
    "Google Analytics Deep Dive",
  ],
  vikram_writes: [
    "Finding Your Writer's Voice",
    "The Art of the Short Story",
    "Crafting Compelling Characters",
    "World-Building in Fantasy Fiction",
    "Overcoming Writer's Block",
    "Daily Writing Habits",
    "Poetry for Beginners",
    "Self-Publishing vs Traditional",
    "Editing Your First Draft",
    "The Hero's Journey",
  ],
};
const blogCategoryMap = {
  "intro-to-node-js": "Web Development",
  "mastering-react-hooks": "Web Development",
  "building-a-rest-api-with-express": "Web Development",
  "understanding-docker": "DevOps",
  "graphql-vs-rest": "Web Development",
  "ci-cd-pipelines-explained": "DevOps",
  "javascript-event-loop": "Web Development",
  "websockets-for-real-time-apps": "Web Development",
  "microservices-architecture": "Technology",
  "securing-your-web-app": "Technology",
  "the-principles-of-good-ui": "UI/UX",
  "figma-for-beginners": "UI/UX",
  "creating-a-design-system": "UI/UX",
  "the-psychology-of-color": "Design",
  "user-research-methods": "UI/UX",
  "mobile-first-design": "Design",
  "accessibility-in-web-design": "Design",
  "typography-best-practices": "Design",
  "prototyping-with-invision": "UI/UX",
  "my-freelance-journey": "Productivity",
  "how-to-ace-your-coding-interview": "Productivity",
  "effective-note-taking-strategies": "Productivity",
  "top-10-vs-code-extensions": "Technology",
  "my-first-hackathon-experience": "Productivity",
  "learning-data-structures": "Technology",
  "a-guide-to-git-and-github": "Technology",
  "time-management-for-students": "Productivity",
  "building-my-portfolio": "Web Development",
  "python-for-data-science": "Technology",
  "overcoming-imposter-syndrome": "Productivity",
  "seo-basics-for-2025": "Marketing",
  "content-marketing-that-converts": "Marketing",
  "the-power-of-email-newsletters": "Marketing",
  "running-successful-ad-campaigns": "Marketing",
  "social-media-analytics": "Marketing",
  "building-a-brand-on-instagram": "Marketing",
  "keyword-research-guide": "Marketing",
  "the-aida-model-in-action": "Marketing",
  "affiliate-marketing-tips": "Marketing",
  "google-analytics-deep-dive": "Marketing",
  "finding-your-writers-voice": "Creative Writing",
  "the-art-of-the-short-story": "Creative Writing",
  "crafting-compelling-characters": "Creative Writing",
  "world-building-in-fantasy-fiction": "Creative Writing",
  "overcoming-writers-block": "Creative Writing",
  "daily-writing-habits": "Productivity",
  "poetry-for-beginners": "Creative Writing",
  "self-publishing-vs-traditional": "Creative Writing",
  "editing-your-first-draft": "Creative Writing",
  "the-heros-journey": "Creative Writing",
};

// --- 3. MAIN SEEDING LOGIC ---

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Cleaning up old data...");
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});
      await UserFollow.deleteMany({});
      await Category.deleteMany({});
      console.log("✅ Cleanup complete.");
      console.log("Creating categories...");
      const parentCategoriesData = [
        {
          name: "Technology",
          slug: "technology",
          description: "All things tech, from software to hardware.",
          type: "pre-defined",
        },
        {
          name: "Design",
          slug: "design",
          description: "Discussions on UI/UX, graphic design, and aesthetics.",
          type: "pre-defined",
        },
        {
          name: "Marketing",
          slug: "marketing",
          description: "Strategies for growth, SEO, and content.",
          type: "pre-defined",
        },
        {
          name: "Productivity",
          slug: "productivity",
          description: "Tips and tricks for students and professionals.",
          type: "pre-defined",
        },
        {
          name: "Creative Writing",
          slug: "creative-writing",
          description: "The art and craft of storytelling.",
          type: "pre-defined",
        },
      ];
      await Category.insertMany(parentCategoriesData);
      const createdParentCategories = await Category.find({ parent: null });
      const getParentId = (name) =>
          createdParentCategories.find((p) => p.name === name)?._id || null;
       const subCategoriesData = [
         {
           name: "Web Development",
           slug: "web-development",
           parent: getParentId("Technology"),
           type: "pre-defined",
         },
         {
           name: "DevOps",
           slug: "devops",
           parent: getParentId("Technology"),
           type: "pre-defined",
         },
         {
           name: "UI/UX",
           slug: "ui-ux",
           parent: getParentId("Design"),
           type: "pre-defined",
         },
       ];
       await Category.insertMany(subCategoriesData);
       const allCategories = await Category.find({});
       console.log(
         `✅ ${allCategories.length} categories created successfully.`
       );
    // --- CREATE USERS ---
    console.log("Creating 5 new users...");
    const usersData = [
      {
        fullName: "Rohan Sharma",
        username: "rohan_sharma88",
        email: "jatinprakashoffical@gmail.com",
        password: "password123",
        bio: "Software developer from Meerut, passionate about open-source and building scalable web applications.",
        avatar: "https://i.pravatar.cc/150?u=rohan_sharma88",
        coverImage:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format=fit=crop",
      },
      {
        fullName: "Priya Singh",
        username: "priya_designs",
        email: "jatinprakashjdboss@gmail.com",
        password: "password123",
        bio: "UI/UX designer with a love for clean interfaces and user-centered design. Freelancer and digital artist based in Delhi.",
        avatar: "https://i.pravatar.cc/150?u=priya_designs",
        coverImage:
          "https://images.unsplash.com/photo-1522881451255-f5926c5f81d8?q=80&w=800&auto=format=fit=crop",
      },
      {
        fullName: "Amit Kumar",
        username: "amit_learns",
        email: "jatin.prakash.cseaiml.2022@miet.ac.in",
        password: "password123",
        bio: "Computer Science student and lifelong learner. Documenting my journey through code and sharing productivity tips for students.",
        avatar: "https://i.pravatar.cc/150?u=amit_learns",
        coverImage:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format=fit=crop",
      },
      {
        fullName: "Sneha Gupta",
        username: "sneha_marketing",
        email: "jatinprakashjd@gmail.com",
        password: "password123",
        bio: "Digital marketer specializing in content strategy and SEO. Helping startups grow their online presence.",
        avatar: "https://i.pravatar.cc/150?u=sneha_marketing",
        coverImage:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format=fit=crop",
      },
      {
        fullName: "Vikram Reddy",
        username: "vikram_writes",
        email: "jatinprakashphonedata2@gmail.com",
        password: "password123",
        bio: "Creative writer and storyteller. Exploring the worlds of fiction, poetry, and the art of writing itself.",
        avatar: "https://i.pravatar.cc/150?u=vikram_writes",
        coverImage:
          "https://images.unsplash.com/photo-1455390587440-4eb62c5543c9?q=80&w=800&auto=format=fit=crop",
      },
    ];

    const createdUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`✅ ${createdUsers.length} users created successfully.`);

    // --- CREATE BLOGS ---
    console.log("Creating 10 blogs for each user...");
    const blogsToCreate = [];
    for (const user of createdUsers) {
      const titles = blogTitlesByUser[user.username];
      for (const title of titles) {
        const slug = generateSlug(title);
          const contentObject = blogContentMap[slug] || sampleTiptapContent;
          
          const categoryName = blogCategoryMap[slug];
          const category = allCategories.find((c) => c.name === categoryName);
        blogsToCreate.push({
          title,
          slug,
          excerpt: generateExcerpt(contentObject),
          content: JSON.stringify(contentObject),
          thumbnail: `https://source.unsplash.com/random/800x600/?${slug.replace(/-/g, ",")}`,
          status: "published",
          isPublished: true,
            owner: user._id,
          categories: category ? [category._id] : [],
          likeCount: 4,
          commentCount:4,
        });
      }
    }
    const createdBlogs = await Blog.insertMany(blogsToCreate);
    console.log(`✅ ${createdBlogs.length} blogs created successfully.`);

    // --- CREATE REALISTIC INTERACTIONS ---
   console.log("Generating realistic comments and likes for each blog...");
   const commentsToCreate = [];
   const likesToCreate = [];

   // A pool of realistic comments to make the interactions feel more natural
   const realisticComments = [
     "This is a great overview! Thanks for sharing.",
     "Really helpful post. The code examples were especially clear.",
     "I completely agree with your points. This is something more people should know about.",
     "Fantastic write-up! Bookmarking this for future reference.",
     "I've been looking for a good explanation of this topic. This is perfect!",
     "Insightful perspective. You've given me a lot to think about.",
   ];

   for (const blog of createdBlogs) {
     const otherUsers = createdUsers.filter(
       (user) => user._id.toString() !== blog.owner.toString()
     );

     for (const interactor of otherUsers) {
       // Pick a random comment from our pool for variety
       const randomComment =
         realisticComments[
           Math.floor(Math.random() * realisticComments.length)
         ];

       commentsToCreate.push({
         content: randomComment,
         blog: blog._id,
         owner: interactor._id,
       });

       likesToCreate.push({
         blog: blog._id,
         likedBy: interactor._id,
       });
     }
   }

   await Comment.insertMany(commentsToCreate);
   await Like.insertMany(likesToCreate);
   console.log(
     `✅ ${commentsToCreate.length} comments and ${likesToCreate.length} likes created.`
   );

   console.log("🚀 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ An error occurred during database seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();
