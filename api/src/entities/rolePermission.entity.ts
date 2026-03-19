import { AbstractEntity } from "./abstract.entity";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";
import { UUID } from "../types/common.types";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity('role_permissions')
@Unique(['roleId', 'permissionId'])
export class RolePermission extends AbstractEntity {
    // ROLE ID
    @Column({ name: 'role_id', nullable: false, type: 'uuid' })
    roleId!: UUID;

    // PERMISSION ID
    @Column({ name: 'permission_id', nullable: false, type: 'uuid' })
    permissionId!: UUID;

    /**
     * RELATIONS
     */

    // ROLE
    @ManyToOne(() => Role, (role) => role.permissions)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    // PERMISSION
    @ManyToOne(() => Permission, (permission) => permission.roles)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}
