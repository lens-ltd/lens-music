import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LabelsModule } from './modules/labels/labels.module';
import { ReleasesModule } from './modules/releases/releases.module';
import { LyricsModule } from './modules/lyrics/lyrics.module';
import { RolesModule } from './modules/roles/roles.module';
import { StaticReleaseNavigationModule } from './modules/static-release-navigation/static-release-navigation.module';
import { ReleaseNavigationFlowsModule } from './modules/release-navigation-flows/release-navigation-flows.module';
import { ContributorsModule } from './modules/contributors/contributors.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { TrackContributorsModule } from './modules/track-contributors/track-contributors.module';
import { ReleaseContributorsModule } from './modules/release-contributors/release-contributors.module';
import { GenresModule } from './modules/genres/genres.module';
import { StoresModule } from './modules/stores/stores.module';
import { ReleaseLabelsModule } from './modules/release-labels/release-labels.module';
import { DealsModule } from './modules/deals/deals.module';
import { TrackRightsControllersModule } from './modules/track-rights-controllers/track-rights-controllers.module';
import { ReleaseTerritoryDetailsModule } from './modules/release-territory-details/release-territory-details.module';
import { RelatedReleasesModule } from './modules/related-releases/related-releases.module';
import { DdexModule } from './modules/ddex/ddex.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1w' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      entities: [`${__dirname}/**/entities/*.{ts,js}`],
      migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
      ssl: ['localhost', '127.0.0.1', '/var/run/postgresql'].includes(
        process.env.DB_HOST || ''
      )
        ? false
        : { rejectUnauthorized: false },
    }),
    AuthModule,
    UsersModule,
    LabelsModule,
    ReleasesModule,
    LyricsModule,
    RolesModule,
    StaticReleaseNavigationModule,
    ReleaseNavigationFlowsModule,
    ContributorsModule,
    TracksModule,
    TrackContributorsModule,
    ReleaseContributorsModule,
    GenresModule,
    StoresModule,
    ReleaseLabelsModule,
    DealsModule,
    TrackRightsControllersModule,
    ReleaseTerritoryDetailsModule,
    RelatedReleasesModule,
    DdexModule,
  ],
})
export class AppModule {}
