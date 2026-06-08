import { ApiProperty } from "@nestjs/swagger";
import { ComponentPropsModel } from "./componentProps.model";
import { ComponentDocument } from "../../schemas/component/component.schema";
import { ComponentVariantModel } from "./componentVariant.model";

export class ComponentModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tagName: string;

  @ApiProperty()
  props: ComponentPropsModel;

  @ApiProperty()
  variants: ComponentVariantModel[];

  constructor({
    component,
    propsModel,
    variantModels,
  }: {
    component: ComponentDocument;
    propsModel: ComponentPropsModel;
    variantModels: ComponentVariantModel[];
  }) {
    this.id = component._id.toString();
    this.name = component.name;
    this.tagName = component.tagName;
    this.props = propsModel;
    this.variants = variantModels;
  }
}
