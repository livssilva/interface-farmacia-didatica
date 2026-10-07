import ProdutoDTO from "../dto/ProdutoDTO";

class ProdutoRequests {
    private serverURL: string;
    private endpointProduto: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointProduto = "/produtos";
    }

    async obterListaDeProdutos(): Promise<ProdutoDTO[]> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}`);

        if (respostaAPI.ok) {
            const listaDeProdutos: ProdutoDTO[] = await respostaAPI.json();
            return listaDeProdutos;
        }

        throw new Error("Não foi possível listar os produtos.");
    }

    async obterProdutosEmAlerta(): Promise<ProdutoDTO[]> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/alerta`);

        if (respostaAPI.ok) {
            const produtosAlerta: ProdutoDTO[] = await respostaAPI.json();
            return produtosAlerta;
        }

        throw new Error("Não foi possível listar os produtos em alerta.");
    }

    async cadastrarProduto(produto: ProdutoDTO): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao cadastrar produto." }));
        throw new Error(erro.mensagem || "Não foi possível cadastrar o produto.");
    }

    async atualizarProduto(idProduto: number, produto: Partial<ProdutoDTO>): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointProduto}/${idProduto}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produto)
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao atualizar produto." }));
        throw new Error(erro.mensagem || "Não foi possível atualizar o produto.");
    }
}

export default new ProdutoRequests();
