import { UUID } from "../types/common.types";
import { AbstractEntity } from "./abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { User } from "./user.entity";
import { RolePermission } from "./rolePermission.entity";

@Entity('roles')
@Unique(['name'])
export class Role extends AbstractEntity {
    // NAME
    @Column({ name: 'name', nullable: false })
    name!: string;

    // DESCRIPTION
    @Column({ name: 'description', nullable: true })
    description: string;

    // CREATED BY ID
    @Column({ name: 'created_by_id', nullable: false })
    createdById: UUID;

    /**
     * RELATIONS
     */

    // CREATED BY
    @ManyToOne(() => User, (user) => user.createdRoles)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: User;

    // PERMISSIONS
    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    permissions: RolePermission[];
}