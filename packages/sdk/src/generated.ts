import type { AxiosInstance } from "axios";

import type { Properties } from "csstype";

export namespace Models {
  export interface ComponentManifestStyleModel {
    variantKey: string;
    cssProperty: keyof Properties;
    rawValue: string;
  }
  export interface ComponentManifestPartModel {
    tagName: string;
    kind: Enums.ComponentPartKind;
    order: number;
    styles: Models.ComponentManifestStyleModel[];
    children: Models.ComponentManifestPartModel[];
  }
  export interface ComponentManifestStringPropValueModel {
    type: Enums.ComponentPropType.String;
    defaultValue?: string;
  }
  export interface ComponentManifestNumberPropValueModel {
    type: Enums.ComponentPropType.Number;
    defaultValue?: number;
  }
  export interface ComponentManifestBooleanPropValueModel {
    type: Enums.ComponentPropType.Boolean;
    defaultValue?: boolean;
  }
  export interface ComponentManifestStringEnumPropValueModel {
    type: Enums.ComponentPropType.StringEnum;
    values: string[];
    defaultValue?: string;
  }
  export interface ComponentManifestNumberEnumPropValueModel {
    type: Enums.ComponentPropType.NumberEnum;
    values: number[];
    defaultValue?: number;
  }
  export interface ComponentManifestObjectPropValueModel {
    type: Enums.ComponentPropType.Object;
    properties: Models.ComponentManifestPropModel[];
  }
  export interface ComponentManifestStylePropertiesPropValueModel {
    type: Enums.ComponentPropType.StyleProperties;
    defaultValue?: Properties;
  }
  export interface ComponentManifestUnknownPropValueModel {
    type: Enums.ComponentPropType.Unknown;
    rawType?: string;
  }
  export interface ComponentManifestArrayPropValueModel {
    type: Enums.ComponentPropType.Array;
    item:
      | Models.ComponentManifestStringPropValueModel
      | Models.ComponentManifestNumberPropValueModel
      | Models.ComponentManifestBooleanPropValueModel
      | Models.ComponentManifestStringEnumPropValueModel
      | Models.ComponentManifestNumberEnumPropValueModel
      | Models.ComponentManifestObjectPropValueModel
      | Models.ComponentManifestArrayPropValueModel
      | Models.ComponentManifestStylePropertiesPropValueModel
      | Models.ComponentManifestUnknownPropValueModel;
    defaultValue?: unknown[];
  }
  export interface ComponentManifestPropModel {
    key: string;
    required: boolean;
    value:
      | Models.ComponentManifestStringPropValueModel
      | Models.ComponentManifestNumberPropValueModel
      | Models.ComponentManifestBooleanPropValueModel
      | Models.ComponentManifestStringEnumPropValueModel
      | Models.ComponentManifestNumberEnumPropValueModel
      | Models.ComponentManifestObjectPropValueModel
      | Models.ComponentManifestArrayPropValueModel
      | Models.ComponentManifestStylePropertiesPropValueModel
      | Models.ComponentManifestUnknownPropValueModel;
  }
  export interface ComponentManifestVariantModel {
    key: string;
    order: number;
  }
  export interface ComponentManifestModel {
    name: string;
    placementType: Enums.ComponentPlacementType;
    variants: Models.ComponentManifestVariantModel[];
    props: Models.ComponentManifestPropModel[];
    parts: Models.ComponentManifestPartModel[];
  }
  export interface ComponentManifestUploadForm {
    "bundle.zip": File;
  }
  export interface ComponentManifestListQuery {
    keyword?: string[];
    page?: number;
    limit?: number;
  }
  export interface ComponentManifestQueryCases {
    requiredString: string;
    optionalString?: string;
    nullableString: string | null;
    optionalNullableString?: string | null;
    requiredNumber: number;
    optionalNumber?: number;
    requiredBoolean: boolean;
    optionalBoolean?: boolean;
    requiredStringArray: string[];
    optionalStringArray?: string[];
    requiredNumberArray: number[];
    optionalNumberArray?: number[];
    requiredBooleanArray: boolean[];
    optionalBooleanArray?: boolean[];
    literalUnion?: "summary" | "detail";
    enumValue?: Enums.ComponentManifestParameterStatus;
    enumValues?: Enums.ComponentManifestParameterStatus[];
  }
  export interface ComponentManifestUpdateBody {
    manifest: Models.ComponentManifestModel;
  }
  export interface ComponentManifestResponse {
    id: string;
    manifest: Models.ComponentManifestModel;
  }
}

export namespace Enums {
  export enum ComponentPlacementType {
    Standalone = "Standalone",
    Fragment = "Fragment",
  }
  export enum ComponentPartKind {
    Element = "Element",
    Component = "Component",
  }
  export enum ComponentPropType {
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    StringEnum = "StringEnum",
    NumberEnum = "NumberEnum",
    Object = "Object",
    Array = "Array",
    StyleProperties = "StyleProperties",
    Unknown = "Unknown",
  }
  export enum ComponentManifestParameterStatus {
    Draft = "Draft",
    Published = "Published",
    Archived = "Archived",
  }
}

