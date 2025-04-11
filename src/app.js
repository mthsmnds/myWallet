import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { addTransaction, deleteTransaction, editTransaction, getTransactions, getTransactionsID } from "./controllers/transactions.js";
import { signIn, signUp } from "./controllers/user.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());


app.post("/sign-up", signUp)
app.post("/sign-in", signIn)
app.post("/transactions/add", addTransaction);
app.get("/transactions", getTransactions);
app.get("/transactions/:id", getTransactionsID);
app.put("/transactions/:id", editTransaction);
app.delete("/transactions/:id", deleteTransaction);


const porta = process.env.PORTA || 5000;
app.listen(porta, () => {
    console.log(`Server rodando na porta ${porta}`);
})

