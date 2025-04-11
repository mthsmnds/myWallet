import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";
import transactionRouter from "./routers/transactionRouter.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());


app.use(authRouter);
app.use(transactionRouter);


const porta = process.env.PORTA || 5000;
app.listen(porta, () => {
    console.log(`Server rodando na porta ${porta}`);
})

