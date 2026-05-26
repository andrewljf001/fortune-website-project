# Workflow Rules

## Purpose

This file defines the default engineering workflow for this project.
When there is a mature industry standard, we follow the standard first.

## Core Rule

- Prefer standardized engineering practices over temporary "just make it run" solutions.
- If a request conflicts with best practice, pause and propose a compliant alternative first.

## Environment Strategy

- Use separated environments: `dev` / `staging` / `prod`.
- Never mix production data with staging or development.
- Keep all secrets in environment variables, never hardcode in source code.

## Branching and Release

- `develop` branch: staging integration and verification.
- `main` branch: production-ready code only.
- New features/changes are developed in short-lived feature branches and merged into `develop` first.
- Release to `main` only after staging verification passes.

## CI/CD Baseline

- Every push should run automated checks (at minimum: install, lint/check, basic test/build).
- Deploy staging automatically from `develop`.
- Deploy production from `main` with explicit release control.

## Quality Gates

- Minimum validation for each feature:
  - basic functional test
  - API health check
  - regression check for core flow
- No direct production change without staging validation.

## Security Baseline

- Principle of least privilege for database and service accounts.
- Rotate credentials when exposure risk exists.
- CORS must be restricted to trusted origins in non-dev environments.

## Migration Policy

- Prefer cloud staging-first rollout, then migrate to VPS after stability is confirmed.
- Keep infrastructure-specific logic isolated to configuration, not business code.

## Collaboration Rule

- The assistant should proactively identify risks and missing controls.
- The assistant should not mechanically follow risky shortcuts when a safer standard path exists.
