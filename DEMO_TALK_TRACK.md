# Sovos Tax Compliance Cloud - Demo Talk Track

## Overview
This is an interactive demo of the Sovos Tax Compliance Cloud MVP - a real-time tax compliance monitoring and management dashboard built for enterprise businesses operating across multiple jurisdictions.

**Live Demo**: https://sovos-tax-mvp.vercel.app
**Credentials**: `mithun` / `1234`

---

## Demo Flow (5-7 minutes)

### 1. Login Experience (30 seconds)
**Talk Track:**
> "Welcome to Sovos Tax Compliance Cloud. This is our secure login portal. For this demo, I'll sign in with my credentials..."

**Actions:**
- Enter username: `mithun`
- Enter password: `1234`
- Click Sign In

**Key Points:**
- Clean, professional dark theme
- Custom animated logo with data flow visualization
- Secure authentication with session persistence

---

### 2. Dashboard Overview (1 minute)
**Talk Track:**
> "This is our main Compliance Dashboard. At a glance, you can see your overall compliance health across all jurisdictions. We're currently monitoring 6 jurisdictions - 4 US states and 2 EU countries for VAT."

**Actions:**
- Point to Compliance Score (78 with downward trend)
- Highlight the metrics row

**Key Points:**
- **Compliance Score**: Real-time aggregate score (78/100)
- **Total Liability**: $396K across all jurisdictions
- **YTD Collected**: $7.6M tax collected this year
- **Upcoming Filings**: 6 filings due soon

---

### 3. AI Insights (1 minute)
**Talk Track:**
> "One of our standout features is the AI-powered insights. Powered by Claude, the system automatically analyzes your compliance data and surfaces actionable insights..."

**Actions:**
- Walk through each insight card
- Click "Ask AI" to show chat capability

**Key Points:**
- **Critical Alert**: Germany filing is overdue with estimated penalty
- **Warning**: Multiple filings due within 10 days
- **Opportunity**: Potential to improve score by 20 points
- **Performance**: Strong 95% collection rate

---

### 4. Tax Rate Lookup Tool (45 seconds)
**Talk Track:**
> "For quick reference, we've built a Tax Rate Lookup tool. Your team can instantly check rates across any jurisdiction without leaving the dashboard..."

**Actions:**
- Click dropdown, select "California"
- Show rate details (7.25% Sales Tax, effective date)
- Select "Germany" to show VAT (19%)

**Key Points:**
- Instant access to current tax rates
- Distinguishes between Sales Tax and VAT
- Shows effective dates and notes
- Search functionality for quick lookup

---

### 5. Exemption Certificate Management (1 minute)
**Talk Track:**
> "Certificate management is critical for compliance. This tracker shows you have 42 valid certificates, but 8 are expiring within 30 days and 3 have already expired..."

**Actions:**
- Point to the stats (Valid: 42, Expiring: 8, Expired: 3)
- Click on "Expired" or "Manage" to open modal
- Show the expired certificates list
- Click "Request" to send renewal email

**Key Points:**
- Visual health bar showing certificate status
- Click-through to detailed certificate list
- One-click renewal request emails
- Bulk "Request All Renewals" action

---

### 6. Jurisdiction Deep Dive (1 minute)
**Talk Track:**
> "Let's drill into a specific jurisdiction. I'll click on Germany, which is showing as non-compliant..."

**Actions:**
- Find Germany card (shows "Non-Compliant" badge)
- Click to open modal
- Walk through jurisdiction details

**Key Points:**
- Full jurisdiction details: registration number, tax rate, filing frequency
- Current liability and YTD amounts
- Recent transaction history
- Quick actions: Export data, Set reminders, Open tax portal

---

### 7. Filing Calendar (45 seconds)
**Talk Track:**
> "The filing calendar gives you a visual timeline of all upcoming deadlines. Color coding helps prioritize - red means overdue, yellow is due soon..."

**Actions:**
- Navigate the calendar
- Click on a day with filings
- Show the filing detail modal

**Key Points:**
- Monthly calendar view with jurisdiction overlays
- Status color coding (overdue/due soon/upcoming)
- Click to see detailed filing requirements
- Links to view jurisdiction from filings

---

### 8. Export & Reporting (30 seconds)
**Talk Track:**
> "Finally, everything is exportable. Click the download icon to export your data in multiple formats..."

**Actions:**
- Click Download icon in header
- Show export options (Jurisdiction CSV, Compliance Report, Full JSON)
- Demonstrate an export

**Key Points:**
- Multiple export formats (CSV, JSON)
- Jurisdiction summary for finance teams
- Full compliance report for audits
- Complete data snapshot for backup

---

### 9. Closing (30 seconds)
**Talk Track:**
> "This is the Sovos Tax Compliance Cloud MVP. We've built a production-ready dashboard that gives businesses real-time visibility into their tax compliance across multiple jurisdictions, with AI-powered insights and automated certificate management."

**Actions:**
- Click logout to return to login screen
- Show the help link going to email

**Key Points:**
- Built with Next.js 16, React 19, TypeScript
- Modern dark theme with smooth animations
- AI integration with Claude
- Enterprise-ready authentication

---

## Technical Highlights

| Feature | Technology |
|---------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Framer Motion |
| Styling | Tailwind CSS, CSS Variables |
| AI | Claude API integration |
| Auth | Custom context with localStorage |
| Export | Client-side CSV/JSON generation |
| Deployment | Vercel |

---

## Contact

**Developer**: Mithun Manjunatha
**Email**: cmithun97@gmail.com
**Portfolio Demo**: https://sovos-tax-mvp.vercel.app
