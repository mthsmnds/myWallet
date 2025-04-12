import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

export async function signUp(req, res) {
    const signUp = req.body;

    try {
        const existingUser = await db.collection("users").findOne({ email: signUp.email });
        if (existingUser) return res.status(409).send("Este email já está cadastrado");

        await db.collection("users").insertOne({
            ...signUp, password: bcrypt.hashSync(signUp.password, 10)
        });
        res.status(201).send("Usuário cadastrado com sucesso")
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

export async function signIn(req, res) {
    const login = req.body

    try {
        const user = await db.collection("users").findOne({ email: login.email });
        if (!user) {
            return res.status(401).send("Email ou senha incorretos");
        }
        if (user && bcrypt.compareSync(login.password, user.password)) {
            console.log("Usuário logado com sucesso.");

            const token = jwt.sign(
                {userId: user._id }, 
                process.env.JWT_SECRET,
                {expiresIn: 86400});


            // const session = {
            //     token,
            //     userId: user._id
            // };

            // await db.collection("sessions").insertOne(session);

            return res.send(token);
        }
        return res.status(401).send("Email ou senha incorretos");
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}