import { config } from "dotenv";
import { sync } from "./update";
import { connect } from "./db";
config();

async function main() {
    await connect();
    await sync();
}

main();
