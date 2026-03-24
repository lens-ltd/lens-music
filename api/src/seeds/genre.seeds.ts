import { DataSource, IsNull } from 'typeorm';
import { Genre } from '../entities/genre.entity';
import logger from '../utils/logger';

const CANONICAL_DSP_GENRES: Array<{ name: string; parentName?: string }> = [
  { name: 'Alternative' },
  { name: 'Blues' },
  { name: 'Children\'s Music' },
  { name: 'Classical' },
  { name: 'Country' },
  { name: 'Dance' },
  { name: 'Electronic' },
  { name: 'Hip-Hop/Rap' },
  { name: 'Jazz' },
  { name: 'Latin' },
  { name: 'Pop' },
  { name: 'R&B/Soul' },
  { name: 'Reggae' },
  { name: 'Rock' },
  { name: 'Singer/Songwriter' },
  { name: 'World' },
  { name: 'Indie Pop', parentName: 'Pop' },
  { name: 'Afrobeats', parentName: 'World' },
  { name: 'Drill', parentName: 'Hip-Hop/Rap' },
  { name: 'House', parentName: 'Electronic' },
  { name: 'Techno', parentName: 'Electronic' },
  { name: 'Amapiano', parentName: 'Dance' },
  { name: 'Trap', parentName: 'Hip-Hop/Rap' },
  { name: 'Gospel', parentName: 'R&B/Soul' },
];

export const seedGenres = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Genre);
  const seedLog = logger.child({ seed: 'genres' });

  for (const genreSeed of CANONICAL_DSP_GENRES.filter((g) => !g.parentName)) {
    const existing = await repo.findOne({
      where: { name: genreSeed.name, parentId: IsNull() },
    });

    if (!existing) {
      await repo.save(repo.create({ name: genreSeed.name }));
    }
  }

  for (const genreSeed of CANONICAL_DSP_GENRES.filter((g) => g.parentName)) {
    const parent = await repo.findOne({ where: { name: genreSeed.parentName! } });
    if (!parent) {
      continue;
    }

    const existing = await repo.findOne({
      where: { name: genreSeed.name, parentId: parent.id },
    });

    if (!existing) {
      await repo.save(repo.create({ name: genreSeed.name, parentId: parent.id }));
    }
  }

  seedLog.info(`Seeded canonical genres (${CANONICAL_DSP_GENRES.length} records checked)`);
};
