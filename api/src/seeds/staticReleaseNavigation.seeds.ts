import { DataSource } from "typeorm";
import { RELEASE_STATIC_NAVIGATION_STEPS } from "../constants/staticReleaseNavigation.constants";
import { StaticReleaseNavigation } from "../entities/staticReleaseNavigation.entity";
import logger from "../utils/logger";

export const seedStaticReleaseNavigation = async (dataSource: DataSource) => {
    const repo = dataSource.getRepository(StaticReleaseNavigation);
    const seedLog = logger.child({ seed: 'staticReleaseNavigation' });

    await repo.delete({});
    await repo.save(repo.create(RELEASE_STATIC_NAVIGATION_STEPS));

    seedLog.info(`Seeded ${RELEASE_STATIC_NAVIGATION_STEPS.length} static release navigation records`);
};