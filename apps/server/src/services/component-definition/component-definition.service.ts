import * as Contract from "@qubbi/contract";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { BaseDatabaseService } from "../../common/base/base-database.service";
import {
  Component,
  ComponentSchema,
} from "../../schemas/component/component.schema";
import {
  ComponentVariant,
  ComponentVariantSchema,
} from "../../schemas/component/component-variant.schema";
import {
  ComponentProp,
  ComponentPropSchema,
} from "../../schemas/component/component-prop.schema";
import {
  ComponentStyle,
  ComponentStyleSchema,
} from "../../schemas/component/component-style.schema";
import {
  ComponentBehavior,
  ComponentBehaviorSchema,
} from "../../schemas/component/component-behavior.schema";
import {
  ComponentStyleValue,
  ComponentStyleValueSchema,
} from "../../schemas/component/component-style-value.schema";

type UploadItemResult = {
  name: string;
  componentId: string;
  variants: number;
  baseProps: number;
  overrideProps: number;
};

export type UploadDefinitionsResult = {
  receivedCount: number;
  appliedCount: number;
  items: UploadItemResult[];
};

@Injectable()
export class ComponentDefinitionService extends BaseDatabaseService {
  private get component() {
    return this.mongoContext.model<Component>(Component.name, ComponentSchema);
  }

  private get componentVariant() {
    return this.mongoContext.model<ComponentVariant>(
      ComponentVariant.name,
      ComponentVariantSchema,
    );
  }

  private get componentProp() {
    return this.mongoContext.model<ComponentProp>(
      ComponentProp.name,
      ComponentPropSchema,
    );
  }

  private get componentStyle() {
    return this.mongoContext.model<ComponentStyle>(
      ComponentStyle.name,
      ComponentStyleSchema,
    );
  }

  private get componentStyleValue() {
    return this.mongoContext.model<ComponentStyleValue>(
      ComponentStyleValue.name,
      ComponentStyleValueSchema,
    );
  }

  private get componentBehavior() {
    return this.mongoContext.model<ComponentBehavior>(
      ComponentBehavior.name,
      ComponentBehaviorSchema,
    );
  }

  async uploadDefinitions(
    projectId: string,
    definitions: Contract.Definitions.ComponentDefinition[],
  ): Promise<UploadDefinitionsResult> {
    const projectObjectId = this.toObjectId(projectId, "projectId");
    const normalized = this.normalizeDefinitions(definitions);

    await this.clearProjectComponentData(projectObjectId);

    const items: UploadItemResult[] = [];
    for (const definition of normalized) {
      const item = await this.insertOne(projectObjectId, definition);
      items.push(item);
    }

    return {
      receivedCount: definitions.length,
      appliedCount: normalized.length,
      items,
    };
  }

  private async clearProjectComponentData(projectId: Types.ObjectId) {
    await this.componentStyleValue.deleteMany({ projectId }).exec();
    await this.componentStyle.deleteMany({ projectId }).exec();
    await this.componentBehavior.deleteMany({ projectId }).exec();
    await this.componentProp.deleteMany({ projectId }).exec();
    await this.componentVariant.deleteMany({ projectId }).exec();
    await this.component.deleteMany({ projectId }).exec();
  }

  private async insertOne(
    projectId: Types.ObjectId,
    definition: Contract.Definitions.ComponentDefinition,
  ): Promise<UploadItemResult> {
    const now = new Date();

    if (!definition.variants || definition.variants.length === 0) {
      throw new BadRequestException(
        `component "${definition.name}" must have at least one variant`,
      );
    }

    const componentId = new Types.ObjectId();

    const variantDocs = definition.variants.map((key, order) => ({
      _id: new Types.ObjectId(),
      projectId,
      componentId,
      key,
      name: key,
      order,
      createdTime: now,
      updatedTime: now,
      deletedTime: null,
    }));

    const defaultVariantId = variantDocs[0]._id;

    await this.component.create({
      _id: componentId,
      projectId,
      defaultVariantId,
      name: definition.name,
      tagName: definition.tagName,
      createdTime: now,
      updatedTime: now,
    });

    await this.componentVariant.insertMany(variantDocs);

    const variantIdByKey = new Map<string, Types.ObjectId>();
    for (const variant of variantDocs) {
      variantIdByKey.set(variant.key, variant._id);
    }

    const baseResult = await this.insertProps(
      projectId,
      componentId,
      null,
      definition.baseProps ?? [],
    );

    let overridePropCount = 0;
    for (const variantKey of definition.variants) {
      const variantId = variantIdByKey.get(variantKey);
      if (!variantId) {
        throw new BadRequestException(
          `missing variant id for key: ${variantKey}`,
        );
      }

      const overrideProps = definition.variantOverrides?.[variantKey] ?? [];
      const result = await this.insertProps(
        projectId,
        componentId,
        variantId,
        overrideProps,
      );
      overridePropCount += result.propCount;
    }

    return {
      name: definition.name,
      componentId: componentId.toString(),
      variants: definition.variants.length,
      baseProps: baseResult.propCount,
      overrideProps: overridePropCount,
    };
  }

  private async insertProps(
    projectId: Types.ObjectId,
    componentId: Types.ObjectId,
    variantId: Types.ObjectId | null,
    props: Contract.Definitions.ComponentPropDefinition[],
  ): Promise<{ propCount: number }> {
    const now = new Date();

    for (let order = 0; order < props.length; order++) {
      const prop = props[order];

      const createdProp = await this.componentProp.create({
        projectId,
        componentId,
        variantId,
        kind: prop.kind,
        order,
        createdTime: now,
        updatedTime: now,
        deletedTime: null,
      });

      if (prop.kind === Contract.Enums.ComponentPropKind.Style) {
        if (prop.value.length > 0) {
          await this.componentStyle.insertMany(
            prop.value.map((style) => ({
              projectId,
              propId: createdProp._id,
              key: style.key,
              name: style.name,
              cssProperty: style.cssProperty,
              valueType: style.valueType,
              unit: style.unit ?? null,
              designTokenIds: [],
              createdTime: now,
              updatedTime: now,
              deletedTime: null,
            })),
          );
        }
        continue;
      }

      if (prop.kind === Contract.Enums.ComponentPropKind.Behavior) {
        if (prop.value.length > 0) {
          await this.componentBehavior.insertMany(
            prop.value.map((behavior) => ({
              projectId,
              propId: createdProp._id,
              key: behavior.key,
              createdTime: now,
              updatedTime: now,
              deletedTime: null,
            })),
          );
        }
        continue;
      }

      throw new BadRequestException(`unknown prop kind: ${String(prop)}`);
    }

    return { propCount: props.length };
  }

  private normalizeDefinitions(
    definitions: Contract.Definitions.ComponentDefinition[],
  ): Contract.Definitions.ComponentDefinition[] {
    if (!Array.isArray(definitions)) {
      throw new BadRequestException("definitions must be an array");
    }

    const map = new Map<string, Contract.Definitions.ComponentDefinition>();

    for (const definition of definitions) {
      map.set(definition.name, definition);
    }

    return [...map.values()];
  }

  private toObjectId(value: string, fieldName: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`${fieldName} is not a valid ObjectId`);
    }

    return new Types.ObjectId(value);
  }
}
