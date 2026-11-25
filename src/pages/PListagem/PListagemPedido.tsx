import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PedidoDTO from "../../dto/PedidoDTO";
import PedidoRequests from "../../fetch/PedidoRequests";
import TabelaPedidos from "../../components/Listagens/TabelaPedidos";

function PListagemPedido(): JSX.Element {
    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    const [pesquisa, setPesquisa] = useState<string>("");

    const buscarPedidos = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const listaDePedidos = await PedidoRequests.obterListaDePedidos();
            setPedidos(listaDePedidos || []);
        } catch (err: any) {
            setErro(err.message || "Erro ao carregar pedidos.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarPedidos();
    }, []);

    const pedidosFiltrados: PedidoDTO[] = pedidos.filter((pedido) =>
        (pedido.nomeCliente || "")
            .toLowerCase()
            .startsWith(pesquisa.toLowerCase())
    );

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>Histórico de Pedidos e Vendas</h2>
                    <p>Lista de todas as vendas e pedidos efetuados</p>
                </div>
                <Link to="/cadastro/pedido" className="btn-novo">
                    + Novo Pedido
                </Link>
            </div>

            <div style={{ marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Pesquisar pedido pelo nome do cliente..."
                    value={pesquisa}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPesquisa(e.target.value)
                    }
                />
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}

            {carregando ? (
                <p className="mensagem-carregando">Carregando pedidos...</p>
            ) : (
                <TabelaPedidos pedidos={pedidosFiltrados} />
            )}
        </main>
    );
}

export default PListagemPedido;