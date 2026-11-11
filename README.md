# Tax Compliance Dashboard

Independent demo/prototype by Mithun Manjunatha, a Solutions Engineer. This is not an official Sovos product, and it is not affiliated with or endorsed by Sovos. Names and branding in the UI are there for the walkthrough only.

The app is a single-page dashboard of sample tax-compliance data. Sign-in is a hardcoded check in the browser. Nothing here files a return, connects to a tax engine, or stores customer data on a server.

## Demo login

| Email | Password |
| --- | --- |
| demo@example.com | demo123 |

`example.com` is a reserved documentation domain. The password is for this local demo only.

## What you can click through

After sign-in, the dashboard reads fixtures in `src/lib/mock-data.ts`:

- Compliance score, liability, and filing counts
- Six sample jurisdictions: California, Texas, New York, Florida, United Kingdom, and Germany
- Filing calendar, with detail when you pick a day
- Insight cards derived from that sample data
- A static tax-rate lookup
- A sample exemption-certificate list
- Sample integration and reconciliation panels
- Client-side export of the sample data (CSV or JSON)
- A chat widget. If `ANTHROPIC_API_KEY` is set, replies come from Anthropic. If it is not set, the API route returns a short canned answer from the same sample context

There is also a `/contact` page that posts the form to Formspree.

A longer click-path for presenting the demo is in `DEMO_TALK_TRACK.md`.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For live chat replies, copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY`. The dashboard still loads without it.

## Stack

- Next.js 16 (App Router) and React 19
- Tailwind CSS 4
- Framer Motion and Lucide
- Geist via `next/font`

## Project structure

```
src/
├── app/              # App Router pages and the chat API route
├── components/
│   ├── auth/         # Demo login screen
│   ├── chat/         # Chat widget
│   ├── dashboard/    # Dashboard panels
│   └── ui/
├── contexts/         # Auth and toast state
├── lib/              # Sample data, export helpers
└── types/
```

## Note

This repository is an independent demo/prototype. It is not an official Sovos product.
