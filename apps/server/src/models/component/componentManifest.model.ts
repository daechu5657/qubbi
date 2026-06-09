import { ApiProperty } from "@nestjs/swagger";
import { ComponentModel } from "./component.model";
import { ComponentVersionDocument } from "../../schemas/component/componentVersion.schema";

export class ComponentManifestModel {
  @ApiProperty()
  componentVersionId: string;

  @ApiProperty()
  componentVersion: string;

  @ApiProperty()
  components: ComponentModel[];

  constructor({
    componentVersion,
    componentModels,
  }: {
    componentVersion: ComponentVersionDocument;
    componentModels: ComponentModel[];
  }) {
    this.componentVersionId = componentVersion._id.toString();
    this.componentVersion = componentVersion.version;
    this.components = componentModels;
  }
}
