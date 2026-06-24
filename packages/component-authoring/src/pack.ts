import path from "path";
import * as fs from "node:fs";
import { ZipArchive } from "archiver";

function pack(cwd: string, root: string) {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(
      path.resolve(cwd, "public/component-package.zip"),
    );

    const archive = new ZipArchive({
      zlib: { level: 9 },
    });

    output.on("close", function () {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "archiver has been finalized and the output file descriptor has closed.",
      );
      resolve();
    });

    archive.on("error", function (err) {
      reject(err);
    });

    archive.pipe(output);

    archive.directory(path.resolve(cwd, root, "dist"), "dist");

    archive.file(path.resolve(cwd, root, "componentManifest.json"), {
      name: "componentManifest.json",
    });

    archive.finalize();
  });
}

export { pack };
