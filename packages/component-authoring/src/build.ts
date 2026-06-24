import { spawn } from "child_process";
import path from "path";

async function build(cwd: string, root: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const command = "tsc";
    const args = ["-p", path.resolve(cwd, `${root}/tsconfig.json`)];

    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`tsc exited with code ${code}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

export { build };
