import mongoose, { Schema } from "mongoose";

const PedidosSchema = new Schema({
    usuarios: { type: mongoose.Schema.Types.ObjectId, ref: 'usuarios', required: true},
    livros: { type: mongoose.Schema.Types.ObjectId, ref: 'livros', required: true},
    valor: { type: String, required: true},
    dataPedido: { type: Date, required: true},
    status: { type: String, required: true}
})

export const PedidosModel = (mongoose.models.pedidos || mongoose.model('pedidos', PedidosSchema));