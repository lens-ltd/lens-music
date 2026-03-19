import { Column, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UUID } from "../types/common.types";
import { ContributorRole } from "../constants/contributor.constants";
import { User } from "./user.entity";
import { Release } from "./release.entity";
import { Contributor } from "./contributor.entity";

export class ReleaseContributor extends AbstractEntity {
    // RELEASE ID
    @Column({ name: 'release_id', type: 'uuid', nullable: false })
    releaseId!: UUID;

    // CONTRIBUTOR ID
    @Column({ name: 'contributor_id', type: 'uuid', nullable: false })
    contributorId!: UUID;

    // ROLE
    @Column({ name: 'role', type: 'enum', enum: ContributorRole, nullable: false })
    role!: ContributorRole;

    // CREATED BY ID
    @Column({ name: 'created_by_id', nullable: true, type: 'uuid' })
    createdById: UUID;

    /**
     * RELATIONS
     */

    // RELEASE
    @ManyToOne(() => Release, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'release_id' })
    release: Release;

    // CONTRIBUTOR
    @ManyToOne(() => Contributor, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'contributor_id' })
    contributor: Contributor;

    // CREATED BY
    @ManyToOne(() => User, { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'created_by_id' })
    createdBy: User;
}