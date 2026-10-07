import ClienteDTO from "../dto/ClienteDTO";

class ClienteRequests {
    private serverURL: string;
    private endpointCliente: string;

    constructor() {
        this.serverURL = "http://localhost:3333";
        this.endpointCliente = "/clientes";
    }

    async obterListaDeClientes(): Promise<ClienteDTO[]> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}`);

        if (respostaAPI.ok) {
            const listaDeClientes: ClienteDTO[] = await respostaAPI.json();
            return listaDeClientes;
        }

        throw new Error("Não foi possível listar os clientes.");
    }

    async cadastrarCliente(cliente: ClienteDTO): Promise<boolean> {
        const respostaAPI = await fetch(`${this.serverURL}${this.endpointCliente}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        if (respostaAPI.ok) {
            return true;
        }

        const erro = await respostaAPI.json().catch(() => ({ mensagem: "Erro ao cadastrar cliente." }));
        throw new Error(erro.mensagem || "Não foi possível cadastrar o cliente.");
    }
}

export default new ClienteRequests();
