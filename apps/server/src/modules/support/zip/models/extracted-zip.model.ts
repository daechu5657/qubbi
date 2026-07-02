import { BadRequestException } from "@nestjs/common";

export class ExtractedZipModel {
  readonly data: Record<string, Buffer<ArrayBufferLike>>;

  constructor(extractedData: Record<string, Buffer<ArrayBufferLike>>) {
    this.data = extractedData;
  }

  get(name: string) {
    const target = this.data[name];
    if (!target) {
      throw new BadRequestException(`${name} file does not exist.`);
    }

    return target;
  }
}
