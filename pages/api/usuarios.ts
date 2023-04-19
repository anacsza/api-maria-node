import { UsuarioRequest } from "@/types/usuariosRequest";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import md5 from "md5";
import { UsuariosModel } from "@/models/usuariosModel";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { validateJWT } from "@/middlewares/validateJWT";

const endpointUsuarios = nc()
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const usuario = req.body as UsuarioRequest;

      if (!usuario) {
        return res.status(400).json({ msg: "Requisição inválida" });
      }

      if (!usuario.nome || usuario.nome === "") {
        return res.status(400).json({ msg: "Nome é obrigatório" });
      }

      if (
        !usuario.email ||
        usuario.email === "" ||
        !usuario.email.includes("@")
      ) {
        return res.status(400).json({ msg: "E-mail é obrigatório" });
      }

      const padraoSenhaRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{5,}$/;

      console.log(padraoSenhaRegex.test(usuario.senha));

      if (
        !usuario.senha ||
        usuario.senha === "" ||
        !padraoSenhaRegex.test(usuario.senha)
      ) {
        return res
          .status(400)
          .json({ msg: "Senha é obrigatório ou está inválida" });
      }

      const novoUsuario = {
        nome: usuario.nome,
        email: usuario.email,
        senha: md5(usuario.senha),
      };

      await UsuariosModel.create(novoUsuario);

      return res.status(201).json({ msg: "Usuário com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Ocorreu um erro ao salvar o usuário" });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { userId } = req.query;

      const usuarioEncontrado = await UsuariosModel.findById(userId);

      if (!usuarioEncontrado) {
        return res
          .status(404)
          .json({ msg: "Ocorreu um erro ao buscar o usuário" });
      }

      usuarioEncontrado.senha = "";

      return res.status(200).json({ data: usuarioEncontrado });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Ocorreu um erro ao buscar o usuário" });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { userId } = req.query;
      const usuario = req.body as UsuarioRequest;

      const usuarioEncontrado = await UsuariosModel.findById(userId);

      if (!usuarioEncontrado) {
        return res
          .status(404)
          .json({ msg: "Ocorreu um erro ao buscar o usuário" });
      }

      if (!usuario) {
        return res.status(400).json({ msg: "Requisição inválida" });
      }

      if (!usuario.nome || usuario.nome === "") {
        return res.status(400).json({ msg: "Nome é obrigatório" });
      }

      if (
        !usuario.email ||
        usuario.email === "" ||
        !usuario.email.includes("@")
      ) {
        return res.status(400).json({ msg: "E-mail é obrigatório" });
      }

      const padraoSenhaRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{5,}$/;

      console.log(padraoSenhaRegex.test(usuario.senha));

      if (
        !usuario.senha ||
        usuario.senha === "" ||
        padraoSenhaRegex.test(usuario.senha)
      ) {
        return res
          .status(400)
          .json({ msg: "Senha é obrigatório ou está inválida" });
      }

      usuarioEncontrado.nome = usuario.nome;
      usuarioEncontrado.email = usuario.email;
      usuarioEncontrado.senha = md5(usuario.senha);

      await UsuariosModel.findByIdAndUpdate({ _id: userId }, usuarioEncontrado);

      return res.status(204).json({});
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Ocorreu um erro ao atualizar o usuário" });
    }
  });

export default validateJWT(connectMongoDB(endpointUsuarios));
