# Contributing

Thanks for helping to keep the Fellowus Storybook healthy! This project lives in a lightweight Storybook-first setup, so day-to-day work is mostly component updates, visual/regression checks, and CI maintenance.

## Releasing the production Storybook

The production Storybook (served from GitHub Pages) is updated automatically whenever a semver tag that matches `v*` is pushed. To make this painless we expose a helper script:

```bash
pnpm release:tag           # creates v<package.json version> and pushes it
pnpm release:tag rc        # creates the next v<version>-rc.N tag and pushes it
pnpm release:tag beta      # creates the next v<version>-beta.N tag and pushes it
```

The script will:

1. Ensure your working tree is clean.
2. Fetch existing tags so it can determine the next pre-release number.
3. Create the tag (e.g. `v1.0.0` or `v1.0.0-rc.1`) and push it to the remote.
4. Trigger the `Release Pages` workflow, which builds Storybook and deploys it to GitHub Pages at `https://yasertunc.github.io/project-1/storybook/`.

> **Tip:** If you need a one-off tag without incrementing, you can pass an explicit identifier such as `pnpm release:tag rc.5`.

## Local checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm vr
```

These match the CI health gate. Running them before pushing helps keep preview builds and per-PR CI summaries green. If you only need a quick sanity pass, `pnpm lint && pnpm typecheck` is usually enough.

