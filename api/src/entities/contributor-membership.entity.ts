import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UUID } from "../types/common.types";
import { AbstractEntity } from "./abstract.entity";
import { Contributor } from "./contributor.entity";

@Entity("contributor_memberships")
export class ContributorMembership extends AbstractEntity {
  // PARENT CONTRIBUTOR ID
  @Column({ name: "parent_contributor_id", type: "uuid", nullable: false })
  parentContributorId!: UUID;

  // MEMBER CONTRIBUTOR ID
  @Column({ name: "member_contributor_id", type: "uuid", nullable: false })
  memberContributorId!: UUID;

  // PARENT CONTRIBUTOR
  @ManyToOne(
    () => Contributor,
    (contributor) => contributor.parentMemberships,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn({ name: "parent_contributor_id" })
  parentContributor: Contributor;

  // MEMBER CONTRIBUTOR
  @ManyToOne(
    () => Contributor,
    (contributor) => contributor.childMemberships,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn({ name: "member_contributor_id" })
  memberContributor: Contributor;
}
