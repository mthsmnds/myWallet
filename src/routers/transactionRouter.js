import { Router } from "express";
import { addTransaction, deleteTransaction, editTransaction, getTransactions, getTransactionsID } from "../controllers/transactionController.js";

const transactionRouter = Router();

transactionRouter.post("/transactions/add", addTransaction);

transactionRouter.get("/transactions", getTransactions);
transactionRouter.get("/transactions/:id", getTransactionsID);

transactionRouter.put("/transactions/:id", editTransaction);

transactionRouter.delete("/transactions/:id", deleteTransaction);

export default transactionRouter;