import bcrypt from "bcrypt";
import { AppDataSource } from "../connection/dataSource";
import { User } from "../entity/Users";
import { generateToken } from "../utils/jwt";

export const loginService = async (email: string, password: string) => {

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
        where: { email },
    });

    if (!user) {
        throw new Error("Invalid Email or Password");
    }

    const isPasswordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatch) {
        throw new Error("Invalid Email or Password");
    }

    const token = generateToken({
        userId: user.id,
        companyId: user.companyId,
        role: user.role,
    });

    return {
        token,
        user,
    };
};