import { ComponentManifestUploadService } from "../../../applications/component-manifest-upload/component-manifest-upload.service";
import {
  EditorController,
  ComponentLabController,
} from "../../../../shared/decorators/controller.decorator";
import multer from "multer";
import {
  TypedBody,
  TypedFormData,
  TypedParam,
  TypedQuery,
  TypedRoute,
} from "@nestia/core";
import { ComponentManifestModel } from "../../../domains/component-manifest/models/component-manifest.model";

@EditorController("component-manifest")
class EditorComponentManifestController {}

class ComponentManifestUploadForm {
  "bundle.zip"!: File;
}

class ComponentManifestListQuery {
  keyword?: string[];
  page?: number;
  limit?: number;
}

class ComponentManifestQueryCases {
  requiredString!: string;
  optionalString?: string;
  nullableString!: string | null;
  optionalNullableString?: string | null;
  requiredNumber!: number;
  optionalNumber?: number;
  requiredBoolean!: boolean;
  optionalBoolean?: boolean;
  requiredStringArray!: string[];
  optionalStringArray?: string[];
  requiredNumberArray!: number[];
  optionalNumberArray?: number[];
  requiredBooleanArray!: boolean[];
  optionalBooleanArray?: boolean[];
  literalUnion?: "summary" | "detail";
  enumValue?: ComponentManifestParameterStatus;
  enumValues?: ComponentManifestParameterStatus[];
}

class ComponentManifestPathParams {
  componentId!: string;
}

class ComponentManifestUpdateBody {
  manifest!: ComponentManifestModel;
}

class ComponentManifestResponse {
  id!: string;
  manifest!: ComponentManifestModel;
}

enum ComponentManifestParameterStatus {
  Draft = "Draft",
  Published = "Published",
  Archived = "Archived",
}

@ComponentLabController("component-manifest")
class ComponentLabComponentManifestController {
  constructor(
    private readonly componentManifestUploadService: ComponentManifestUploadService,
  ) {}

  // GET: query only
  @TypedRoute.Get()
  async list(
    @TypedQuery()
    query: ComponentManifestListQuery,
  ): Promise<ComponentManifestResponse[]> {
    return [];
  }

  // GET: path params
  @TypedRoute.Get(":componentId")
  async getOne(
    @TypedParam("componentId")
    componentId: string,
  ): Promise<ComponentManifestResponse> {
    return {
      id: componentId,
      manifest: {} as ComponentManifestModel,
    };
  }

  // GET: path primitive cases
  @TypedRoute.Get(
    "path-cases/:stringId/:numberId/:booleanId/:bigintId/:nullableBoolean",
  )
  async pathCases(
    @TypedParam("stringId")
    stringId: string,
    @TypedParam("numberId")
    numberId: number,
    @TypedParam("booleanId")
    booleanId: boolean,
    @TypedParam("bigintId")
    bigintId: bigint,
    @TypedParam("nullableBoolean")
    nullableBoolean: boolean | null,
  ): Promise<void> {
    void stringId;
    void numberId;
    void booleanId;
    void bigintId;
    void nullableBoolean;
  }

  // GET: path enum
  @TypedRoute.Get("path-enum/:status")
  async pathEnum(
    @TypedParam("status")
    status: ComponentManifestParameterStatus,
  ): Promise<void> {
    void status;
  }

  // GET: query primitive/array/nullable/literal cases
  @TypedRoute.Get("query-cases")
  async queryCases(
    @TypedQuery()
    query: ComponentManifestQueryCases,
  ): Promise<void> {
    void query;
  }

  // GET: path + query
  @TypedRoute.Get("parameter-cases/:componentId/:version")
  async parameterCases(
    @TypedParam("componentId")
    componentId: string,
    @TypedParam("version")
    version: number,
    @TypedQuery()
    query: ComponentManifestQueryCases,
  ): Promise<void> {
    void componentId;
    void version;
    void query;
  }

  // POST: body
  @TypedRoute.Post()
  async create(
    @TypedBody()
    body: ComponentManifestModel,
  ): Promise<ComponentManifestResponse> {
    return {
      id: "created",
      manifest: body,
    };
  }

  // POST: multipart/form-data
  @TypedRoute.Post("upload")
  async upload(
    @TypedFormData.Body(() => multer())
    form: ComponentManifestUploadForm,
  ): Promise<void> {
    const buffer = Buffer.from(await form["bundle.zip"].arrayBuffer());
    await this.componentManifestUploadService.upload(buffer);
  }

  // PUT: path + body
  @TypedRoute.Put(":componentId")
  async replace(
    @TypedParam("componentId")
    componentId: string,
    @TypedBody()
    body: ComponentManifestModel,
  ): Promise<ComponentManifestResponse> {
    return {
      id: componentId,
      manifest: body,
    };
  }

  // PATCH: path + body
  @TypedRoute.Patch(":componentId")
  async update(
    @TypedParam("componentId")
    componentId: string,
    @TypedBody()
    body: ComponentManifestUpdateBody,
  ): Promise<ComponentManifestResponse> {
    return {
      id: componentId,
      manifest: body.manifest,
    };
  }

  // DELETE: path + query
  @TypedRoute.Delete(":componentId")
  async remove(
    @TypedParam("componentId")
    componentId: string,
    @TypedQuery()
    query: ComponentManifestListQuery,
  ): Promise<void> {
    void componentId;
    void query;
  }
}

export default [
  EditorComponentManifestController,
  ComponentLabComponentManifestController,
];
