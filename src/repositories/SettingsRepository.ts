import { EntityRepository, Repository } from "typeorm";
import { setting } from "../entities/settings";

@EntityRepository(setting)
class SettingsRepository extends Repository<setting>{}

export {SettingsRepository};