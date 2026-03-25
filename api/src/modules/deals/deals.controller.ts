import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  CurrentUser,
  AuthUser,
} from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { DealsService } from "./deals.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";
import { UUID } from "../../types/common.types";

@Controller("releases/:releaseId/deals")
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param("releaseId") releaseId: string,
    @Body() dto: CreateDealDto,
    @CurrentUser() user: AuthUser,
  ) {
    const deal = await this.dealsService.create(
      releaseId as UUID,
      dto,
      user.id,
    );
    return {
      message: "Deal created successfully",
      data: deal,
    };
  }

  @Get()
  async findByReleaseId(@Param("releaseId") releaseId: string) {
    const deals = await this.dealsService.findByReleaseId(releaseId as UUID);
    return {
      message: "Deals fetched successfully",
      data: deals,
    };
  }

  @Patch(":dealId")
  async update(
    @Param("releaseId") releaseId: string,
    @Param("dealId") dealId: string,
    @Body() dto: UpdateDealDto,
  ) {
    const deal = await this.dealsService.update(
      releaseId as UUID,
      dealId as UUID,
      dto,
    );
    return {
      message: "Deal updated successfully",
      data: deal,
    };
  }

  @Delete(":dealId")
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param("releaseId") releaseId: string,
    @Param("dealId") dealId: string,
  ) {
    await this.dealsService.delete(releaseId as UUID, dealId as UUID);
    return { message: "Deal deleted successfully" };
  }
}
