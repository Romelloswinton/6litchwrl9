import * as fs from "fs"
import * as path from "path"

// --- Configuration ---
const config = {
  rootPath: ".", // Start from the current directory
  maxDepth: 4, // How many levels deep to scan
  ignore: [
    // Folders/files to ignore
    "node_modules",
    ".git",
    "dist",
    "build",
    ".vite",
    "package-lock.json",
    "printTree.mjs", // Ignore this script itself
  ],
}
// ---------------------

/**
 * Recursively builds the file tree string
 */
function buildTree(
  currentPath,
  maxDepth,
  ignore,
  currentDepth = 0,
  prefix = ""
) {
  if (currentDepth > maxDepth) {
    return prefix + "...\n"
  }

  let treeString = ""
  let entries

  try {
    entries = fs
      .readdirSync(currentPath, { withFileTypes: true })
      .filter((entry) => !ignore.includes(entry.name))
  } catch (error) {
    return `${prefix}[Error: ${error.message}]\n`
  }

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1
    const linePrefix = prefix + (isLast ? "└── " : "├── ")
    const childPrefix = prefix + (isLast ? "    " : "│   ")

    treeString +=
      linePrefix + entry.name + (entry.isDirectory() ? "/" : "") + "\n"

    if (entry.isDirectory()) {
      const nextPath = path.join(currentPath, entry.name)
      treeString += buildTree(
        nextPath,
        maxDepth,
        ignore,
        currentDepth + 1,
        childPrefix
      )
    }
  })

  return treeString
}

// --- Execute ---
const rootDir = path.resolve(config.rootPath)
console.log(`File structure for: ${rootDir}\n`)
const tree = buildTree(rootDir, config.maxDepth, config.ignore)
console.log(tree)
