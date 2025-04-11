import { ObjectId } from "mongodb";
import { db } from "../database.js";
import { editSchema, transactionSchema } from "../schemas.js";

export async function getTransactionsID (req, res) {
    const id = req.params.id;
    const {authorization} = req.headers;
    console.log(authorization);
    const token = authorization?.replace("Bearer" , "").trim();
    if(!token) return res.sendStatus(401);

    try{
        const session = await db.collection("sessions").findOne({token});
        if(!session) return res.sendStatus(401);
        const receipt = await db.collection("transactions").findOne({
            _id: new ObjectId(id)
            });

        if(!receipt) return res.status(404).send("Não encontrado");
        return res.send(receipt);
    }catch(error){
        return res.sendStatus(500);
    }
}

export async function getTransactions (req, res) {
    try{
        const receipt = db.collection("transactions").find().toArray();
        return res.send(receipt);

    }catch(error){
        return res.status(500).send(error.message)
    }
}

////////////////////////////////////////////////////////

export async function addTransaction(req,res){
    const transaction = req.body;
    const {authorization} = req.headers;
    const token = authorization?.replace("Bearer", "").trim();

    const validation = transactionSchema.validate({username, tweet}, {abortEarly: false});
 
     if(validation.error){
         const message = validation.error.details.map(detail => detail.message);
         return res.status(422).send(message);
     }
 
     try{
         const session = await db.collection("sessions").findOne({token});
         if(!session) return res.sendStatus(401);

         const userId = session.userId;

         const transaction = {
            value,
            description,
            type,
            userId
         }
 
         await db.collection("transactions").insertOne({transaction});
         res.sendStatus(201);
     } catch(error){
         res.status(500).send(error.message);
     }

}

///////////////////////////////////////////////////////

export async function editTransaction(req,res) {
    const id = req.params.id;
    const {authorization} = req.headers;
    console.log(authorization);
    const token = authorization?.replace("Bearer" , "").trim();
    if(!token) return res.sendStatus(401);

    const validation = editSchema.validate(token, {abortEarly: false});
        if(validation.error){
            const message = validation.error.details.map(detail => detail.message);
            return res.status(422).send(message);
        }
    
    try{
        const result = await db.collection("transactions").updateOne({
        _id: new ObjectId(id)
    },{
        $set:{
            username: username,
            tweet: tweet
        }
    });
        if(result.matchedCount === 0){
            return res.status(404).send("Tweet não encontrado ou não existe");
        }
    return res.send("Tweet editado");
    
    } catch(error){
        res.status(500).send(error.message);
    }
}

//////////////////////////////////////////

export async function deleteTransaction(req, res) {
    const {id} = req.params;

    try{
        const result = await db.collection("tweets").deleteOne({
            _id: new ObjectId(id)
        });
            if(result.deletedCount === 0){
                return res.status(404).send("Tweet não encontrado ou não existe")
            }
            return res.status(204).send("Tweet deletado com sucesso")
    } catch(error){
        res.status(500).send(error.message);
    }
}