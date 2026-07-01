import AdmZip from "adm-zip";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PayloadTooLargeException,
} from "@nestjs/common";
import { BaseService } from "../base/base.service";

class ExtractedZip {
  readonly data: Record<string, Buffer<ArrayBufferLike>>;

  constructor(extractedData: Record<string, Buffer<ArrayBufferLike>>) {
    this.data = extractedData;
  }

  get(name: string) {
    const target = this.data[name];
    if (!target) {
      throw new NotFoundException(`${name} file does not exist.`);
    }

    return target;
  }
}

@Injectable()
export class ZipService extends BaseService {
  private readonly MAX_TOTAL_SIZE = 100 * 1024 * 1024;
  private readonly MAX_FILE_COUNT = 500;
  private readonly MAX_COMPRESSION_RATIO = 100;

  async extract(buffer: Buffer) {
    const zip = this.openZip(buffer);
    const zipEntries = zip.getEntries().filter((entry) => !entry.isDirectory);

    if (zipEntries.length > this.MAX_FILE_COUNT) {
      throw new PayloadTooLargeException("Too many files in zip.");
    }

    let totalUncompressedSize = 0;
    const extractedData: Record<string, Buffer<ArrayBufferLike>> = {};

    for (const entry of zipEntries) {
      const compressedSize = entry.header.compressedSize;
      const uncompressedSize = entry.header.size;

      totalUncompressedSize += uncompressedSize;
      if (totalUncompressedSize > this.MAX_TOTAL_SIZE) {
        throw new PayloadTooLargeException(
          "The total allowed decompression capacity has been exceeded.",
        );
      }

      if (compressedSize > 0) {
        const ratio = uncompressedSize / compressedSize;
        if (ratio > this.MAX_COMPRESSION_RATIO) {
          throw new PayloadTooLargeException(
            "Abnormally high compression ratio (suspected Zip Bomb).",
          );
        }
      }

      const entryName = this.normalizeEntryName(entry.entryName);
      const decompressedBuffer = this.readEntryData(entry);

      if (
        decompressedBuffer.length > uncompressedSize ||
        decompressedBuffer.length > this.MAX_TOTAL_SIZE
      ) {
        throw new BadRequestException(
          "The actual file size differs from the header information.",
        );
      }

      if (extractedData[entryName]) {
        throw new BadRequestException(`Duplicate zip entry: ${entryName}`);
      }

      extractedData[entryName] = decompressedBuffer;
    }

    return new ExtractedZip(extractedData);
  }

  private openZip(buffer: Buffer) {
    try {
      return new AdmZip(buffer);
    } catch {
      throw new BadRequestException("Invalid zip file.");
    }
  }

  private readEntryData(entry: AdmZip.IZipEntry) {
    try {
      return entry.getData();
    } catch {
      throw new BadRequestException(
        `Failed to extract zip entry: ${entry.entryName}`,
      );
    }
  }

  private normalizeEntryName(entryName: string) {
    if (entryName.includes("\0")) {
      throw new BadRequestException("Invalid zip entry path.");
    }

    const normalized = entryName.replaceAll("\\", "/");

    if (
      !normalized ||
      normalized === "." ||
      normalized.startsWith("/") ||
      normalized.startsWith("../") ||
      normalized.includes("/../") ||
      /^[a-zA-Z]:\//.test(normalized)
    ) {
      throw new BadRequestException("Unsafe zip entry path.");
    }

    return normalized;
  }
}
