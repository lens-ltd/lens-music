import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import { ReleaseLabelType } from "../constants/release-label.constants";
import { Release } from "./release.entity";
import { Label } from "./label.entity";

@Entity("release_labels")
@Unique(["releaseId", "labelId"])
export class ReleaseLabel extends AbstractEntity {
  // RELEASE ID
  @Column({ name: "release_id", type: "uuid", nullable: false })
  releaseId!: UUID;

  // LABEL ID
  @Column({ name: "label_id", type: "uuid", nullable: false })
  labelId!: UUID;

  // TYPE (PRIMARY or SECONDARY)
  @Column({
    name: "type",
    type: "enum",
    enum: ReleaseLabelType,
    nullable: false,
    default: ReleaseLabelType.PRIMARY,
  })
  type!: ReleaseLabelType;

  // OWNERSHIP (describes ownership stake or rights context)
  @Column({ name: "ownership", type: "varchar", length: 255, nullable: true })
  ownership?: string;

  /**
   * RELATIONS
   */

  // RELEASE
  @ManyToOne(() => Release, (release) => release.releaseLabels, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "release_id" })
  release!: Release;

  // LABEL
  @ManyToOne(() => Label, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "label_id" })
  label!: Label;
}
