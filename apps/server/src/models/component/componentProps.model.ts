import { ApiProperty } from "@nestjs/swagger";
import { ComponentStyleModel } from "./componentStyle.model";

export class ComponentPropsModel {
  @ApiProperty()
  style: ComponentStyleModel[];

  // attributes: [];
  // state: [];
  // slots: [];
  // accessibility: [];
  // data: [];
  // events: [];

  constructor({ styleModels }: { styleModels: ComponentStyleModel[] }) {
    this.style = styleModels;
  }
}
