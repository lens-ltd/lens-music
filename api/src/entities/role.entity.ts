import { AbstractEntity } from "./abstract.entity";
import { Column, Entity, OneToMany, Unique } from "typeorm";
import { RolePermission } from "./role-permission.entity";

@Entity('roles')
@Unique(['name'])
export class Role extends AbstractEntity {
    // NAME
    @Column({ name: 'name', nullable: false })
    name!: string;

    // DESCRIPTION
    @Column({ name: 'description', nullable: true })
    description: string;

    /**
     * RELATIONS
     */

    // PERMISSIONS
    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    permissions: RolePermission[];
}
