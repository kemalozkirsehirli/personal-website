# Content Safety

Only user-approved website materials may be included in this repository and its generated pages. Restricted archives may be used solely to identify content that must never be published.

The automated audit enforces these rules:

- no credentials, tokens, key material, hidden evaluator payloads, or local filesystem paths;
- no résumé PDF or other PDF/ZIP/key/database file inside generated website trees;
- no phone number;
- no links to localhost or local files;
- `resumePdf` must remain `null`;
- generated `docs/` is synchronized only after the audit passes.

When sources disagree, only user-approved website material is eligible for inclusion. Claims must stay within the available evidence and stated limitations.
