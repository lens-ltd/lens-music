import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Person } from "./person.entity";
import { User } from "./user.entity";
import { ContributorProfileLinkType, ContributorVerificationStatus } from "../constants/contributor.constants";
import { UUID } from "../types/common.types";
import { UserStatus } from "../constants/user.constants";

@Entity('contributors')
export class Contributor extends Person {
    // DISPLAY NAME
    @Column({ name: 'display_name', type: 'varchar', length: 255, nullable: true })
    displayName?: string;

    // VERIFICATION STATUS
    @Column({ name: 'verification_status', type: 'enum', enum: ContributorVerificationStatus, nullable: false, default: ContributorVerificationStatus.PENDING })
    verificationStatus!: ContributorVerificationStatus;

    // VERIFIED BY ID
    @Column({ name: 'verified_by_id', type: 'uuid', nullable: true })
    verifiedById: UUID;

    // VERIFIED AT
    @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
    verifiedAt: Date;

    // PROFILE LINKS
    @Column({ name: 'profile_links', type: 'jsonb', nullable: true })
    profileLinks?: {
        type: ContributorProfileLinkType;
        url?: string;
    }[];

    // STATUS
    @Column({ name: 'status', type: 'enum', enum: UserStatus, nullable: false, default: UserStatus.ACTIVE })
    status!: UserStatus;

    /**
     * RELATIONS
     */

    // VERIFIED BY
    @ManyToOne(() => User, { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'verified_by_id' })
    verifiedBy: User;
}
