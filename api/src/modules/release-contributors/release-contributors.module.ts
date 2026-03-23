import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReleaseContributor } from "../../entities/release-contributor.entity";
import { Release } from "../../entities/release.entity";
import { Contributor } from "../../entities/contributor.entity";
import { ReleaseContributorsController } from "./release-contributors.controller";
import { ReleaseContributorsService } from "./release-contributors.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReleaseContributor, Release, Contributor])],
  controllers: [ReleaseContributorsController],
  providers: [ReleaseContributorsService],
})
export class ReleaseContributorsModule {}
