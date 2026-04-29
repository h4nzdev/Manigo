Here's the full content of the `CLAUDE.md` so you can copy it directly:

```markdown
# CLAUDE.md — Manigo Project

> This file gives AI assistants (and teammates) full context on the Manigo project: what it is, how it's structured, and how development is phased.

---

## What is Manigo?

Manigo is a **smart assistant system for microfinance loan officers**. It helps field staff monitor loans, guide borrower interviews, detect repayment risk early, and navigate company policy — all from a mobile-friendly interface that works even without internet.

**One-liner:**
> "Manigo helps microfinance teams monitor loans, guide field officers, and detect risk early using automation and smart tools."

---

## Core Features

| Feature | What it does |
|---|---|
| Real-Time Liquidity Dashboard | Shows incoming vs. unpaid loans at a glance |
| Predictive Default (AI) | Flags clients likely to miss payments |
| Offline Sync | Collect data in the field, upload when back online |
| Interactive Policy Guide | LLM-powered chatbot for staff policy questions |
| Dynamic Interview Form | Smart questionnaire that adapts based on answers |
| Arrears Heatmap | Map view showing high-risk geographic zones |

---

## Tech Stack (Intended)

- **Frontend:** React (with Tailwind CSS)
- **Backend:** Node.js / REST API
- **Database:** PostgreSQL or SQLite (for offline)
- **AI / Automation:** n8n workflows, LLM API (policy guide), ML model (default prediction)
- **Offline:** IndexedDB or SQLite local storage + background sync
- **Maps:** Leaflet.js or Mapbox (heatmap)

---

## Phase Plan

### Phase 1 — UI Foundation `Weeks 1-3`

> **Focus: Build every screen first. Static/mock data only. No real backend yet.**

The goal is a fully interactive prototype that looks and feels complete. All five features should be navigable and presentable.

**Deliverables:**
- [ ] Liquidity dashboard layout (charts, KPI cards — mock data)
- [ ] Dynamic interview form (branching logic based on user answers)
- [ ] Arrears heatmap (map with color zones — hardcoded sample data)
- [ ] Policy guide chat shell (UI only, no LLM yet)
- [ ] Offline indicator UI (sync status, queued data screen)
- [ ] Navigation / app shell (sidebar or bottom nav)
- [ ] Mobile-responsive layout across all screens

**Key constraint:** No API calls in Phase 1. All data is mocked or hardcoded.

---

### Phase 2 — Core Backend + Data `Weeks 4-6`

> **Focus: Wire up real APIs and connect the UI to a live database.**

**Deliverables:**
- [ ] Database schema (clients, loans, payments, repayment history)
- [ ] REST API — CRUD endpoints for all core entities
- [ ] Auth (JWT or session-based login for loan officers)
- [ ] Interview form saves to backend
- [ ] Dashboard pulls real loan/payment data
- [ ] Basic admin panel or data seeding script

---

### Phase 3 — AI + Smart Features `Weeks 7-9`

> **Focus: Add the intelligent layer — predictions, chatbot, and heatmap logic.**

**Deliverables:**
- [ ] Predictive default model (risk scoring based on payment history)
- [ ] AI risk flags surfaced on dashboard and client profiles
- [ ] Policy guide chatbot (LLM integration, e.g. OpenAI or Claude API)
- [ ] Arrears heatmap backed by real aggregated data
- [ ] n8n automation flows (e.g. trigger alert when risk score crosses threshold)

---

### Phase 4 — Offline + Sync `Weeks 10-11`

> **Focus: Make the app fully usable in the field without internet.**

**Deliverables:**
- [ ] Local storage layer (IndexedDB or SQLite)
- [ ] Offline-first interview form (saves locally when no connection)
- [ ] Background sync — auto-uploads queued data when back online
- [ ] Conflict resolution strategy (what happens if data diverges?)
- [ ] Sync status UI (already built in Phase 1, now functional)

---

### Phase 5 — Testing + Launch `Weeks 12-13`

> **Focus: QA, user testing with field officers, and demo prep.**

**Deliverables:**
- [ ] End-to-end testing (critical user flows)
- [ ] Performance audit (especially on low-end mobile devices)
- [ ] Bug fixes from QA round
- [ ] User testing session with simulated loan officer scenarios
- [ ] Hackathon demo script and walkthrough
- [ ] Deployment (Vercel / Railway / VPS)

---

## Folder Structure (Suggested)

```
manigo/
├── client/                  # React frontend
│   ├── src/
│   │   ├── pages/           # One folder per feature
│   │   │   ├── Dashboard/
│   │   │   ├── InterviewForm/
│   │   │   ├── Heatmap/
│   │   │   ├── PolicyGuide/
│   │   │   └── Offline/
│   │   ├── components/      # Shared UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # State management
│   │   └── utils/
├── server/                  # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
├── n8n/                     # Automation workflow exports
├── ml/                      # Default prediction model
├── docs/                    # Extra documentation
└── CLAUDE.md                # This file
```

---

## Development Priorities

When in doubt, prioritize in this order:

1. **UI clarity** — field officers are not always tech-savvy
2. **Offline reliability** — bad internet is the norm in rural areas
3. **Speed** — low-end Android devices are the primary target
4. **AI accuracy** — risk predictions must be trustworthy, not just present

---

## Notes for AI Assistants

- Phase 1 is **UI only** — do not suggest backend calls or API integrations yet
- All screens should work with **mock/static data** during Phase 1
- The primary user is a **loan officer in the field**, not a manager or admin
- Offline-first is a core requirement, not a nice-to-have
- Keep the UI simple and touch-friendly — assume mobile-first
- The policy guide in Phase 1 is a **shell only** (hardcoded responses or placeholder UI)
```