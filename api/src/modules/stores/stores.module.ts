import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { Store } from '../../entities/store.entity';
import { Release } from '../../entities/release.entity';
import { ReleaseStore } from '../../entities/release-store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, Release, ReleaseStore])],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
