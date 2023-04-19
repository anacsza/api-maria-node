import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { validateJWT } from "@/middlewares/validateJWT";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { PedidosRequest } from "@/types/pedidosRequest";
import { UsuariosModel } from "@/models/usuariosModel";
import { LivrosModel } from "@/models/livrosModel";
import { PedidosModel } from "@/models/pedidosModel";
import { consultarLivros } from "@/services/livrosService";
import { consultarUsuarios } from "@/services/usuariosService";
import { consultarPedidos } from "@/services/pedidosService";

const endpointPedidos = nc()
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = req.query;
    const pedido = req.body as PedidosRequest;

    if (!pedido) {
      return res.status(400).json({ msg: "Requisição inválida" });
    }

    const usuarioEncontrado = await UsuariosModel.findById(userId);

    if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const livroEncontrado = await LivrosModel.findById(pedido.idLivro);

    if (!livroEncontrado || livroEncontrado.length === 0) {
      return res.status(404).json({ msg: "Livro não encontrado" });
    }

    if (!pedido.valor || pedido.valor === 0) {
      return res.status(400).json({ msg: "Valor é obrigatório" });
    }

    const usuarioVendaEncontrado = await UsuariosModel.findById(
      pedido.idUsuario
    );

    if (!usuarioVendaEncontrado || usuarioVendaEncontrado.length === 0) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const novoPedido = {
      idUsuario: pedido.idUsuario,
      idLivro: pedido.idLivro,
      valor: pedido.valor,
      dataPedido: new Date().toISOString(),
      status: "NOVO",
    };

    await PedidosModel.create(novoPedido);

    return res.status(201).json({ msg: "Pedido cadastrado com sucesso" });
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { idPedido, userId } = req.query;

      const usuarioEncontrado = await UsuariosModel.findById(userId);

      if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      if (!idPedido) {
        const { titulo, status, nome } = req.query;

        let livros = [];
        if (titulo) {
          livros = await LivrosModel.find({
            $or: [{ titulo: { $regex: titulo, $options: "i" } }],
          });
        }
        let usuarios = [];
        if (nome) {
          usuarios = await UsuariosModel.find({
            $or: [{ nome: { $regex: nome, $options: "i" } }],
          });
        }
        let pedidos = [];
        if (status) {
          pedidos = await PedidosModel.find({
            $or: [{ status: { $regex: status, $options: "i" } }],
          });
        }
        return res.status(200).json({
          data: {
            livros: livros,
            usuarios: usuarios,
            pedidos: pedidos,
          },
        });
      }

      const pedidoEncontrado = await PedidosModel.findById(idPedido);

      if (!pedidoEncontrado || pedidoEncontrado.length === 0) {
        return res.status(404).json({ msg: "Pedido não encontrado" });
      }

      const livroEncontrado = await LivrosModel.findById(
        pedidoEncontrado.idLivro
      );

      if (!livroEncontrado || livroEncontrado.length === 0) {
        return res.status(404).json({ msg: "Livro não encontrado" });
      }

      usuarioEncontrado.senha = null;

      const pedidoResponse = {
        pedido: pedidoEncontrado,
        usuario: usuarioEncontrado,
        livro: livroEncontrado,
      };

      return res.status(200).json({ data: pedidoResponse });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Ocorreu um erro ao buscar o pedido." });
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { idPedido, userId } = req.query;

      const usuarioEncontrado = await UsuariosModel.findById(userId);

      if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      const pedidoEncontrado = await PedidosModel.findById(idPedido);

      if (!pedidoEncontrado || pedidoEncontrado.length === 0) {
        return res.status(404).json({ msg: "Pedido não encontrado" });
      }

      if (pedidoEncontrado.status === "FINALIZADO") {
        return res
          .status(400)
          .json({ msg: "O pedido foi finalizado e não pode ser removido" });
      }

      await PedidosModel.findOneAndDelete({ _id: idPedido });

      return res.status(204).json({});
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Ocorreu um erro ao deletar o pedido." });
    }
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { idPedido, userId } = req.query;

      const usuarioEncontrado = await UsuariosModel.findById(userId);

      if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado" });
      }

      const pedidoEncontrado = await PedidosModel.findById(idPedido);

      if (!pedidoEncontrado || pedidoEncontrado.length === 0) {
        return res.status(404).json({ msg: "Pedido não encontrado" });
      }

      pedidoEncontrado.status = "FINALIZADO";

      await PedidosModel.findOneAndUpdate({ _id: idPedido }, pedidoEncontrado);

      return res.status(204).json({ msg: "Pedido atualizado com sucesso." });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Ocorreu um erro ao atualizar o pedido." });
    }
  });

export default validateJWT(connectMongoDB(endpointPedidos));
