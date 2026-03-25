import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import { RightType } from "../constants/ddex.constants";
import { Track } from "./track.entity";
import { Contributor } from "./contributor.entity";
import { Label } from "./label.entity";

@Entity("track_rights_controllers")
export class TrackRightsController extends AbstractEntity {
  // TRACK ID
  @Column({ name: "track_id", type: "uuid", nullable: false })
  trackId!: UUID;

  // CONTRIBUTOR ID (nullable — can link to contributor or label or use controllerName)
  @Column({ name: "contributor_id", type: "uuid", nullable: true })
  contributorId?: UUID;

  // LABEL ID (nullable)
  @Column({ name: "label_id", type: "uuid", nullable: true })
  labelId?: UUID;

  // CONTROLLER NAME (fallback name if not linked to contributor/label)
  @Column({ name: "controller_name", type: "varchar", length: 255, nullable: false })
  controllerName!: string;

  // RIGHT TYPE
  @Column({
    name: "right_type",
    type: "enum",
    enum: RightType,
    nullable: false,
  })
  rightType!: RightType;

  // TERRITORIES (ISO 3166-1 alpha-2 codes)
  @Column({
    name: "territories",
    type: "jsonb",
    nullable: false,
    default: () => "'[]'",
  })
  territories!: string[];

  // RIGHT SHARE PERCENTAGE
  @Column({ name: "right_share_percentage", type: "numeric", precision: 5, scale: 2, nullable: true })
  rightSharePercentage?: string;

  // DELEGATED USAGE RIGHTS
  @Column({ name: "delegated_usage_rights", type: "jsonb", nullable: true })
  delegatedUsageRights?: Record<string, unknown>;

  /**
   * RELATIONS
   */

  // TRACK
  @ManyToOne(() => Track, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "track_id" })
  track!: Track;

  // CONTRIBUTOR (nullable)
  @ManyToOne(() => Contributor, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "contributor_id" })
  contributor?: Contributor;

  // LABEL (nullable)
  @ManyToOne(() => Label, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "label_id" })
  label?: Label;
}
