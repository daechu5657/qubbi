import * as prettier from "prettier";
import ts from "typescript";
import { ModelAnalyzer } from "../analyses/ModelAnalyzer.js";
import { ServerProgramAnalyzer } from "../analyses/ServerProgramAnalyzer.js";
import type { Config } from "../structures/Config.js";
import { ApisFunctionComposer } from "./ApisFunctionComposer.js";
import { DocumentComposer } from "./DocumentComposer.js";
import { AxiosImportProgrammer } from "./internal/AxiosImportProgrammer.js";
import { CssTypeImportProgrammer } from "./internal/CssTypeImportProgrammer.js";
import { EnumNamespaceProgrammer } from "./internal/EnumNamespaceProgrammer.js";
import { ModelNamespaceProgrammer } from "./internal/ModelNamespaceProgrammer.js";
import { SourceFileComposer } from "./internal/SourceFileComposer.js";

const IGNORE_MODEL_NAMES = ["Properties0(string)string"];

export namespace SdkComposer {
  export const compose = async ({
    AppModule,
    config,
    serverRoot = process.cwd(),
    tsconfig = "./tsconfig.json",
  }: {
    AppModule: any;
    config: Config;
    serverRoot?: string;
    tsconfig?: string;
  }): Promise<string> => {
    const document = await DocumentComposer.compose({ AppModule, config });
    const { enums, models, checker } = ServerProgramAnalyzer.analyze({
      serverRoot,
      tsconfig,
    });

    ModelAnalyzer.filter({ document, models, ignore: IGNORE_MODEL_NAMES });

    const apisFunction = ApisFunctionComposer.compose({
      document,
      models,
      enums,
    });

    const sourceFile = SourceFileComposer.compose(
      SourceFileComposer.interleaveNewLines([
        AxiosImportProgrammer.write(),
        CssTypeImportProgrammer.write(),
        ModelNamespaceProgrammer.write({ checker, enums, models }),
        EnumNamespaceProgrammer.write({ enums }),
        apisFunction,
      ]),
    );

    const printer = ts.createPrinter({
      newLine: ts.NewLineKind.LineFeed,
    });

    const code = printer.printFile(sourceFile);

    return prettier.format(code, { parser: "typescript" });
  };
}
