Inventory Manager
A full-stack inventory management app built as a portfolio project with a strong focus on clean architecture, modern UI, and real-world business workflows.

Tech Stack
Next.js (App Router)

React

TypeScript

Prisma

PostgreSQL / Neon

Auth.js

Tailwind CSS

Material UI Data Grid

Recharts

Lucide React

Features
Dashboard with sales, purchases, expenses, and product summaries

Inventory management with responsive data tables

Sales and expenses pages with structured data views

Guest demo data for visitors and private user data for authenticated users

Dark mode-friendly dashboard UI

Built With
This project was built with a server-first Next.js approach using Prisma for database queries and Auth.js for authentication. Interactive parts like charts and data tables are handled with client components, while most data loading stays on the server for cleaner architecture and better performance.

Why it stands out
This project showcases full-stack development skills, typed data modeling, reusable UI patterns, and practical product decisions. It was built to reflect how a real internal dashboard or lightweight SaaS inventory tool could be structured.

Run locally
bash
npm install
npm run dev
Prisma commands
bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
