import mongoose, { Schema } from "mongoose";

const PedidosSchema = new Schema({
    idUsuario: { type: String, required: true},
    idLivro: { type: String, required: true},
    valor: { type: String, required: true},
    dataPedido: { type: Date, required: true}
})

export const PedidosModel = (mongoose.models.pedidos || mongoose.model('pedidos', PedidosSchema));