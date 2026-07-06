import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { PERMISSIONS } from "../../constants/permission.constants";
import { AuthUser, CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateRoleDto } from "./dto/create-role.dto";

@Controller("roles")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(PERMISSIONS.CREATE_ROLE)
  async createRole(@Body() dto: CreateRoleDto, @CurrentUser() user: AuthUser) {
    const createdRole = await this.rolesService.createRole({
      ...dto,
      createdById: dto.createdById || user.id,
    });

    return { message: "Role created successfully", data: createdRole };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_ROLE)
  async fetchRoles(
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query() query: Record<string, string>,
  ) {
    const roles = await this.rolesService.fetchRoles({
      size: Number(size),
      page: Number(page),
      filters: query,
    });

    return { message: "Roles returned successfully", data: roles };
  }

  @Get(":id")
  @Permissions(PERMISSIONS.READ_ROLE)
  async getRoleById(@Param("id") id: string) {
    const role = await this.rolesService.getRoleById(id);
    return { message: "Role found successfully", data: role };
  }
}
