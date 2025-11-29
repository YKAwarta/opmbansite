# 🎓 OPM&BAN Club - Digital Credential Management System
A comprehensive Next.js web application for the Operations & Project Management and Business Analytics Club at Alfaisal University. This platform automates the issuance and verification of digital credentials including badges, membership cards, and certificates. Available at theopmbansite.com

# 📝 Features
## 1. Secure Authentication & Authorization

Role-Based Access Control (RBAC): Three-tier system (Member, Officer, Admin)
Row Level Security (RLS): PostgreSQL policies ensure data isolation
Middleware Protection: Route-level authentication guards

## 2. Automated Credential Management

Dynamic Generation: Automatic credential creation upon member registration
Multi-Format Support: Badges, membership cards, and certificates
Custom Branding: Gender-specific and position-specific credential templates
Verification System: Unique 16-character verification codes with public verification URLs

## 3. Member Dashboard

Profile Management: View personal information and update passwords
Digital Wallet: Access all earned credentials in one place
Download & Share: Direct download links and LinkedIn-ready verification URLs
Real-time Updates: Instantly view newly issued credentials

## 4. Admin Panel

Member Management: Create and manage user accounts
Credential Issuance: Issue specific credentials to members
Member Directory: View and filter all club members
Analytics Dashboard: Track membership and credential statistics

## 5. Public Verification

Anonymous Access: Anyone can verify credentials using verification codes
No Login Required: Public endpoint for transparency
Detailed Information: Shows member name, student ID, issue date, and expiry
Active Status Checking: Only displays valid, non-expired credentials

# 🛠️ Tech Stack
## Frontend

Framework: Next.js 15 (App Router)
Language: TypeScript
Styling: Tailwind CSS
Components: shadcn/ui + Radix UI
Icons: Lucide React
Forms: React Hook Form + Zod validation

## Backend

Database: PostgreSQL (via Supabase)
Authentication: Supabase Auth
Storage: Supabase Storage (Cloud-based)
Email: Resend API for transactional emails
Image Processing: Sharp & canvas (for credential generation)

## Infrastructure

Hosting: Vercel (Optimized for Next.js)
Domain: Cloudflare DNS
Database: Supabase (PostgreSQL with realtime capabilities)
File Storage: Supabase Storage buckets

# 🔒 Security Features
## Database Security

Row Level Security (RLS) enabled on all tables
Secure Functions with SECURITY DEFINER for privileged operations
Input Validation using Zod schemas on all forms
SQL Injection Protection via parameterized queries

## Authentication

JWT Tokens for session management
Password Requirements: Minimum 8 characters enforced
Service Role Key isolation for admin operations
Secure Cookie Handling with httpOnly flags

## API Security

Middleware Protection: All sensitive routes require authentication
Role Verification: Admin-only endpoints check user roles before execution
CORS Configuration: Restricted to allowed origins
Rate Limiting: Implemented at Vercel edge level
