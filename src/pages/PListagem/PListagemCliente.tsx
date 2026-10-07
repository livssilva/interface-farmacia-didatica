import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ClienteDTO from "../../dto/ClienteDTO";
import ClienteRequests from "../../fetch/ClienteRequests";
import TabelaClientes from "../../components/Listagens/TabelaClientes";

function PListagemCliente(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

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

            {erro && <div className="alerta-erro">{erro}</div>}

            {carregando ? (
                <p className="mensagem-carregando">Carregando clientes...</p>
            ) : (
                <TabelaClientes clientes={clientes} />
            )}
        </main>
    );
}

export default PListagemCliente;
