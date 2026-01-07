import "dotenv/config";
import { app } from "./app";
import { connectMongo } from "./config/mongo";

const PORT = Number(process.env.PORT || 4000);

async function startServer() {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

startServer();
