# OPM/BAN Club Website

This is the official website and credential system for the OPM/BAN Club.  
It provides public info pages, a login system for members, a personal wallet for e-badges, e-certificates, and membership cards, and public verification pages that can be linked on LinkedIn.

---

## ✨ Features

- **Public pages**: About, Vision, Mission, Events, Academic Support, Professional & Certification Support, Discord links (male/female), FAQ, Officers list.
- **Login system**: Members log in with their university email + a generated password (set by admins).
- **Member wallet**: Each member sees their e-badges, certificates, and membership card together in one place.
- **Credential system**:
  - Each credential has a unique **Credential ID** and a **Verify URL** (`/verify/[id]`).
  - Members can paste these into LinkedIn under “Licenses & Certifications.”
- **Admin panel**:
  - Create members and generate their login credentials.
  - Issue membership cards, certificates, and badges.
  - Revoke credentials if needed.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: NextAuth (Credentials provider) with bcrypt password hashing.
- **Styling**: Tailwind CSS v4.
- **Deployment**: Optimized for Vercel.
