import { getCustomRepository, Repository } from "typeorm";
import { User } from "../entities/users";
import { UsersRepository } from "../repositories/UsersRepository";


class UserServices{
    private userRepository : Repository<User>;

    constructor(){
        this.userRepository= getCustomRepository(UsersRepository);
    }
    async create(email: string){

        const userExist = await this.userRepository.findOne({
            email,
        })

        if(userExist){
            return userExist;
        }
        const user = this.userRepository.create({
            email
        });

        await this.userRepository.save(user);

        return user;
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({ email })
    }
}

export {UserServices};