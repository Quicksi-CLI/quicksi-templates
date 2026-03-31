const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "../templates");
const OUTPUT_INDEX = path.join(__dirname, "../template-index.json");
const OUTPUT_AUTHORS = path.join(__dirname, "../authors.json");

const REPO_URL = "https://github.com/Quicksi-CLI/quicksi-templates";

/**
 * 🔥 Get version (source of truth)
 */
function getVersion() {
  const versionFilePath = path.join(__dirname, "../VERSION");

  if (fs.existsSync(versionFilePath)) {
    return fs.readFileSync(versionFilePath, "utf-8").trim();
  }

  return process.env.VERSION || process.env.GITHUB_REF_NAME || "latest";
}

const VERSION = getVersion();

/**
 * Normalize version
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
 * Recursively find templates
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
 * GitHub URL
 */
function getGitHubUrl(relativePath) {
  return `${REPO_URL}/tree/main/templates/${relativePath}`;
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
 * Normalize to array
 */
function normalize(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * MAIN
 */
function run() {
  const now = new Date().toISOString();
  const normalizedVersion = normalizeVersion(VERSION);

  // 🔥 LOAD AUTHORS (SOURCE OF TRUTH)
  const authorsData = loadJSON(OUTPUT_AUTHORS, { authors: {} });
  const authorsMap = authorsData.authors || {};

  const templateFolders = getAllTemplates(TEMPLATES_DIR);

  const templates = [];
  const idSet = new Set();

  for (const folder of templateFolders) {
    const metaPath = path.join(folder, ".meta.json");

    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

      // ✅ VALIDATE ID
      if (!meta.id) throw new Error(`Missing "id"`);
      if (!/^[a-z0-9-]+$/.test(meta.id))
        throw new Error(`Invalid id format: ${meta.id}`);
      if (idSet.has(meta.id))
        throw new Error(`Duplicate id: ${meta.id}`);

      idSet.add(meta.id);

      // ✅ VALIDATE AUTHOR
      if (!meta.author_id) {
        throw new Error(`Missing "author_id" in ${meta.id}`);
      }

      const baseAuthor = authorsMap[meta.author_id];

      if (!baseAuthor) {
        throw new Error(
          `Author "${meta.author_id}" not found in authors.json`
        );
      }

      const author = {
        name: baseAuthor.name,
        github_username: baseAuthor.github_username,
        avatar:
          baseAuthor.avatar ||
          `https://res.cloudinary.com/dvfr0z8wr/image/upload/v1774187729/Quicksi/pattern_brick-wall.png`,
        role: baseAuthor.role || null,
      };

      const relativePath = folder.replace(
        TEMPLATES_DIR + path.sep,
        ""
      );

      const tree = buildTree(folder);

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
        date_created: now,
        version_count: 1, // 🔥 fresh version only
        author,
        tree,
      });

    } catch (err) {
      console.error(`❌ Error in ${metaPath}`);
      console.error(err.message);
      process.exit(1);
    }
  }

  // 🔥 ONLY OUTPUT CURRENT VERSION (NO MERGE HERE)
  const output = {
    versions: {
      [normalizedVersion]: {
        generatedAt: now,
        templates,
      },
    },
  };

  fs.writeFileSync(
    OUTPUT_INDEX,
    JSON.stringify(output, null, 2)
  );

  console.log(`✅ Generated version ${normalizedVersion}`);
}

run();
