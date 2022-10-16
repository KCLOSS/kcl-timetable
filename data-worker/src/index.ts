import { config } from "dotenv";
import { sync } from "./update";
import { close, connect } from "./db";
config();

async function main() {
    await connect();
    await sync();
    close();
}

main();
