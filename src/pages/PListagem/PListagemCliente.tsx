import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClienteDTO from "../../dto/ClienteDTO";
import ClienteRequests from "../../fetch/ClienteRequests";
import TabelaClientes from "../../components/Listagens/TabelaClientes";

function PListagemCliente(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    const [pesquisa, setPesquisa] = useState<string>("");

    const buscarClientes = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const listaDeClientes = await ClienteRequests.obterListaDeClientes();
            setClientes(listaDeClientes || []);
        } catch (err: any) {
            setErro(err.message || "Erro ao carregar clientes.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarClientes();
    }, []);

    const clientesFiltrados: ClienteDTO[] = clientes.filter((cliente) =>
        cliente.nome?.toLowerCase().startsWith(pesquisa.toLowerCase())
    );

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>Lista de Clientes</h2>
                    <p>Clientes cadastrados no sistema da farmácia</p>
                </div>
                <Link to="/cadastro/cliente" className="btn-novo">
                    + Novo Cliente
                </Link>
            </div>

            <div className="pesquisa-container">
                <span className="pesquisa-icone" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    type="text"
                    className="pesquisa-input"
                    placeholder="Pesquisar cliente pelo nome..."
                    value={pesquisa}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPesquisa(e.target.value)
                    }
                />
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}

            {carregando ? (
                <p className="mensagem-carregando">Carregando clientes...</p>
            ) : (
                <TabelaClientes clientes={clientesFiltrados} />
            )}
        </main>
    );
}

export default PListagemCliente;