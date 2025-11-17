# Secret Scanning Policy (12.5)

## Tooling

1. **Manual / CI script:** `npm run scan:secrets` runs `gitleaks detect --redact` against the repository.
2. **GitHub push protection:** enable at repo/org level (`Settings → Code security → Secret scanning → Enable secret scanning` and `Push protection`).
3. **Pre-commit hook (optional):** add `npx gitleaks protect --staged` via Husky if we adopt git hooks later.

## Workflow

1. Before pushing, run:
   ```bash
   npm run scan:secrets
   ```
   The script exits with non-zero status if potential secrets are found and prints redacted matches.
2. In CI (GitHub Actions), add a job to execute the same command. Fail the pipeline on findings.
3. When a false positive occurs, add allow rules to `.gitleaks.toml` (to be created once patterns are known).

## Configuration Notes

- `--redact` ensures logs never print raw candidate secrets.
- Reports can be exported with `--report-format=json --report-path=gitleaks-report.json`; the file is ignored via `.gitignore`.
- Combine with GitHub’s native secret scanning to catch credentials in PRs from forks.

## Incident Response

1. If a real secret is committed, rotate immediately (see `docs/secrets-management.md`).
2. Purge the secret from git history using `git filter-repo` if required.
3. Document the incident in a private runbook, including rotation timestamps.
