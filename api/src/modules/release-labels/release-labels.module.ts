import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReleaseLabel } from "../../entities/release-label.entity";
import { Release } from "../../entities/release.entity";
import { Label } from "../../entities/label.entity";
import { ReleaseLabelsController } from "./release-labels.controller";
import { ReleaseLabelsService } from "./release-labels.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReleaseLabel, Release, Label])],
  controllers: [ReleaseLabelsController],
  providers: [ReleaseLabelsService],
})
export class ReleaseLabelsModule {}
