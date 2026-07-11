import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PermissionsGuard } from "../../common/guards/permissions.guard";
import { Permissions } from "../../common/decorators/permissions.decorator";
import { PERMISSIONS } from "../../constants/permission.constants";
import {
  CurrentUser,
  AuthUser,
} from "../../common/decorators/current-user.decorator";
import { ContributorService } from "./contributors.service";
import { CreateContributorDto } from "./dto/create-contributor.dto";
import { UpdateContributorDto } from "./dto/update-contributor.dto";
import { RejectContributorDto } from "./dto/reject-contributor.dto";
import { AssignContributorManagerDto } from "./dto/assign-contributor-manager.dto";
import { UUID } from "../../types/common.types";
import { Contributor } from "../../entities/contributor.entity";
import { FindOptionsWhere, In } from "typeorm";
import { ContributorVerificationStatus } from "../../constants/contributor.constants";

@Controller("contributors")
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ContributorsController {
  constructor(private readonly contributorService: ContributorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.CREATE_CONTRIBUTOR)
  async create(
    @Body() dto: CreateContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    const contributor = await this.contributorService.create(dto, user.id);
    return { message: "Contributor created successfully", data: contributor };
  }

  @Get()
  @Permissions(PERMISSIONS.READ_CONTRIBUTOR)
  async findAll(
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query("parentContributorId") parentContributorId?: UUID,
    @Query("type") type?: string,
    @Query("searchKey") searchKey?: string,
    @Query("searchName") searchName?: string,
    @Query("verificationStatus") verificationStatus?: string,
  ) {
    const condition: FindOptionsWhere<Contributor> = {};
    if (parentContributorId) {
      (condition as Record<string, unknown>).parentContributorId =
        parentContributorId;
    }
    if (type) {
      condition.type = type as Contributor["type"];
    }
    if (verificationStatus) {
      const statuses = verificationStatus
        .split(",")
        .map((value) => value.trim())
        .filter((value): value is ContributorVerificationStatus =>
          Object.values(ContributorVerificationStatus).includes(
            value as ContributorVerificationStatus,
          ),
        );
      if (statuses.length === 1) {
        condition.verificationStatus = statuses[0];
      } else if (statuses.length > 1) {
        condition.verificationStatus = In(statuses);
      }
    }
    const data = await this.contributorService.findAll({
      size: Number(size),
      page: Number(page),
      condition: Object.keys(condition).length > 0 ? condition : undefined,
      searchKey,
      searchName,
    });
    return { message: "Contributors fetched successfully", data };
  }

  @Get(":id/managers")
  @Permissions(PERMISSIONS.ASSIGN_CONTRIBUTOR_MANAGER)
  async listManagers(@Param("id") id: string) {
    const managers = await this.contributorService.listManagers(id);
    return {
      message: "Contributor managers fetched successfully",
      data: managers,
    };
  }

  @Post(":id/managers")
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PERMISSIONS.ASSIGN_CONTRIBUTOR_MANAGER)
  async assignManager(
    @Param("id") id: string,
    @Body() dto: AssignContributorManagerDto,
    @CurrentUser() user: AuthUser,
  ) {
    const manager = await this.contributorService.assignManager(
      id,
      dto.userId,
      user.id,
    );
    return {
      message: "Contributor manager assigned successfully",
      data: manager,
    };
  }

  @Delete(":id/managers/:userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PERMISSIONS.ASSIGN_CONTRIBUTOR_MANAGER)
  async unassignManager(
    @Param("id") id: string,
    @Param("userId") userId: string,
  ) {
    await this.contributorService.unassignManager(id, userId);
  }

  @Get(":id")
  @Permissions(PERMISSIONS.READ_CONTRIBUTOR)
  async findOne(
    @Param("id") id: string,
    @CurrentUser() user: AuthUser,
  ) {
    const contributor = await this.contributorService.findOne(id, user);
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }
    return { message: "Contributor fetched successfully", data: contributor };
  }

  @Patch(":id")
  @Permissions(PERMISSIONS.UPDATE_CONTRIBUTOR)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    const contributor = await this.contributorService.update(
      id,
      dto,
      user.id,
      user,
    );
    return { message: "Contributor updated successfully", data: contributor };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(PERMISSIONS.DELETE_CONTRIBUTOR)
  async remove(
    @Param("id") id: UUID,
    @CurrentUser() user: AuthUser,
  ) {
    await this.contributorService.remove(id, user);
  }

  @Post(":id/verify")
  @Permissions(PERMISSIONS.VERIFY_CONTRIBUTOR)
  async verify(@Param("id") id: UUID, @CurrentUser() user: AuthUser) {
    const contributor = await this.contributorService.verify(
      id,
      user?.id,
      user,
    );
    return { message: "Contributor verified successfully", data: contributor };
  }

  @Post(":id/reject")
  @Permissions(PERMISSIONS.VERIFY_CONTRIBUTOR)
  async reject(
    @Param("id") id: UUID,
    @Body() dto: RejectContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    const contributor = await this.contributorService.reject(
      id,
      user?.id,
      dto,
      user,
    );
    return { message: "Contributor verification rejected", data: contributor };
  }

  @Post(":id/request-verification")
  @Permissions(PERMISSIONS.UPDATE_CONTRIBUTOR)
  async requestVerification(
    @Param("id") id: UUID,
    @CurrentUser() user: AuthUser,
  ) {
    const contributor = await this.contributorService.requestVerification(
      id,
      user?.id,
      user,
    );
    return {
      message: "Verification requested successfully",
      data: contributor,
    };
  }
}
