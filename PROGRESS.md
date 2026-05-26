# Project Progress

## Current Status

- Overall: In Progress
- Phase: MVP Build + Deployment
- Last Update: 2026-05-26

## Milestones

| Milestone | Status | Notes |
|---|---|---|
| Repository initialized | Done | Public repo created and code pushed |
| Backend MVP (Auth + Orders API) | Done | `backend/src/server.js` |
| Frontend MVP page | Done | `frontend/index.html` |
| GitHub Pages setup | Todo | Configure Pages source to `/frontend` |
| Railway backend deployment | Todo | Create service, set variables, verify `/api/health` |
| End-to-end test | Todo | Register -> Login -> Create order -> List orders |
| VPS migration plan | Todo | Execute only after cloud deployment is stable |

## Task Board

### Todo

- [ ] Enable GitHub Pages for `frontend`
- [ ] Deploy `backend` on Railway
- [ ] Configure `ALLOWED_ORIGIN` to GitHub Pages domain
- [ ] Run full flow test and record results
- [ ] Add admin order management API/page (next iteration)

### In Progress

- [ ] None

### Done

- [x] Project skeleton built
- [x] README deployment guidance added
- [x] `.gitignore` configured

## Risks / Notes

- CORS must match exact frontend domain in production.
- Database credentials must stay in Railway Variables, not in repo.
- If using VPS MariaDB later, remote access and firewall rules are required.

## Next Action

1. Enable GitHub Pages.
2. Deploy Railway backend.
3. Complete one successful end-to-end order flow.
