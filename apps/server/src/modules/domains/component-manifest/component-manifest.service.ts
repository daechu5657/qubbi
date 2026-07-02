import { Injectable } from "@nestjs/common";

@Injectable()
export class ComponentManifestService {
  constructor() {}

  async validate() {
    // { components, files, generatedAt, extractedZip }
    // model: ComponentManifestUploadModel,
    // extractedData: Record<string, Buffer>,
    // TODO:
    // uploadModel이랑 extractedData랑 같이 비교해서 일치하면 ok
    //   uploadModel -> component name list 추출
    // - 필요한 dist 파일 목록 계산
    // - zip entries에 필요한 파일이 있는지 검증
  }

  async upload() {
    //model: ComponentManifestUploadModel
  }
}
