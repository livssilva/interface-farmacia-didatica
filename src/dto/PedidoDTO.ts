import ItemPedidoDTO from "./ItemPedidoDTO";

export default interface PedidoDTO {
    idVenda?: number;
    idCliente: number;
    nomeCliente?: string;
    dataVenda?: string;
    itens?: ItemPedidoDTO[];
}
