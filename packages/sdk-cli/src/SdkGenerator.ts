import fs from "node:fs";
import path from "node:path";
import { SdkComposer } from "./generates/SdkComposer.js";
import { AppModuleLoader } from "./utils/AppModuleLoader.js";
import { ConfigLoader } from "./utils/ConfigLoader.js";
import { PackagePathLoader } from "./utils/PackagePathLoader.js";
import { SchemaLoader } from "./utils/SchemaLoader.js";
import { ConfigValidator } from "./validators/ConfigValidator.js";

export namespace SdkGenerator {
  export const generate = async ({
    configFileName = "sdk-cli.json",
  }: {
    configFileName?: string;
  } = {}) => {
    const schema = SchemaLoader.load();
    const config = ConfigLoader.load(configFileName);
    ConfigValidator.validate({ config, schema });

    const generatePath = await PackagePathLoader.load({ config });
    const AppModule = await AppModuleLoader.load({ config });
    const contents = await SdkComposer.compose({ AppModule, config });

    write({ generatePath, contents });
  };

  const write = ({
    generatePath,
    contents,
  }: {
    generatePath: string;
    contents: string;
  }) => {
    const filePath = path.resolve(generatePath, "./src/sdk.ts");

    fs.writeFileSync(filePath, contents);
  };
}
