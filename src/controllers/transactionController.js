import { ObjectId } from "mongodb";
import { db } from "../config/database.js";
import { transactionSchema } from "../schemas/transactionSchema.js"

export async function getTransactionsID(req, res) {
    const id = req.params.id;
    const { authorization } = req.headers;
    console.log(authorization);
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);
        const receipt = await db.collection("transactions").findOne({
            _id: new ObjectId(id)
        });

        if (!receipt) return res.status(404).send("Não encontrado");
        return res.send(receipt);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function getTransactions(req, res) {
    try {
        const receipt = await db.collection("transactions").find().toArray();
        return res.send(receipt);

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

////////////////////////////////////////////////////////

export async function addTransaction(req, res) {
    const transaction = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    const validation = transactionSchema.validate(transaction, { abortEarly: false });

    if (validation.error) {
        const message = validation.error.details.map(detail => detail.message);
        return res.status(422).send(message);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const userId = session.userId;

        await db.collection("transactions").insertOne({
            ...transaction,
            userId
        });
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }

}

///////////////////////////////////////////////////////

export async function editTransaction(req, res) {
    const id = req.params.id;
    const { value, description, type } = req.body;
    const { authorization } = req.headers;
    console.log(authorization);
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    const validation = transactionSchema.validate({ value, description, type }, { abortEarly: false });
    if (validation.error) {
        const message = validation.error.details.map(detail => detail.message);
        return res.status(422).send(message);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) });
        if (!transaction) return res.status(404).send("Transação não encontrada");

        if (String(transaction.userId) !== String(session.userId)) {
            return res.sendStatus(401);
        }

        await db.collection("transactions").updateOne(
            { _id: new ObjectId(id) },
            { $set: { value, description, type } }
        );

        return res.sendStatus(204);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

//////////////////////////////////////////

export async function deleteTransaction(req, res) {
    const id = req.params.id;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.collection("sessions").findOne({ token });
        if (!session) return res.sendStatus(401);

        const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) });
        if (!transaction) return res.status(404).send("Transação não encontrada");
        if (String(transaction.userId) !== String(session.userId)) {
            return res.sendStatus(401);
        }

        await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}