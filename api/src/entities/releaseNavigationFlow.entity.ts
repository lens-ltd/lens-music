import { Column, Entity, Unique } from "typeorm";
import { UUID } from "../types/common.types";
import { AbstractEntity } from "./abstract.entity";


@Entity('release_navigation_flows')
@Unique(['releaseId', 'staticReleaseNavigationId'])
export class ReleaseNavigationFlow extends AbstractEntity {

    @Column({ name: 'release_id', nullable: false, type: 'uuid' })
    releaseId: UUID;

    @Column({ name: 'static_release_navigation_id', nullable: false, type: 'uuid' })
    staticReleaseNavigationId: UUID;
}
