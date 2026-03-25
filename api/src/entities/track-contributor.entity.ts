import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import { ContributorRole } from "../constants/contributor.constants";
import { Track } from "./track.entity";
import { Contributor } from "./contributor.entity";
import { User } from "./user.entity";
import { Unique } from "typeorm";

@Entity("track_contributors")
@Unique(["trackId", "contributorId", "role"])
export class TrackContributor extends AbstractEntity {
  // TRACK ID
  @Column({ name: "track_id", type: "uuid", nullable: false })
  trackId!: UUID;

  // CONTRIBUTOR ID
  @Column({ name: "contributor_id", type: "uuid", nullable: false })
  contributorId!: UUID;

  // ROLE
  @Column({
    name: "role",
    type: "enum",
    enum: ContributorRole,
    nullable: false,
  })
  role!: ContributorRole;

  // SEQUENCE NUMBER (display ordering for DDEX)
  @Column({ name: "sequence_number", type: "integer", nullable: true })
  sequenceNumber?: number;

  /**
   * RELATIONS
   */

  // TRACK
  @ManyToOne(() => Track, (track) => track.trackContributors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "track_id" })
  track!: Track;

  // CONTRIBUTOR
  @ManyToOne(() => Contributor, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "contributor_id" })
  contributor!: Contributor;

  // CREATED BY
  @ManyToOne(() => User, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "created_by_id" })
  createdBy!: User;
}
