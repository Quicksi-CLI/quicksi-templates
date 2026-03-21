const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "../templates");
const OUTPUT_INDEX = path.join(__dirname, "../template-index.json");
const OUTPUT_AUTHORS = path.join(__dirname, "../authors.json");

const VERSION = process.env.GITHUB_REF_NAME || "latest";
const REPO_URL = "https://github.com/Quicksi-CLI/quicksi-templates";

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
 * Generate GitHub tree URL
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
 * Main
 */
function run() {
  const templateFolders = getAllTemplates(TEMPLATES_DIR);

  const templates = [];
  const authorsMap = {};
  const idSet = new Set();

  for (const folder of templateFolders) {
    const metaPath = path.join(folder, ".meta.json");

    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

      // 🔥 VALIDATE TEMPLATE ID
      if (!meta.id) {
        throw new Error(`Missing "id" in ${metaPath}`);
      }

      if (!/^[a-z0-9-]+$/.test(meta.id)) {
        throw new Error(`Invalid id format: "${meta.id}"`);
      }

      if (idSet.has(meta.id)) {
        throw new Error(`Duplicate template id: "${meta.id}"`);
      }

      idSet.add(meta.id);

      // 🔥 VALIDATE AUTHOR
      if (!meta.author?.github_username) {
        throw new Error(`Missing author.github_username in ${metaPath}`);
      }

      const authorKey = meta.author.github_username;

      // 🔥 ENSURE AUTHOR CONSISTENCY
      if (!authorsMap[authorKey]) {
        authorsMap[authorKey] = {
          name: meta.author.name,
          github_username: authorKey,
          avatar: getAvatar(meta),
          templates: [],
        };
      } else {
        // Prevent mismatch (same username, different name)
        if (authorsMap[authorKey].name !== meta.author.name) {
          throw new Error(
            `Author mismatch for ${authorKey}: inconsistent name`
          );
        }
      }

      // 🔥 attach template to author
      authorsMap[authorKey].templates.push(meta.id);

      // 🔥 relative path
      const relativePath = folder.replace(TEMPLATES_DIR + path.sep, "");

      // 🔥 add template (clean structure)
      templates.push({
        id: meta.id,
        name: meta.name,
        description: meta.description,
        tags: meta.tags || [],
        keywords: meta.keywords || [],
        path: relativePath,
        github_url: getGitHubUrl(relativePath),
        author: {
          github_username: authorKey,
        },
      });

    } catch (err) {
      console.error(`❌ Error in ${metaPath}`);
      console.error(err.message);

      process.exit(1); // 🔥 FAIL CI
    }
  }

  const authors = Object.values(authorsMap);

  // 🔥 WRITE TEMPLATE INDEX
  fs.writeFileSync(
    OUTPUT_INDEX,
    JSON.stringify(
      {
        version: VERSION,
        generatedAt: new Date().toISOString(),
        templates,
      },
      null,
      2
    )
  );

  // 🔥 WRITE AUTHORS
  fs.writeFileSync(
    OUTPUT_AUTHORS,
    JSON.stringify({ authors }, null, 2)
  );

  console.log("✅ Template index and authors generated successfully");
}

run();
