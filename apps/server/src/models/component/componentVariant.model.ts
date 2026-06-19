import { ApiProperty } from "@nestjs/swagger";
import { ComponentPropsModel } from "./componentProps.model";
import { ComponentVariantDocument } from "../../schemas/component/componentVariant.schema";

export class ComponentVariantModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  key: string;

  // @ApiProperty({ type: String })
  // name: string;

  @ApiProperty({ type: String })
  order: number;

  @ApiProperty({ type: () => ComponentPropsModel })
  props: ComponentPropsModel;

  constructor({
    variant,
    propsModels,
  }: {
    variant: ComponentVariantDocument;
    propsModels: ComponentPropsModel;
  }) {
    this.id = variant._id.toString();
    this.key = variant.key;
    // this.name = variant.name;
    this.order = variant.order;
    this.props = propsModels;
  }
}
