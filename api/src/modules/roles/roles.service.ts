import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../../entities/role.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { CreateRoleDto, validateCreateRoleDto } from "./dto/create-role-dto";
import { UUID } from "../../types/common.types";
import { getPagination, getPagingData } from "../../helpers/pagination.helper";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    // CREATE ROLE
    async createRole(role: CreateRoleDto): Promise<Role> {
        const validatedRole = await validateCreateRoleDto(role);
        return this.roleRepository.save(validatedRole);
    }

    // GET ROLE BY ID
    async getRoleById(id: UUID): Promise<Role> {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) throw new NotFoundException("Role not found");
        return role;
    }

    // FETCH ROLES
    async fetchRoles({
        size,
        page,
        filters,
    }: {
        size: number;
        page: number;
        filters?: Record<string, string>;
    }) {
        const condition: FindOptionsWhere<Role> | FindOptionsWhere<Role>[] = {};

        if (filters) {
            if (filters.name) {
                condition.name = ILike(filters.name);
            }
            if (filters.description) {
                condition.description = ILike(filters.description);
            }
            if (filters.createdById) {
                condition.createdById = filters.createdById;
            }
        }

        const { take, skip } = getPagination({ size, page });
        const roles = await this.roleRepository.findAndCount({ where: condition, take, skip });
        return getPagingData({ data: roles, size, page });
    }
}