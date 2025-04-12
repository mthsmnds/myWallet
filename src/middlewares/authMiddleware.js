import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

dotenv.config();

export async function validateToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer", "").trim();
    if (!token) return res.sendStatus(401);

    try {
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded)=>{
            if(error) return res.status(401).send(error); 
            
            
            const session  = await db.collection("sessions").findOne({token});
            if(!session) return res.sendStatus(401);
            
            res.locals.user = {_id: session.userId};
            console.log("decoded.userId:", decoded.userId);
    
           return next();
        })

    } catch (error) {
        return res.sendStatus(500);
    }
}