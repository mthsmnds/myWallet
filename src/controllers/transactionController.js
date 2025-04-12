import { ObjectId } from "mongodb";
import { db } from "../config/database.js";

export async function getTransactionsID(req, res) {
    const id = req.params.id;

    try {
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

    try {

        await db.collection("transactions").insertOne({
            ...transaction,
            user: res.locals.user._id
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

    try {
        const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) });
        if (!transaction) return res.status(404).send("Transação não encontrada");

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

    try {
        const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) });
        if (!transaction) return res.status(404).send("Transação não encontrada");

        await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).send(error.message);
    }
}