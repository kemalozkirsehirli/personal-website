# Public Content Lock

This repository is a public website. Its public-facing research descriptions may use only:

1. content already approved in the website source; and
2. material explicitly supplied in the user-designated `Public` release archive.

The user-designated `Owner` archive is a **do-not-publish source**. It may be used only as a negative-control inventory for privacy auditing. No owner-only file, credential, hidden evaluator material, raw private dataset, internal strategy document, unpublished mechanism, or private research payload may be copied, summarized, linked, or embedded in the website.

The following rules are enforced by `npm run check`:

- no owner/private-master/anonymous-review paths or markers;
- no private-key or payload-key material;
- no résumé PDF, PDF, ZIP, key, or database file in `public/`, `dist/`, or `docs/`;
- no private phone number or local filesystem path;
- no local-only links;
- `resumePdf` must remain `null`;
- `dist/` is rebuilt and copied to `docs/` only after the public-content audit passes.

When public and owner materials disagree, the public release is the only source eligible for the website. Claims are kept inside the evidence and non-claim boundaries stated by the public release.
