import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrackContributor } from "../../entities/track-contributor.entity";
import { Track } from "../../entities/track.entity";
import { Contributor } from "../../entities/contributor.entity";
import { TrackContributorsController } from "./track-contributors.controller";
import { TrackContributorsService } from "./track-contributors.service";

@Module({
  imports: [TypeOrmModule.forFeature([TrackContributor, Track, Contributor])],
  controllers: [TrackContributorsController],
  providers: [TrackContributorsService],
})
export class TrackContributorsModule {}
