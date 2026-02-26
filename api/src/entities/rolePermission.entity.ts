import { AbstractEntity } from "./abstract.entity";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { UUID } from "../types/common.types";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./user.entity";

@Entity('role_permissions')
@Unique(['roleId', 'permissionId'])
export class RolePermission extends AbstractEntity {
    // ROLE ID
    @Column({ name: 'role_id', nullable: false })
    roleId!: UUID;

    // PERMISSION ID
    @Column({ name: 'permission_id', nullable: false })
    permissionId!: UUID;

    // ROLE
    @ManyToOne(() => Role, (role) => role.permissions)
    role: Role;

    // PERMISSION
    @ManyToOne(() => Permission, (permission) => permission.roles)
    permission: Permission;

    // CREATED BY ID
    @Column({ name: 'created_by_id', nullable: true })
    createdById: UUID;

    /**
     * RELATIONS
     */

    // CREATED BY
    @ManyToOne(() => User, (user) => user.createdRolePermissions)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: User;
}
