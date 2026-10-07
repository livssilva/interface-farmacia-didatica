import ItemPedidoDTO from "../dto/ItemPedidoDTO";

class ItemPedidoRequests {
    private serverURL: string;
    private endpointItens: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointItens = "/itens";
    }

    async obterItens(idVenda: number): Promise<ItemPedidoDTO[]> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointItens}/${idVenda}`);

        if (respostaAPI.ok) {
            const listaItens: ItemPedidoDTO[] = await respostaAPI.json();
            return listaItens;
        }

        throw new Error("Não foi possível listar os itens.");
    }

    async cadastrarItem(item: ItemPedidoDTO): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointItens}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao cadastrar item." }));
        throw new Error(erro.mensagem || "Não foi possível cadastrar o item.");
    }

    async atualizarItem(idVenda: number, idProduto: number, campos: { qtdProduto?: number; precoUnit?: number }): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointItens}/${idVenda}/${idProduto}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(campos)
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao atualizar item." }));
        throw new Error(erro.mensagem || "Não foi possível atualizar o item.");
    }

    async removerItem(idVenda: number, idProduto: number): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointItens}/${idVenda}/${idProduto}`, {
            method: "DELETE"
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao remover item." }));
        throw new Error(erro.mensagem || "Não foi possível remover o item.");
    }
}

export default new ItemPedidoRequests();
