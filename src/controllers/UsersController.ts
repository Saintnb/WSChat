import {Request, response, Response} from "express"
import { UserServices } from "../services/UserServices"

class UsersController{
    async create(request: Request, respons: Response): Promise<Response>{
        const {email} =request.body;
        
        const usersServices = new UserServices();

        const user = await usersServices.create(email);
        console.log("User", user);
        return respons.json(user);
    }
}

export {UsersController}