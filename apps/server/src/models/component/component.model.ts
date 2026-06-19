import { ApiProperty } from "@nestjs/swagger";
import { ComponentPropsModel } from "./componentProps.model";
import { ComponentDocument } from "../../schemas/component/component.schema";
import { ComponentVariantModel } from "./componentVariant.model";

export class ComponentModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  // @ApiProperty({ type: String })
  // tagName: string;

  @ApiProperty({ type: () => ComponentPropsModel })
  props: ComponentPropsModel;

  @ApiProperty({ type: () => [ComponentVariantModel] })
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
    // this.tagName = component.tagName;
    this.props = propsModel;
    this.variants = variantModels;
  }
}
