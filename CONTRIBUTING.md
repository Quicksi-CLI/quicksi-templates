# Contributing

Thank you for contributing to Quicksi Templates!

## 📦 What is a Template?

A template is a reusable code starter that can be reused by other developers. Templates can be:

### Core Types
- Starters — basic project boilerplates to begin development
- Tutorials — guided starters used in courses, blogs, or workshops
- Configurations — pre-configured setups (ESLint, Tailwind, Webpack, etc.)
- Architecture Templates — scalable project structures (MVC, Clean Architecture, Monorepo, etc.)

### Development-Focused Templates
- API Starters — REST, GraphQL, gRPC backends
- Authentication Templates — JWT, OAuth, session-based auth
- Database Setups — Prisma, Sequelize, MongoDB, PostgreSQL configs
- Microservices Templates — service-based architecture setups
- Real-time Apps — WebSockets, Pusher, Socket.io starters

### Frontend & UI Templates
- UI Starters — prebuilt UI layouts or dashboards
- Mobile Starters — React Native, Flutter setups
- Component Libraries — reusable UI components
- Design System Templates — scalable UI systems

### DevOps & Tooling Templates
- Docker Templates — containerized app setups
- CI/CD Templates — GitHub Actions, pipelines
- Deployment Templates — AWS, Vercel, Netlify setups
- Testing Templates — Jest, Vitest, Cypress setups
- CLI Templates — starter CLIs like Quicksi itself

### Advanced & Modern Templates
- AI/ML Starters — OpenAI, embeddings, AI workflows
- Automation Templates — bots, scripts, schedulers
- Integration Templates — Stripe, Firebase, third-party APIs
- Analytics Templates — tracking, logging, monitoring setups

### Learning & Community Templates
- Workshop Templates — for bootcamps, events, hackathons
- Experiment Templates — sandbox environments
- Example Projects — real-world sample apps
- Interview/Practice Templates — coding challenges setups

---

## 🧭 Step-by-step Guide

### 1. Fork the repository

### 2. Clone your fork

```bash
git clone https://github.com/<your-username>/quicksi-templates

```

### 3. Checkout to a new branch from main

```git checkout -b feat/<template-name>```

### 4. Open ``authors.json`` and add yourself as an author

```bash

"<your-github-name>": {
  "name": "<your-fullname/identity-name>",
  "github_username": "<github-name>",
  "avatar": "<your-github-avatar-url>",
  "role": "<your-role>"
}
```

### 5. Add your template

Go to the `templates/` folder and create your template using the correct structure:

```templates/<language>/<framework>/<template-name>/```

--
**Folder Placement Structure**

Place your template inside:

```bash
templates/<language>/<framework>/<template-name>/
```

You can create a folder that best fit the category of your templates.

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

--

**Template Structure**

Each template MUST follow this structure:

```bash
my-template/
├── .meta.json
├── .template.json (optional)[for env and installation requirements]
├── package.json (if applicable)
└── <source files...>
```

**Required: .meta.json**

Every template MUST include:

```bash
{
  "id": "unique-template-id", (search for the name you want to use on https://quicksi.io/id-checker)
  "name": "template-name",
  "description": "Describe what the template does",
  "features": [], (enter the features of the templates)
  "tags": [], (enter searchable words that will make your template findable)
  "author_id": "<github_username>",
  "programming_lang": "<what is the programming language",
  "resource_type": "<what is the resource type, is it a starter, tutorial>"
}

```

**id**
ID must be unique. To make sure your ID has not already been used, please check here on [Quicksi](https://quicksi.io/id-checker) or https://quicksi.io/id-checker
ID must be kebab-case and no spaces. e.g python-django-starter

**Tags** 
Tags helps developers find and search your project.

**Author**
Author helps people identify who created a template. Attach your unique github_username, same one used in author.

**Optional**

```.template.json```

Used for:
- post install message
- setup instructions


**Rules**

Your template must meet the following requirements:

- ✅ Template MUST run without any modification after generation  
- ❌ No TODO comments or unfinished code  
- ❌ No placeholder or dummy code  
- ✅ Must include required dependencies (`package.json` if applicable)  
- ❌ Must NOT include secrets (e.g. `.env`, API keys, credentials)  
- ✅ Template ID must be unique across all templates  
- ✅ Template must be installable and runnable without manual fixes  
- ❌ Do NOT include heavy assets (images, videos, audio, large documents) — use external links instead  
- ❌ Do NOT include generated or unnecessary files such as:
  - `node_modules/`
  - `dist/`
  - `build/`


**Testing**

Before submitting:

Make sure the template:
- Runs without errors
- Installs dependencies (if required)
- Works out-of-the-box

---

### 6. Push and Create a Pull Request

Sample commit message:

```bash
This version:
- fixes grammar  
- adds missing steps (test, commit, push, PR)  
- improves clarity  
- keeps your original structure  
```

**Sample PR title:**

``` bash
feat(template): add react-vite starter
fix(template): update nextjs dependencies
docs(template): improve tutorial README
```


That's it, very simple

---

## 💡 Tips

- Keep templates simple and focused
- Avoid large dependencies unless necessary
- Prefer clean, readable code
