import {
  Controller,
  Post,
  Param,
  Query,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DdexErnGeneratorService } from './ddex-ern-generator.service';

@Controller('releases/:releaseId/ddex')
@UseGuards(JwtAuthGuard)
export class DdexErnGeneratorController {
  constructor(private readonly ernGeneratorService: DdexErnGeneratorService) {}

  @Post('ern')
  @HttpCode(HttpStatus.OK)
  async generateErn(
    @Param('releaseId') releaseId: string,
    @Query('storeId') storeId: string,
    @Query('format') format: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!storeId) {
      throw new BadRequestException('storeId query parameter is required');
    }

    const result = await this.ernGeneratorService.generateErn(releaseId, storeId);

    if (format === 'xml') {
      res.set('Content-Type', 'application/xml');
      res.set(
        'Content-Disposition',
        `attachment; filename="ern-${releaseId}.xml"`,
      );
      return result.xml;
    }

    return {
      message: 'ERN 4.3 XML generated successfully',
      data: result,
    };
  }
}
