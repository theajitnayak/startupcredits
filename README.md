# Startup Credits

A directory of provider programs with dated official-source evidence. It helps a founder or open source maintainer decide what is worth reviewing before applying.

Site: https://startupcredits.online

## Publication standard

Only reviewed claims supported by official provider pages appear in data/programs.json. A reachable link or an old official tag is not enough.

Each entry records the provider, program, benefit, listed criteria, official URL, actual review date, locating excerpt and source digest. These criteria are partial. The provider decides full eligibility and the award.

Unsupported monetary equivalents and aggregate claimable-credit totals are removed. Closed applications remain visible when the provider confirms that state.

The October 15, 2026 review retains 52 entries and holds 33 entries from the local inventory outside publication. Source snapshots and held records remain in a Git-ignored local review folder.

## Useful interaction

product/index.html is a working application-checklist prototype. It asks relevant questions, distinguishes missing facts from failed conditions and exports a checklist with the official source and review date. Answers stay in the browser page.

product/fit-engine.mjs contains partial checks for eight programs. Its results require provider review. It does not return an approval or guaranteed eligibility state.

## Checks and generated pages

Run npm test, then node scripts/check-catalog.mjs YYYY-MM-DD and node scripts/build-pages.mjs YYYY-MM-DD using the actual date.

The page builder regenerates provider pages and the sitemap so removed records do not survive on old URLs. Serve this folder over local HTTP to try the prototype. It needs no API key.

## Maintaining evidence

The source-audit script retrieves pages into a local review folder. It does not approve claims merely because a server returns success. Review the content before editing the curated source decisions and regenerating the catalog.

Automated terms checks detect drift. They do not silently approve new claims or replace the actual review date. Provider marketing statements and applicant awards remain separate.

Useful contributions are corrections with a primary source, changed criteria, confirmed closures and reproducible product failures. Do not invent dates, users or financial values.

Code is MIT licensed. The project is independent of the providers. Check current provider terms before applying.
