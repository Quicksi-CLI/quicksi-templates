# Template Specification

## Required Files

- author.json → REQUIRED
- .meta.json → REQUIRED
- source files → REQUIRED

---

## author.json Schema
```bash

"<your-github-name>": {
      "name": "<your-fullname/identity-name>",
      "github_username": "<github-name>",
      "avatar": "<your-github-avatar-url>",
      "role": "<your-role>" e.g Backend Developer
    }
```


## .meta.json Schema

```bash
{
  "id": string (required, unique),
  "name": string,
  "description": string,
  "features" string[],
  "tags": string[],
  "programming_lang": string,
  "resource_type": string,
  "author_id": string
}

```

---

## Optional

.template.json

Used for:
- post install message
- setup instructions

---
