import { ApiProperty } from "@nestjs/swagger";
import { RevisionDocument } from "../../schemas/revision/revision.schema";
import { RevisionStatus } from "../../enums";

export class RevisionModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  parentRevisionId: string | null;

  @ApiProperty()
  componentVersionId: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: RevisionStatus;

  constructor({ revision }: { revision: RevisionDocument }) {
    this.id = revision._id.toString();
    this.parentRevisionId = revision.parentRevisionId?.toString() ?? null;
    this.componentVersionId = revision.componentVersionId.toString();
    this.createdBy = revision.createdBy.toString();
    this.description = revision.description;
    this.status = revision.status;
  }
}
