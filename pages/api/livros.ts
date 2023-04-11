import { connectMongoDB } from "@/middlewares/connectMongoDB";
import { validateJWT } from "@/middlewares/validateJWT";
import { LivrosModel } from "@/models/livrosModel";
import { uploadMulter, uploadImage } from "@/services/uploadImage";
import { LivrosRequest } from "@/types/livrosRequest";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

const endpointLivros = nc()
  .use(uploadMulter.single("file"))
  .post(async (req: any, res: NextApiResponse) => {
    try {
      console.log("salvar livro");
      const livro = req.body as LivrosRequest;

      if (!livro) {
        return res.status(400).json({ msg: "Requisição inválida" });
      }

      if (!livro.autor || livro.autor === "") {
        return res.status(400).json({ msg: "O campo autor é obrigatório." });
      }

      if (!livro.editora || livro.editora === "") {
        return res.status(400).json({ msg: "O campo editora é obrigatório." });
      }

      if (!livro.titulo || livro.titulo === "") {
        return res.status(400).json({ msg: "O campo título é obrigatório." });
      }

      const cosmicResponse = await uploadImage(req);

      const novoLivro = {
        autor: livro.autor,
        editora: livro.editora,
        titulo: livro.titulo,
        dataInclusao: new Date().toISOString(),
        urlCapaLivro: cosmicResponse.media.url,
      };

      await LivrosModel.create(novoLivro);

      return res.status(201).json({ msg: "Livro criado com sucesso." });
    } catch (error) {
      return res.status(500).json({ msg: "Ocorreu um erro ao salvar o livro" });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    const livros = await LivrosModel.find();

    return res.status(200).json({ data: livros });
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    const { idLivro } = req.query;

    const livroEncontrado = await LivrosModel.findById(idLivro);

    if (!livroEncontrado) {
      return res.status(404).json({ msg: "Livro não encontrado." });
    }

    await LivrosModel.findByIdAndDelete(idLivro);

    return res.status(204).json({});
  })
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    const livroAlterado = req.body as LivrosRequest;
    const { idLivro } = req.query;

    const livroEncontrado = await LivrosModel.findById(idLivro);

    if (!livroEncontrado) {
      return res.status(404).json({ msg: "Livro não encontrado." });
    }

    livroEncontrado.autor = livroAlterado.autor;
    livroEncontrado.editora = livroAlterado.editora;
    livroEncontrado.titulo = livroAlterado.titulo;
    livroEncontrado.dataInclusao = new Date().toISOString();

    await LivrosModel.findByIdAndUpdate(
      { _id: livroEncontrado._id },
      livroEncontrado
    );

    return res.status(204).json({});
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default validateJWT(connectMongoDB(endpointLivros));
