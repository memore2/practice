import "dotenv/config";
import "./db";
import app from "./server";

const PORT = 3000;
const locationServer = () =>
  console.log(`✅Success Server http://localhost:${PORT}`);

app.listen(PORT, locationServer);
