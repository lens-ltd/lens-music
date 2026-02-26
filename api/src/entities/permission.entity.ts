import { Column, Entity, OneToMany, Unique } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { RolePermission } from "./rolePermission.entity";

@Entity('permissions')
@Unique(['name'])
export class Permission extends AbstractEntity {
    // NAME
    @Column({ name: 'name', nullable: false })
    name!: string;

    // DESCRIPTION
    @Column({ name: 'description', nullable: true })
    description: string;

    /**
     * RELATIONS
     */

    // ROLES
    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
    roles: RolePermission[];
}
