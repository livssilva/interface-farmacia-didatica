import PedidoDTO from "../dto/PedidoDTO";
import ItemPedidoDTO from "../dto/ItemPedidoDTO";

class PedidoRequests {
    private serverURL: string;
    private endpointPedido: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointPedido = "/pedidos";
    }

    async obterListaDePedidos(): Promise<PedidoDTO[]> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}`);

        if (respostaAPI.ok) {
            const listaDePedidos: PedidoDTO[] = await respostaAPI.json();
            return listaDePedidos;
        }

        throw new Error("Não foi possível listar os pedidos.");
    }

    async obterPedidoPorId(id: number): Promise<{ pedido: PedidoDTO; itens: ItemPedidoDTO[] }> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${id}`);

        if (respostaAPI.ok) {
            const dados = await respostaAPI.json();
            return dados;
        }

        throw new Error("Não foi possível obter o pedido.");
    }

    async obterItensDoPedido(id: number): Promise<ItemPedidoDTO[]> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${id}/itens`);

        if (respostaAPI.ok) {
            const itens: ItemPedidoDTO[] = await respostaAPI.json();
            return itens;
        }

        throw new Error("Não foi possível obter os itens do pedido.");
    }

    async cadastrarPedido(dados: { idCliente: number; itens: { idProduto: number; qtdProduto: number; precoUnit: number }[] }): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao cadastrar pedido." }));
        throw new Error(erro.mensagem || "Não foi possível cadastrar o pedido.");
    }

    async adicionarItemAoPedido(id: number, item: { idProduto: number; qtdProduto: number; precoUnit: number }): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointPedido}/${id}/itens`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao adicionar item ao pedido." }));
        throw new Error(erro.mensagem || "Não foi possível adicionar o item ao pedido.");
    }
}

export default new PedidoRequests();
