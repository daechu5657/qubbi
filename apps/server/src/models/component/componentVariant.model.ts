import { ApiProperty } from "@nestjs/swagger";
import { ComponentPropsModel } from "./componentProps.model";
import { ComponentVariantDocument } from "../../schemas/component/component-variant.schema";

export class ComponentVariantModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;

  @ApiProperty()
  props: ComponentPropsModel;

  constructor({
    varaint,
    propsModels,
  }: {
    varaint: ComponentVariantDocument;
    propsModels: ComponentPropsModel;
  }) {
    this.id = varaint._id.toString();
    this.key = varaint.key;
    this.name = varaint.name;
    this.order = varaint.order;
    this.props = propsModels;
  }
}
