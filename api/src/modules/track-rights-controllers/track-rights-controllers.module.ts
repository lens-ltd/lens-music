import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TrackRightsController } from "../../entities/track-rights-controller.entity";
import { Track } from "../../entities/track.entity";
import { Contributor } from "../../entities/contributor.entity";
import { Label } from "../../entities/label.entity";
import { TrackRightsControllersController } from "./track-rights-controllers.controller";
import { TrackRightsControllersService } from "./track-rights-controllers.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([TrackRightsController, Track, Contributor, Label]),
  ],
  controllers: [TrackRightsControllersController],
  providers: [TrackRightsControllersService],
})
export class TrackRightsControllersModule {}
