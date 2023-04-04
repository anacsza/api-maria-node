import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { validateJWT } from "@/middlewares/validateJWT";
import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { PedidosRequest } from "@/types/pedidosRequest";
import { UsuariosModel } from "@/models/usuariosModel";
import { LivrosModel } from "@/models/livrosModel";
import { PedidosModel } from "@/models/pedidosModel";

const endpointPedidos = nc()
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    
    const {userId} = req.query;
    const pedido = req.body as PedidosRequest;

    if (!pedido) {
        return res.status(400).json({ msg: "Requisição inválida"});
    }

    const usuarioEncontrado = await UsuariosModel.findById(userId);

    if (!usuarioEncontrado || usuarioEncontrado.length === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado"});
    }

    const livroEncontrado = await LivrosModel.findById(pedido.idLivro);

    if (!livroEncontrado || livroEncontrado.length === 0) {
        return res.status(404).json({ msg: "Livro não encontrado"});
    }

    if (!pedido.valor || pedido.valor === 0) {
        return res.status(400).json({ msg: "Valor é obrigatório"});
    }

    const usuarioVendaEncontrado = await UsuariosModel.findById(pedido.idUsuario);

    if (!usuarioVendaEncontrado || usuarioVendaEncontrado.length === 0) {
        return res.status(404).json({ msg: "Usuário não encontrado"});
    }

    const novoPedido = {
        idUsuario : pedido.idUsuario,
        idLivro : pedido.idLivro,
        valor : pedido.valor,
    };
    
    await PedidosModel.create(novoPedido);

    return res.status(201).json({ msg: "Pedido cadastrado com sucesso"})

  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
        
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    
  });

export default validateJWT(connectMongoDB(endpointPedidos));
