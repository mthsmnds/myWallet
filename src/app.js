import express, {json} from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import { deleteTransaction, editTransaction, getTransactions, getTransactionsID } from "./controllers/transactions.js";
import { signIn, signUp } from "./controllers/user.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(json());


//------------------------------------POST REQUESTS----------------------------------------------//

app.post("/sign-up", signUp)

app.post("/sign-in",signIn)

//------------------------------------------GET REQUESTS-----------------------------------------//

app.get("/transactions", getTransactions);

app.get("/transactions/:id", getTransactionsID);
        

//-----------------------------------------PUT REQUEST--------------------------------------------//

app.put("/transactions/:id", editTransaction());

//-----------------------------------------DELETE REQUEST----------------------------------------//

app.delete("/tweets/:id", deleteTransaction());



const porta = process.env.PORTA || 5000;
app.listen(porta, ()=>{
    console.log(`Server rodando na porta ${porta}`);
})

