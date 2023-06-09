import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

export const validateJWT =
  (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { MINHA_CHAVE_JWT } = process.env;
      const erroJwtMsg = "Não foi possível validar o token";

      if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ erro: "ENV não localizada" });
      }

      if (req.url === "/api/usuarios" && req.method === "POST") {
        return handler(req, res);
      }

      if (!req || !req.headers) {
        return res.status(401).json({ erro: erroJwtMsg });
      }

      if (req.method !== "OPTIONS") {
        const authorization = req.headers["authorization"];

        if (!authorization) {
          return res.status(401).json({ erro: erroJwtMsg });
        }

        const token = authorization.substring(7);

        if (!token) {
          return res.status(401).json({ erro: erroJwtMsg });
        }

        const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;

        if (!decoded) {
          return res.status(401).json({ erro: erroJwtMsg });
        }

        if (!req.query) {
          req.query = {};
        }

        req.query.userId = decoded._id;
      }
    } catch (error) {
      return res
        .status(401)
        .json({ erro: "Ocorreu um erro ao validar o autenticação." });
    }
    return handler(req, res);
  };
