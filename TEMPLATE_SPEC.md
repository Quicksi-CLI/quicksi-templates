# Template Specification

## Required Files

- .meta.json → REQUIRED
- source files → REQUIRED

---

## .meta.json Schema

```bash
{
  "id": string (required, unique),
  "name": string,
  "description": string,
  "tags": string[],
  "author": {
    "name": string,
    "github_username": string,
    "avatar": "url to your avatar or github avatar"
  }
}

```

---

## Rules

- ID must be unique across all templates
- ID must be kebab-case
- No spaces in ID
- Template must be installable without manual fixes

---

## Optional

.template.json

Used for:
- post install message
- setup instructions

---

## Disallowed

- API keys
- hardcoded secrets
- environment-specific configs
