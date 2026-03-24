import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Genre } from '../../entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { ROLES } from '../../constants/auth.constant';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async fetchGenres(parentId?: string): Promise<Genre[]> {
    const where = typeof parentId === 'string' ? { parentId } : {};
    return this.genreRepository.find({
      where,
      relations: { parent: true },
      order: { name: 'ASC' },
    });
  }

  async createGenre(dto: CreateGenreDto, user: AuthUser): Promise<Genre> {
    if (user.role !== ROLES.ADMIN) {
      throw new ForbiddenException('Only admins can create genres');
    }

    if (dto.parentId) {
      const parent = await this.genreRepository.findOne({ where: { id: dto.parentId } });
      if (!parent) {
        throw new NotFoundException('Parent genre not found');
      }
    }

    const existing = await this.genreRepository.findOne({
      where: {
        name: dto.name.trim(),
        ...(dto.parentId ? { parentId: dto.parentId } : { parentId: IsNull() }),
      },
    });

    if (existing) {
      throw new ConflictException('Genre already exists');
    }

    const genre = this.genreRepository.create({
      name: dto.name.trim(),
      parentId: dto.parentId,
      createdById: user.id,
    });

    return this.genreRepository.save(genre);
  }
}
