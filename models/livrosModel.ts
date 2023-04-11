import mongoose, { Schema } from "mongoose";

const LivrosSchema = new Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  editora: { type: String, required: true },
  dataInclusao: { type: Date, required: true },
  urlCapaLivro: { type: String }
});

export const LivrosModel =
  (mongoose.models.livros || mongoose.model('livros', LivrosSchema));
