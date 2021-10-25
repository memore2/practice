import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const errorDB = (error) => console.log(`❌ERROR DataBase`);
const openDB = () => console.log(`💚OPEN DataBase`);

db.on("error", errorDB);
db.once("open", openDB);
