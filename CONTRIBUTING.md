# Contributing to Quicksi Templates 🚀

Thank you for contributing to Quicksi Templates!

## 📦 What is a Template?

A template is a reusable code starter that can be reused by other developers.

---

## 🧱 Template Structure

Each template MUST follow this structure:

```bash
my-template/
├── .meta.json
├── .template.json (optional)[for env and installation requirements]
├── package.json (if applicable)
└── source files...
```

---

## 🏷️ Required: .meta.json

Every template MUST include:

```bash
{
  "id": "unique-template-id", (search for the name you want to use on quicksi-cli.dev/check-name)
  "name": "template-name",
  "description": "Describe what the template does",
  "tags": [],
  "author": {
    "name": "Your Name",
    "github_username": "your-username",
    "avatar": "url to your avatar or github avatar"
  }
}

```

tags helps people find and search your project
author helps people see who created it

## Optional

```.template.json```

Used for:
- post install message
- setup instructions


---

## 🚫 Rules

- Template MUST run without modification
- No TODO comments
- No placeholder code
- Must include dependencies (package.json if needed)
- Must not include secrets
- ID must be unique across all templates
- ID must be kebab-case
- No spaces in ID
- Template must be installable without manual fixes

---

## 📂 Folder Placement

Place your template inside:

```bash
templates/<language>/<framework>/<template-name>/
```

Example:

```bash
templates/javascript/node-js/auth-jwt/
```

or 

```bash
templates/python/django/auth-jwt
```

or 

```bash
templates/cpp/cmake/auth-jwt/
```

or 

```bash
templates/php/laravel/auth-jwt/
```

---

## 🧪 Testing

Before submitting:

Make sure the template:
- it runs
- installs dependencies if there are dependecies
- no errors

---

## 🔁 Versioning

Templates are versioned via Git tags by the maintainer:

v1.0.0
v1.1.0
v2.0.0

So you don't have to do anything about the versioning.
---

## 📥 Submitting

1. Fork repo
2. Add your template and the required json properties
3. Commit
4. Create PR


That's it, very simple

---

## 💡 Tips

- Keep templates simple and focused
- Avoid large dependencies unless necessary
- Prefer clean, readable code
