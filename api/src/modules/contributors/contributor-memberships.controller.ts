import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { ContributorMembershipService } from "./contributor-membership.service";
import { CreateContributorMembershipDto } from "./dto/create-contributor-membership.dto";
import { UUID } from "../../types/common.types";

@Controller("contributor-memberships")
@UseGuards(JwtAuthGuard)
export class ContributorMembershipsController {
  constructor(
    private readonly contributorMembershipService: ContributorMembershipService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateContributorMembershipDto,
    @CurrentUser() user: AuthUser,
  ) {
    const contributorMembership =
      await this.contributorMembershipService.createContributorMembership({
        parentContributorId: dto.parentContributorId,
        memberContributorId: dto.memberContributorId,
        createdById: user.id,
      });

    return {
      message: "Contributor membership created successfully",
      data: contributorMembership,
    };
  }

  @Get()
  async findAll(
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query("parentContributorId") parentContributorId?: UUID,
    @Query("memberContributorId") memberContributorId?: UUID,
  ) {
    const data = await this.contributorMembershipService.fetchContributorMemberships({
      size: Number(size),
      page: Number(page),
      filters: (parentContributorId || memberContributorId) ? { parentContributorId, memberContributorId } : undefined,
    });

    return {
      message: "Contributor memberships fetched successfully",
      data,
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    await this.contributorMembershipService.deleteContributorMembership(id);
  }
}
