import { Router } from "express";
import { addTransaction, deleteTransaction, editTransaction, getTransactions, getTransactionsID } from "../controllers/transactionController.js";
import { validateToken } from "../middlewares/authMiddleware.js";
import validateSchema from "../middlewares/schemaMiddleware.js";
import { transactionSchema } from "../schemas/transactionSchema.js";

const transactionRouter = Router();

transactionRouter.use(validateToken);

transactionRouter.post("/transactions/add", validateSchema(transactionSchema),  addTransaction);

transactionRouter.get("/transactions", getTransactions);
transactionRouter.get("/transactions/:id", getTransactionsID);

transactionRouter.put("/transactions/:id", validateSchema(transactionSchema),  editTransaction);

transactionRouter.delete("/transactions/:id",  deleteTransaction);

export default transactionRouter;