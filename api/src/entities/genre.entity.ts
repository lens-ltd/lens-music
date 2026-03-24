import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ReleaseGenre } from './release-genre.entity';

@Entity('genres')
@Unique(['name', 'parentId'])
export class Genre extends AbstractEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string;

  @ManyToOne(() => Genre, (genre) => genre.children, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Genre;

  @OneToMany(() => Genre, (genre) => genre.parent)
  children!: Genre[];

  @OneToMany(() => ReleaseGenre, (releaseGenre) => releaseGenre.genre)
  releaseGenres!: ReleaseGenre[];
}
