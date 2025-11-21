#!/usr/bin/env node

/**
 * Documentation Commands Test Script
 *
 * Tests commands and instructions in markdown documentation files
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");
const docsDir = join(rootDir, "docs");

// Commands to test (without actually executing them)
const COMMAND_PATTERNS = [
  { pattern: /npm run ([\w:-]+)/g, type: "npm-script", test: testNpmScript },
  { pattern: /npx (\S+)/g, type: "npx-command", test: testNpxCommand },
  { pattern: /eas (\S+)/g, type: "eas-command", test: testEasCommand },
  { pattern: /git (\S+)/g, type: "git-command", test: testGitCommand },
  { pattern: /node (\S+)/g, type: "node-command", test: testNodeCommand },
];

const results = {
  files: [],
  commands: [],
  errors: [],
  warnings: [],
};

function getAllMarkdownFiles(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "node_modules"
      ) {
        files.push(...getAllMarkdownFiles(fullPath));
      } else if (entry.isFile() && extname(entry.name) === ".md") {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }
  return files;
}

function extractCommands(content, filePath) {
  const commands = [];

  // Extract code blocks
  const codeBlockRegex = /```(?:bash|sh|powershell|shell)?\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const codeBlock = match[1];
    const lines = codeBlock.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        for (const cmdPattern of COMMAND_PATTERNS) {
          const cmdMatch = cmdPattern.pattern.exec(trimmed);
          if (cmdMatch) {
            commands.push({
              file: filePath,
              line: trimmed,
              type: cmdPattern.type,
              command: cmdMatch[0],
              test: cmdPattern.test,
            });
            cmdPattern.pattern.lastIndex = 0; // Reset regex
          }
        }
      }
    }
  }

  return commands;
}

function testNpmScript(command) {
  const scriptMatch = command.match(/npm run ([\w:-]+)/);
  if (!scriptMatch) return { valid: false, error: "Invalid npm script format" };

  const scriptName = scriptMatch[1];
  const packageJsonPath = join(rootDir, "package.json");

  if (!existsSync(packageJsonPath)) {
    return { valid: false, error: "package.json not found" };
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    const scripts = packageJson.scripts || {};

    if (scripts[scriptName]) {
      return { valid: true, script: scriptName };
    } else {
      return {
        valid: false,
        error: `Script "${scriptName}" not found in package.json`,
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: `Error reading package.json: ${error.message}`,
    };
  }
}

function testNpxCommand(command) {
  // Basic validation - check if command looks valid
  if (command.match(/npx\s+\S+/)) {
    return { valid: true, note: "npx command format looks valid" };
  }
  return { valid: false, error: "Invalid npx command format" };
}

function testEasCommand(command) {
  // Basic validation - check if command looks valid
  if (command.match(/eas\s+\S+/)) {
    return { valid: true, note: "EAS command format looks valid" };
  }
  return { valid: false, error: "Invalid EAS command format" };
}

function testGitCommand(command) {
  // Basic validation - check if command looks valid
  if (command.match(/git\s+\S+/)) {
    return { valid: true, note: "Git command format looks valid" };
  }
  return { valid: false, error: "Invalid git command format" };
}

function testNodeCommand(command) {
  const nodeMatch = command.match(/node\s+(\S+)/);
  if (!nodeMatch) return { valid: false, error: "Invalid node command format" };

  const scriptPath = nodeMatch[1];
  // Resolve relative paths
  const fullPath = scriptPath.startsWith("/")
    ? scriptPath
    : join(rootDir, scriptPath);

  if (existsSync(fullPath)) {
    return { valid: true, script: scriptPath };
  } else {
    return { valid: false, error: `Script file not found: ${scriptPath}` };
  }
}

function testFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const commands = extractCommands(content, filePath);

    results.files.push({
      path: filePath,
      commandCount: commands.length,
    });

    for (const cmd of commands) {
      const testResult = cmd.test(cmd.command, filePath);

      results.commands.push({
        file: filePath,
        command: cmd.command,
        type: cmd.type,
        ...testResult,
      });

      if (!testResult.valid) {
        results.errors.push({
          file: filePath,
          command: cmd.command,
          error: testResult.error,
        });
      } else if (testResult.note) {
        results.warnings.push({
          file: filePath,
          command: cmd.command,
          note: testResult.note,
        });
      }
    }
  } catch (error) {
    results.errors.push({
      file: filePath,
      error: `Error reading file: ${error.message}`,
    });
  }
}

function generateReport() {
  console.log("\n" + "=".repeat(70));
  console.log("📚 Documentation Commands Test Report");
  console.log("=".repeat(70));

  console.log(`\n📁 Files Scanned: ${results.files.length}`);
  console.log(`🔧 Commands Found: ${results.commands.length}`);
  console.log(
    `✅ Valid Commands: ${results.commands.filter((c) => c.valid).length}`
  );
  console.log(`❌ Invalid Commands: ${results.errors.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  if (results.errors.length > 0) {
    console.log("\n❌ Errors Found:");
    for (const error of results.errors) {
      console.log(`\n  File: ${error.file}`);
      if (error.command) {
        console.log(`  Command: ${error.command}`);
      }
      console.log(`  Error: ${error.error}`);
    }
  }

  if (results.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    for (const warning of results.warnings.slice(0, 10)) {
      console.log(`\n  File: ${warning.file}`);
      console.log(`  Command: ${warning.command}`);
      console.log(`  Note: ${warning.note}`);
    }
    if (results.warnings.length > 10) {
      console.log(`\n  ... and ${results.warnings.length - 10} more warnings`);
    }
  }

  // Summary by file
  console.log("\n📊 Summary by File:");
  const fileStats = {};
  for (const cmd of results.commands) {
    if (!fileStats[cmd.file]) {
      fileStats[cmd.file] = { total: 0, valid: 0, invalid: 0 };
    }
    fileStats[cmd.file].total++;
    if (cmd.valid) {
      fileStats[cmd.file].valid++;
    } else {
      fileStats[cmd.file].invalid++;
    }
  }

  for (const [file, stats] of Object.entries(fileStats)) {
    const status = stats.invalid === 0 ? "✅" : "❌";
    console.log(`  ${status} ${file}: ${stats.valid}/${stats.total} valid`);
  }

  console.log("\n" + "=".repeat(70));

  return results.errors.length === 0;
}

function main() {
  console.log("🔍 Testing Documentation Commands...\n");

  const mdFiles = getAllMarkdownFiles(docsDir);
  console.log(`Found ${mdFiles.length} markdown files\n`);

  for (const file of mdFiles) {
    testFile(file);
  }

  const success = generateReport();
  process.exit(success ? 0 : 1);
}

main();
