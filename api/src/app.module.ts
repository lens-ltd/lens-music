import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LabelsModule } from './modules/labels/labels.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { ReleasesModule } from './modules/releases/releases.module';
import { LyricsModule } from './modules/lyrics/lyrics.module';
import { RolesModule } from './modules/roles/roles.module';

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
    ArtistsModule,
    ReleasesModule,
    LyricsModule,
    RolesModule,
  ],
})
export class AppModule {}
