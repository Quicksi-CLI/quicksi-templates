const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "../templates");
const OUTPUT_INDEX = path.join(__dirname, "../template-index.json");
const OUTPUT_AUTHORS = path.join(__dirname, "../authors.json");

const VERSION = process.env.GITHUB_REF_NAME || "latest";
const REPO_URL = "https://github.com/Quicksi-CLI/quicksi-templates";

/**
 * Normalize version (always v1.x.x)
 */
function normalizeVersion(version) {
  if (!version) return "v0.0.0";
  return version.startsWith("v") ? version : `v${version}`;
}

/**
 * Load JSON safely
 */
function loadJSON(filePath, fallback) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return fallback;
}

/**
 * Recursively find all templates
 */
function getAllTemplates(dir) {
  let results = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const full = path.join(dir, item);

    if (fs.statSync(full).isDirectory()) {
      const metaPath = path.join(full, ".meta.json");

      if (fs.existsSync(metaPath)) {
        results.push(full);
      } else {
        results = results.concat(getAllTemplates(full));
      }
    }
  }

  return results;
}

/**
 * Generate GitHub URL
 */
function getGitHubUrl(relativePath) {
  return `${REPO_URL}/tree/main/templates/${relativePath}`;
}

/**
 * Generate avatar
 */
function getAvatar(meta) {
  if (meta.author?.avatar) return meta.author.avatar;

  if (meta.author?.github_username) {
    return `https://github.com/${meta.author.github_username}.png`;
  }

  return null;
}

/**
 * Build file tree
 */
function buildTree(dir) {
  const stats = fs.statSync(dir);

  if (stats.isFile()) {
    return {
      name: path.basename(dir),
      type: "file",
    };
  }

  const children = fs
    .readdirSync(dir)
    .filter((item) => item !== ".meta.json")
    .map((item) => buildTree(path.join(dir, item)));

  return {
    name: path.basename(dir),
    type: "folder",
    children,
  };
}

/**
 * Find existing template
 */
function findExistingTemplate(existingIndex, id) {
  for (const version of Object.values(existingIndex.versions || {})) {
    const found = version.templates.find((t) => t.id === id);
    if (found) return found;
  }
  return null;
}

/**
 * Build version count map
 */
function buildVersionCountMap(existingIndex) {
  const map = {};

  for (const version of Object.values(existingIndex.versions || {})) {
    for (const template of version.templates || []) {
      if (!map[template.id]) {
        map[template.id] = 0;
      }
      map[template.id]++;
    }
  }

  return map;
}

/**
 * Normalize values to array
 */
function normalize(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Sort versions (latest first)
 */
function sortVersions(versionsObj) {
  return Object.fromEntries(
    Object.entries(versionsObj).sort((a, b) => {
      const aParts = a[0].replace("v", "").split(".").map(Number);
      const bParts = b[0].replace("v", "").split(".").map(Number);

      for (let i = 0; i < 3; i++) {
        if (aParts[i] !== bParts[i]) {
          return bParts[i] - aParts[i];
        }
      }

      return 0;
    })
  );
}

/**
 * MAIN
 */
function run() {
  const now = new Date().toISOString();
  const normalizedVersion = normalizeVersion(VERSION);

  const existingIndex = loadJSON(OUTPUT_INDEX, { versions: {} });
  const existingAuthors = loadJSON(OUTPUT_AUTHORS, { authors: [] });

  const authorsMap = {};

  // Load existing authors
  for (const author of existingAuthors.authors) {
    authorsMap[author.github_username] = author;
  }

  const templateVersionCount = buildVersionCountMap(existingIndex);

  const templateFolders = getAllTemplates(TEMPLATES_DIR);

  const templates = [];
  const idSet = new Set();

  for (const folder of templateFolders) {
    const metaPath = path.join(folder, ".meta.json");

    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

      // VALIDATE ID
      if (!meta.id) throw new Error(`Missing "id"`);
      if (!/^[a-z0-9-]+$/.test(meta.id))
        throw new Error(`Invalid id format: ${meta.id}`);
      if (idSet.has(meta.id))
        throw new Error(`Duplicate id: ${meta.id}`);

      idSet.add(meta.id);

      // VALIDATE AUTHOR
      if (!meta.author?.github_username) {
        throw new Error(`Missing author.github_username`);
      }

      const authorKey = meta.author.github_username;

      // HANDLE AUTHOR
      if (!authorsMap[authorKey]) {
        authorsMap[authorKey] = {
          name: meta.author.name,
          role: meta.author.role || null,
          github_username: authorKey,
          avatar: getAvatar(meta),
          date_joined: now,
          templates: [],
        };
      } else {
        authorsMap[authorKey].name =
          meta.author.name || authorsMap[authorKey].name;

        authorsMap[authorKey].role =
          meta.author.role || authorsMap[authorKey].role;

        authorsMap[authorKey].avatar =
          getAvatar(meta) || authorsMap[authorKey].avatar;
      }

      if (!authorsMap[authorKey].templates.includes(meta.id)) {
        authorsMap[authorKey].templates.push(meta.id);
      }

      const relativePath = folder.replace(TEMPLATES_DIR + path.sep, "");

      const existingTemplate = findExistingTemplate(
        existingIndex,
        meta.id
      );

      const date_created = existingTemplate?.date_created || now;

      const version_count =
        (templateVersionCount[meta.id] || 0) + 1;

      const tree = buildTree(folder);

      const { templates: _, ...cleanAuthor } = authorsMap[authorKey];

      templates.push({
        id: meta.id,
        name: meta.name,
        description: meta.description,
        resource_type: normalize(meta.resource_type),
        programming_lang: normalize(meta.programming_lang),
        tags: meta.tags || [],
        path: relativePath,
        github_url: getGitHubUrl(relativePath),
        version: normalizedVersion,
        date_created,
        version_count,
        author: cleanAuthor,
        tree,
      });

    } catch (err) {
      console.error(`❌ Error in ${metaPath}`);
      console.error(err.message);
      process.exit(1);
    }
  }

  // 🔥 MERGE VERSION
  existingIndex.versions = {
    ...(existingIndex.versions || {}),
    [normalizedVersion]: {
      generatedAt: now,
      templates,
    },
  };

  // 🔥 SORT
  existingIndex.versions = sortVersions(existingIndex.versions);

  // SAVE INDEX
  fs.writeFileSync(
    OUTPUT_INDEX,
    JSON.stringify(existingIndex, null, 2)
  );

  // SAVE AUTHORS
  fs.writeFileSync(
    OUTPUT_AUTHORS,
    JSON.stringify(
      { authors: Object.values(authorsMap) },
      null,
      2
    )
  );

  console.log(`✅ Generated version ${normalizedVersion}`);
}

run();
