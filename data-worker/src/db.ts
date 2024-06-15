import { Db, MongoClient } from "mongodb";

var client: MongoClient;
export var db: Db;

export async function connect() {
    client = await MongoClient.connect(process.env.MONGODB_URI as string);
    db = client.db('kcl-timetables');
}

export async function close() {
    client.close();
}
