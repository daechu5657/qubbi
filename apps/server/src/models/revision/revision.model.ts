import { ApiProperty } from "@nestjs/swagger";
import { RevisionDocument } from "../../schemas/revision/revision.schema";
import { RevisionStatus } from "../../enums";

export class RevisionModel {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ nullable: true, type: String })
  parentRevisionId: string | null;

  @ApiProperty({ type: String })
  componentVersionId: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  createdBy: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ enumName: "RevisionStatus", enum: RevisionStatus })
  status: RevisionStatus;

  constructor({ revision }: { revision: RevisionDocument }) {
    this.id = revision._id.toString();
    this.parentRevisionId = revision.parentRevisionId?.toString() ?? null;
    this.componentVersionId = revision.componentVersionId.toString();
    this.name = revision.name;
    this.createdBy = revision.createdBy.toString();
    this.description = revision.description;
    this.status = revision.status;
  }
}
