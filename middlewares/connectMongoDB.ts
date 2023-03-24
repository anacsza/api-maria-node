import mongoose from "mongoose";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const connectMongoDB =
  (handler: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    const { MONGO_CONNECTION_STRING } = process.env;

    if (!MONGO_CONNECTION_STRING) {
      return res.status(500).json({ erro: "ENV banco não encontrada" });
    }

    mongoose.connection.on("connected", () => console.log("Banco conectado"));
    mongoose.connection.on("error", (error) =>
      console.log("Ocorreu erro ao conectar no banco: ${error}")
    );

    await mongoose.connect(MONGO_CONNECTION_STRING);

    return handler(req, res);
  };
