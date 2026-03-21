# Contributing to Quicksi Templates 🚀

Thank you for contributing to Quicksi!

## 📦 What is a Template?

A template is a reusable code starter that can be installed using:

quicksi <template-id> <what-you-want-to-name-the-app>

---

## 🧱 Template Structure

Each template MUST follow this structure:

my-template/
├── .meta.json
├── .template.json (optional)
├── package.json (if applicable)
└── source files...

---

## 🏷️ Required: .meta.json

Every template MUST include:

{
  "id": "unique-template-id", (search for the name you want to use on quicksi-cli.dev/check-name)
  "name": "template-name",
  "description": "what this template does",
  "tags": [],
  "keywords": [],
  "author": {
    "name": "Your Name",
    "github_username": "your-username",
    "avatar": "url to your avatar or github avatar"
  }
}

---

## 🚫 Rules

- Template MUST run without modification
- No TODO comments
- No placeholder code
- Must include dependencies (package.json if needed)
- Must not include secrets

---

## 📂 Folder Placement

Place your template inside:

templates/<language>/<framework>/<template-name>/

Example:

templates/javascript/node-js/auth-jwt/

---

## 🧪 Testing

Before submitting:

Make sure the templat:
- it runs
- installs dependencies if there are dependecies
- no errors

---

## 🔁 Versioning

Templates are versioned via Git tags:

v1.0.0
v1.1.0
v2.0.0

---

## 📥 Submitting

1. Fork repo
2. Add your template
3. Commit
4. Create PR

---

## 💡 Tips

- Keep templates simple and focused
- Avoid large dependencies unless necessary
- Prefer clean, readable code
