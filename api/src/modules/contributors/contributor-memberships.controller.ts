import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { ContributorMembershipService } from "./contributor-membership.service";
import { CreateContributorMembershipDto } from "./dto/create-contributor-membership.dto";

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
}
