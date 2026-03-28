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
import {
  CurrentUser,
  AuthUser,
} from "../../common/decorators/current-user.decorator";
import { ContributorService } from "./contributors.service";
import { CreateContributorDto } from "./dto/create-contributor.dto";
import { UpdateContributorDto } from "./dto/update-contributor.dto";
import { UUID } from "../../types/common.types";
import { Contributor } from "../../entities/contributor.entity";
import { FindOptionsWhere } from "typeorm";

@Controller("contributors")
@UseGuards(JwtAuthGuard)
export class ContributorsController {
  constructor(private readonly contributorService: ContributorService) {}

  /**
   * Create a contributor
   * @param dto - The data to create the contributor with
   * @param user - The user creating the contributor
   * @returns The created contributor
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    const contributor = await this.contributorService.create(dto, user.id);
    return { message: "Contributor created successfully", data: contributor };
  }

  /**
   * Get all contributors
   * @param size - The number of contributors to return
   * @param page - The page number to return
   * @param parentContributorId - The ID of the parent contributor to filter by
   * @param type - The type of contributor to filter by
   * @param searchKey - The key to search for
   * @param searchName - The name to search for
   * @returns The contributors
   */
  @Get()
  async findAll(
    @Query("size") size = "10",
    @Query("page") page = "0",
    @Query("parentContributorId") parentContributorId?: UUID,
    @Query("type") type?: string,
    @Query("searchKey") searchKey?: string,
    @Query("searchName") searchName?: string,
  ) {
    const condition: FindOptionsWhere<Contributor> = {};
    if (parentContributorId) {
      (condition as Record<string, unknown>).parentContributorId =
        parentContributorId;
    }
    if (type) {
      condition.type = type as Contributor["type"];
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

  /**
   * Get a contributor by ID
   * @param id - The ID of the contributor to get
   * @returns The contributor
   */
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const contributor = await this.contributorService.findOne(id);
    if (!contributor) {
      throw new NotFoundException("Contributor not found");
    }
    return { message: "Contributor fetched successfully", data: contributor };
  }

  /**
   * Update a contributor
   * @param id - The ID of the contributor to update
   * @param dto - The data to update the contributor with
   * @param user - The user updating the contributor
   * @returns The updated contributor
   */
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateContributorDto,
    @CurrentUser() user: AuthUser,
  ) {
    const contributor = await this.contributorService.update(id, dto, user.id);
    return { message: "Contributor updated successfully", data: contributor };
  }

  /**
   * Remove a contributor
   * @param id - The ID of the contributor to remove
   * @returns The removed contributor
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: UUID) {
    await this.contributorService.remove(id);
  }

  /**
   * Verify a contributor
   * @param id - The ID of the contributor to verify
   * @returns The verified contributor
   */
  @Post(":id/verify")
  async verify(@Param("id") id: UUID, @CurrentUser() user: AuthUser) {
    const contributor = await this.contributorService.verify(id, user?.id);
    return { message: "Contributor verified successfully", data: contributor };
  }

  /**
   * Request verification for a contributor
   * @param id - The ID of the contributor to request verification for
   * @returns The requested verification
   */
  @Post(":id/request-verification")
  async requestVerification(@Param("id") id: UUID, @CurrentUser() user: AuthUser) {
    const contributor = await this.contributorService.requestVerification(id, user?.id);
    return { message: "Verification requested successfully", data: contributor };
  }
}
