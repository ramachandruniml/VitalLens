# VitalLens (2nd place @ BadgerAI Hackathon)

> *"Every year, millions of people get a lab report, stare at it for 30 seconds, and put it in a drawer — because they have no idea what it means."*

VitalLens is an AI-powered health data companion that turns your lab reports into plain-English insights. Upload a PDF, get every biomarker extracted and explained, track your health trends over time, and walk into your next doctor's appointment with the right questions.

---

## Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshots/Screenshot 2026-04-20 at 4.25.51 PM.png" alt="Upload" />
      <br /><strong>Upload</strong> — Drag and drop any lab report PDF
    </td>
    <td align="center" width="50%">
      <img src="Screenshots/Screenshot 2026-04-20 at 4.26.04 PM.png" alt="Biomarker Dashboard" />
      <br /><strong>Biomarker Dashboard</strong> — Results grouped by category with plain-English explanations
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="Screenshots/Screenshot 2026-04-20 at 4.26.15 PM.png" alt="Trend Charts" />
      <br /><strong>Trend Charts</strong> — Longitudinal view of biomarkers over time with normal range bands
    </td>
    <td align="center" width="50%">
      <img src="Screenshots/Screenshot 2026-04-20 at 4.26.30 PM.png" alt="Doctor Prep" />
      <br /><strong>Doctor Prep</strong> — AI-generated questions tailored to your concerning results
    </td>
  </tr>
</table>

---

## Features

- **PDF Upload** — Drag and drop any lab report PDF. Supports both text-based and image-based (scanned) PDFs
- **AI Extraction** — Claude reads your report and extracts every biomarker with values, units, reference ranges, and status
- **Biomarker Dashboard** — Results grouped by medical category (Hematology, Liver Function, Thyroid, etc.) with plain-English explanations and pronunciation audio for each metric
- **Trend Charts** — Upload multiple reports over time and watch your biomarkers trend across visits, with a green normal range band overlaid on every chart
- **Doctor Prep** — AI-generated questions tailored to your concerning results, with a biomarker badge on each question, ready to copy or print
- **Persistent History** — All uploads saved to your account via Supabase — data never disappears on refresh

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Routing | React Router |
| Charts | Recharts |
| Icons | Lucide React |
| PDF Parsing | pdfjs-dist |
| File Upload | react-dropzone |
| Auth & Database | Supabase (Postgres + RLS) |
| Edge Functions | Supabase Edge Functions (Deno) |
| AI | Claude Sonnet 4.6 (Anthropic) |
| Audio | Web Speech API (browser-native) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone and install

```bash
git clone https://github.com/ramachandruniml/VitalLens.git
cd VitalLens
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
```

### 3. Set up the database

Run this in your Supabase **SQL Editor**:

```sql
create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  visit_date date,
  raw_text text,
  created_at timestamp default now()
);

create table if not exists biomarkers (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid references visits(id),
  name text,
  value numeric,
  unit text,
  reference_low numeric,
  reference_high numeric,
  status text,
  explanation text,
  category text default 'General',
  created_at timestamp default now()
);

alter table visits enable row level security;
alter table biomarkers enable row level security;

drop policy if exists "Users can manage their own visits" on visits;
create policy "Users can manage their own visits"
on visits for all using (auth.uid() = user_id);

drop policy if exists "Users can manage their own biomarkers" on biomarkers;
create policy "Users can manage their own biomarkers"
on biomarkers for all using (
  exists (
    select 1 from visits
    where visits.id = biomarkers.visit_id
    and visits.user_id = auth.uid()
  )
);
```

### 4. Deploy Edge Functions

```bash
npm install supabase --save-dev
npx supabase login
npx supabase link --project-ref your-project-ref
npx supabase secrets set ANTHROPIC_API_KEY=your_anthropic_key
npx supabase functions deploy analyze-lab
npx supabase functions deploy doctor-prep
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Branch Structure

```
main          ← stable, demo-ready
dev           ← integration branch
person1/ui    ← frontend / design
person2/ai    ← backend / AI pipeline
```

Workflow: feature branches → PR into `dev` → PR into `main` when stable.

---

## How It Works

```
User uploads PDF
      ↓
pdfjs extracts text (falls back to canvas render for image PDFs)
      ↓
Supabase Edge Function sends content to Claude
      ↓
Claude returns structured JSON: name, value, unit, status, explanation, category
      ↓
Saved to Supabase (visits + biomarkers tables)
      ↓
Dashboard, Trends, and Doctor Prep pages read from Supabase
```

---

## The Problem We're Solving

The healthcare system generates enormous amounts of personal health data but delivers almost none of the understanding. You wait weeks for results, get a PDF of numbers, and are expected to make sense of it alone.

VitalLens is the translation layer between your lab report and your brain.

---

## Future Roadmap

- Direct lab integrations (Quest Diagnostics, LabCorp)
- Wearable data (Apple Health, Oura Ring)
- Doctor sharing — send your prep sheet directly to your provider
- Genetic data integration (23andMe)
- Medication interaction alerts
- Family accounts for caregivers
- Mobile app

---

## License

MIT
