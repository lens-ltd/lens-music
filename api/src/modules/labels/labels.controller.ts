import {
  BadRequestException,
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
} from '@nestjs/common';
import { LabelService } from '../../services/label.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { validateCountry, validateEmail } from '../../helpers/validations.helper';

@Controller('labels')
@UseGuards(JwtAuthGuard)
export class LabelsController {
  constructor(private readonly labelService: LabelService) {}

  @Post()
  async createLabel(
    @Body() body: { name: string; description: string; email: string; country: string },
    @CurrentUser() user: AuthUser
  ) {
    const { name, description, email, country } = body;

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    if (email) {
      const { error } = validateEmail(email);
      if (error) {
        throw new BadRequestException(error.message);
      }
    }

    if (country && !validateCountry(country)) {
      throw new BadRequestException('Invalid country value');
    }

    const label = await this.labelService.createLabel({
      name,
      description,
      email,
      userId: user.id,
      country,
    });

    return { message: 'Label created successfully', data: label };
  }

  @Patch(':id')
  async updateLabel(
    @Param('id') id: string,
    @Body() body: { name: string; description: string; email: string; country: string }
  ) {
    const { name, description, email, country } = body;

    if (email) {
      const { error } = validateEmail(email);
      if (error) {
        throw new BadRequestException(error.message);
      }
    }

    if (country && !validateCountry(country)) {
      throw new BadRequestException('Invalid country value');
    }

    const labelExists = await this.labelService.getLabelById(id);
    if (!labelExists) {
      throw new NotFoundException('Label not found');
    }

    const updatedLabel = await this.labelService.updateLabel({
      id,
      name,
      description,
      email,
      country,
    });

    return { message: 'Label updated successfully', data: updatedLabel };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLabel(@Param('id') id: string) {
    const labelExists = await this.labelService.getLabelById(id);
    if (!labelExists) {
      throw new NotFoundException('Label not found');
    }

    await this.labelService.deleteLabel(id);
  }

  @Get()
  async fetchLabels(@Query('size') size = '10', @Query('page') page = '0', @Query() query: Record<string, string>) {
    const labels = await this.labelService.fetchLabels({
      size: Number(size),
      page: Number(page),
      condition: { ...query, size: undefined, page: undefined },
    });

    return { message: 'Labels returned successfully', data: labels };
  }

  @Get(':id')
  async getLabel(@Param('id') id: string) {
    const label = await this.labelService.getLabelById(id);
    if (!label) {
      throw new NotFoundException('Label not found');
    }

    return { message: 'Label found successfully', data: label };
  }
}
