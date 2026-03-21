const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "../templates");
const OUTPUT_INDEX = path.join(__dirname, "../template-index.json");
const OUTPUT_AUTHORS = path.join(__dirname, "../authors.json");

/**
 * Recursively find all template folders with .meta.json
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
 * Main
 */
function run() {
  const templateFolders = getAllTemplates(TEMPLATES_DIR);

  const templates = [];
  const authorsMap = {};

  for (const folder of templateFolders) {
    try {
      const metaPath = path.join(folder, ".meta.json");
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

      // 🔥 add template
      templates.push({
        ...meta,
        path: folder.replace(TEMPLATES_DIR + path.sep, ""),
      });

      // 🔥 group authors
      if (meta.author?.name) {
        const key = meta.author.github_username || meta.author.name;

        if (!authorsMap[key]) {
          authorsMap[key] = {
            name: meta.author.name,
            github_username: meta.author.github_username,
            templates: [],
          };
        }

        authorsMap[key].templates.push(meta.id);
      }
    } catch (err) {
      console.warn(`⚠️ Failed to process ${folder}`);
    }
  }

  const authors = Object.values(authorsMap);

  fs.writeFileSync(
    OUTPUT_INDEX,
    JSON.stringify({ templates }, null, 2)
  );

  fs.writeFileSync(
    OUTPUT_AUTHORS,
    JSON.stringify({ authors }, null, 2)
  );

  console.log("✅ Index generated");
}

run();
