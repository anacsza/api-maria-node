import { UsuariosModel } from "@/models/usuariosModel";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import md5 from "md5";
import jwt from "jsonwebtoken";
import { connectMongoDB } from "@/middlewares/connectMongoDB";

const endpointAcessosUsuarios = nc().post(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { email, senha } = req.body;
      const { MINHA_CHAVE_JWT } = process.env;

      if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ msg: "Env não encontrada." });
      }

      const usuarioEncontrado = await UsuariosModel.find({
        email: email,
        senha: md5(senha),
      });
      console.log(usuarioEncontrado)
      if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
      }

      const token = jwt.sign(
        { _id: usuarioEncontrado[0]._id },
        MINHA_CHAVE_JWT
      );

      return res.status(200).json({ data: token });
    } catch (error) {
      return res.status(500).json({ msg: "Ocorreu um erro ao logar" });
    }
  }
);

export default connectMongoDB(endpointAcessosUsuarios);
