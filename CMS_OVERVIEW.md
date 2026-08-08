# Plus Advisor CMS — Project Overview

A private admin website to manage journal content for the Plus Advisor public site.

---

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend & Database:** Firebase (Authentication + Firestore)
- **Hosting:** Firebase / Vercel

---

## Authentication

- **Firebase Authentication** (email-based login)
- **Allowlist-based access** — only pre-approved emails can sign in
- **Admin-managed allowlist** — add/remove emails allowed to access the CMS
- Secure logout
- Protected routes — unauthenticated users cannot access CMS pages

---

## Pages

- **Login** — email sign-in for approved users
- **Dashboard / Journal List** — view all journals with search, filter, sort
- **Journal Detail / Editor** — create, edit, and manage individual journal articles
- **Allowed Emails** — manage which emails can log in to the CMS
- **Logout** — end the session securely

---

## Journal Management Features

- View full list of journals
- Create new journal entries
- Edit existing journals (title, content, images, categories, tags, publish date, etc.)
- Delete journals
- Preview before publishing
- Auto-sync with the public website content

---

## Access Control

- Only whitelisted emails can log in
- Admin can add or remove allowed emails from within the CMS
- Real-time authentication check on every page

---

## Architecture

- Cloud-based (Firebase) — no server maintenance
- Real-time data sync with Firestore
- Secure by default (Firebase auth rules + allowlist)
- Fully responsive (desktop / tablet / mobile)
- Clean, modern UI with shadcn components

---

## For the Client

- **Private admin dashboard** — only authorized team members can access
- **Easy journal editing** — update articles anytime without a developer
- **Email allowlist control** — decide who can log in to the CMS
- **Real-time updates** — changes reflect immediately
- **Secure & cloud-hosted** — powered by Firebase
- **Modern, clean interface** — built with shadcn/ui for a professional look
