import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db } from "../database.js";
import { loginSchema, signUpSchema } from "../schemas.js";

export async function signUp(req, res) {
    const signUp = req.body;
    const validate = signUpSchema.validate(signUp, { abortEarly: false });

    if (validate.error) {
        const errMessage = validate.error.details.map(detail => detail.message);
        return res.status(422).send(errMessage)
    }

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

    const validate = loginSchema.validate(login, { abortEarly: false });

    if (validate.error) {
        const errMessage = validate.error.details.map(detail => detail.message);
        return res.status(422).send(errMessage);
    }

    try {
        const user = await db.collection("users").findOne({ email: login.email });
        if (!user) {
            return res.status(401).send("Email ou senha incorretos");
        }
        if (user && bcrypt.compareSync(login.password, user.password)) {
            console.log("Usuário logado com sucesso.");

            const token = uuid();
            const session = {
                token,
                userId: user._id
            };

            await db.collection("sessions").insertOne(session);

            return res.send(token);
        }
        return res.status(401).send("Email ou senha incorretos");
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}