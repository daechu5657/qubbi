import path from "node:path";
import ts from "typescript";
import { EnumAnalyzer } from "./EnumAnalyzer.js";
import { ModelAnalyzer } from "./ModelAnalyzer.js";
import type { ServerProgramState } from "../structures/ServerProgramState.js";

export namespace ServerProgramAnalyzer {
  export const analyze = ({
    serverRoot,
    tsconfig,
  }: {
    serverRoot: string;
    tsconfig: string;
  }): ServerProgramState => {
    const program = createProgram(path.resolve(serverRoot, tsconfig));
    const checker = program.getTypeChecker();

    const enums = EnumAnalyzer.analyze(program);
    const models = ModelAnalyzer.analyze(program);

    return { enums, models, checker };
  };

  const createProgram = (tsconfigPath: string): ts.Program => {
    const config = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

    if (config.error) {
      throw new Error(
        ts.flattenDiagnosticMessageText(config.error.messageText, "\n"),
      );
    }

    const parsed = ts.parseJsonConfigFileContent(
      config.config,
      ts.sys,
      path.dirname(tsconfigPath),
    );

    return ts.createProgram(parsed.fileNames, {
      ...parsed.options,
      skipLibCheck: true,
    });
  };
}