export function createApis(instance: AxiosInstance) {
  return {
    component_lab: {
      component_manifest: {
        list: ({
          query,
        }: {
          query?: {
            keyword?: string[];
            page?: number;
            limit?: number;
          };
        } = {}) =>
          instance.get<Models.ComponentManifestResponse[]>(
            "/component-lab/component-manifest",
            {
              params: {
                ...query,
              },
            },
          ),
        create: ({ body }: { body: Models.ComponentManifestModel }) =>
          instance.post<Models.ComponentManifestResponse>(
            "/component-lab/component-manifest",
            body,
          ),
        getOne: ({
          path,
        }: {
          path: {
            componentId: string;
          };
        }) =>
          instance.get<Models.ComponentManifestResponse>(
            `/component-lab/component-manifest/${encodeURIComponent(String(path["componentId"]))}`,
          ),
        replace: ({
          path,
          body,
        }: {
          path: {
            componentId: string;
          };
          body: Models.ComponentManifestModel;
        }) =>
          instance.put<Models.ComponentManifestResponse>(
            `/component-lab/component-manifest/${encodeURIComponent(String(path["componentId"]))}`,
            body,
          ),
        update: ({
          path,
          body,
        }: {
          path: {
            componentId: string;
          };
          body: Models.ComponentManifestUpdateBody;
        }) =>
          instance.patch<Models.ComponentManifestResponse>(
            `/component-lab/component-manifest/${encodeURIComponent(String(path["componentId"]))}`,
            body,
          ),
        remove: ({
          path,
          query,
        }: {
          path: {
            componentId: string;
          };
          query?: {
            keyword?: string[];
            page?: number;
            limit?: number;
          };
        }) =>
          instance.delete(
            `/component-lab/component-manifest/${encodeURIComponent(String(path["componentId"]))}`,
            {
              params: {
                ...query,
              },
            },
          ),
        path_cases: {
          pathCases: ({
            path,
          }: {
            path: {
              stringId: string;
              numberId: number;
              booleanId: boolean;
              bigintId: number;
              nullableBoolean: null | boolean;
            };
          }) =>
            instance.get(
              `/component-lab/component-manifest/path-cases/${encodeURIComponent(String(path["stringId"]))}/${encodeURIComponent(String(path["numberId"]))}/${encodeURIComponent(String(path["booleanId"]))}/${encodeURIComponent(String(path["bigintId"]))}/${encodeURIComponent(String(path["nullableBoolean"]))}`,
            ),
        },
        path_enum: {
          pathEnum: ({
            path,
          }: {
            path: {
              status: Enums.ComponentManifestParameterStatus;
            };
          }) =>
            instance.get(
              `/component-lab/component-manifest/path-enum/${encodeURIComponent(String(path["status"]))}`,
            ),
        },
        query_cases: {
          queryCases: ({
            query,
          }: {
            query: {
              requiredString: string;
              optionalString?: string;
              nullableString: null | string;
              optionalNullableString?: null | string;
              requiredNumber: number;
              optionalNumber?: number;
              requiredBoolean: boolean;
              optionalBoolean?: boolean;
              requiredStringArray: string[];
              optionalStringArray?: string[];
              requiredNumberArray: number[];
              optionalNumberArray?: number[];
              requiredBooleanArray: boolean[];
              optionalBooleanArray?: boolean[];
              literalUnion?: "summary" | "detail";
              enumValue?: Enums.ComponentManifestParameterStatus;
              enumValues?: Enums.ComponentManifestParameterStatus[];
            };
          }) =>
            instance.get("/component-lab/component-manifest/query-cases", {
              params: {
                ...query,
              },
            }),
        },
        parameter_cases: {
          parameterCases: ({
            path,
            query,
          }: {
            path: {
              componentId: string;
              version: number;
            };
            query: {
              requiredString: string;
              optionalString?: string;
              nullableString: null | string;
              optionalNullableString?: null | string;
              requiredNumber: number;
              optionalNumber?: number;
              requiredBoolean: boolean;
              optionalBoolean?: boolean;
              requiredStringArray: string[];
              optionalStringArray?: string[];
              requiredNumberArray: number[];
              optionalNumberArray?: number[];
              requiredBooleanArray: boolean[];
              optionalBooleanArray?: boolean[];
              literalUnion?: "summary" | "detail";
              enumValue?: Enums.ComponentManifestParameterStatus;
              enumValues?: Enums.ComponentManifestParameterStatus[];
            };
          }) =>
            instance.get(
              `/component-lab/component-manifest/parameter-cases/${encodeURIComponent(String(path["componentId"]))}/${encodeURIComponent(String(path["version"]))}`,
              {
                params: {
                  ...query,
                },
              },
            ),
        },
        upload: ({ body }: { body: Models.ComponentManifestUploadForm }) =>
          instance.post("/component-lab/component-manifest/upload", body),
      },
    },
  };
}
