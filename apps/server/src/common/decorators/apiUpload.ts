import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

export function ApiUpload(fieldName = "file") {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          [fieldName]: {
            type: "string",
            format: "binary",
          },
        },
        required: [fieldName],
      },
    }),
  );
}
