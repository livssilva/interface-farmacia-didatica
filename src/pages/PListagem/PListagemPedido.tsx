import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PedidoDTO from "../../dto/PedidoDTO";
import PedidoRequests from "../../fetch/PedidoRequests";
import TabelaPedidos from "../../components/Listagens/TabelaPedidos";

function PListagemPedido(): JSX.Element {
    const [pedidos, setPedidos] = useState<PedidoDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

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

            {erro && <div className="alerta-erro">{erro}</div>}

            {carregando ? (
                <p className="mensagem-carregando">Carregando pedidos...</p>
            ) : (
                <TabelaPedidos pedidos={pedidos} />
            )}
        </main>
    );
}

export default PListagemPedido;
