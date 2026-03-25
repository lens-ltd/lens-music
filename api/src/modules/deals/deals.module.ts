import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Deal } from "../../entities/deal.entity";
import { Release } from "../../entities/release.entity";
import { Store } from "../../entities/store.entity";
import { DealsController } from "./deals.controller";
import { DealsService } from "./deals.service";

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Release, Store])],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
