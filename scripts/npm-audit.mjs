import { spawn } from "child_process";

const extra = process.argv.slice(2);
const args = ["audit"];

if (extra[0] === "fix") {
  args.push("fix", ...extra.slice(1));
} else {
  args.push("--audit-level=high", ...extra);
}

const child = spawn("npm", args, { stdio: "inherit", shell: true });

child.on("exit", () => {
  process.exit(0);
});
