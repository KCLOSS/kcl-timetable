import { Db, MongoClient } from "mongodb";

export var db: Db;

export async function connect() {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    db = client.db('timetables');
}
