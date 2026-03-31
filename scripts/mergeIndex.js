const fs = require("fs");

// Load generated version (from tag)
const generated = JSON.parse(
  fs.readFileSync("tmp/template-index.json", "utf-8")
);

// Load existing main index
let existing = { versions: {} };

if (fs.existsSync("template-index.json")) {
  existing = JSON.parse(
    fs.readFileSync("template-index.json", "utf-8")
  );
}

// Merge versions (DO NOT overwrite others)
existing.versions = {
  ...existing.versions,
  ...generated.versions,
};

// Sort versions (latest first)
existing.versions = Object.fromEntries(
  Object.entries(existing.versions).sort((a, b) => {
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

// Save back
fs.writeFileSync(
  "template-index.json",
  JSON.stringify(existing, null, 2)
);

console.log("✅ Version merged successfully");