import { getCustomRepository, Repository } from "typeorm";
import { SettingsRepository } from "../repositories/SettingsRepository";
import {setting} from "../entities/settings"


interface ISettingsServices{
    chat: boolean,
    username: string
}

class SettingsServices{
    private settingsRepository : Repository<setting>;

    constructor(){
        this.settingsRepository = getCustomRepository(SettingsRepository);
    }

    async create({chat, username}: ISettingsServices){
        const userAlreadyExist = await this.settingsRepository.findOne({
            username,
        });
        if(userAlreadyExist){
            throw new Error("User already Exist");
            
        }
        const settings = this.settingsRepository.create({
            chat,
            username
        })
    
        await this.settingsRepository.save(settings);
        return settings;
    };
    async findByUserName(username:string){
        const settings = await this.settingsRepository.findOne({
            username,
        });

        return settings;
    };

    async update(username:string, chat:boolean){
        const settings = await this.settingsRepository.createQueryBuilder().
        update(setting)
        .set({chat})
        .where("username = :username",{
            username
        })
        .execute();
    }
}

export {SettingsServices};