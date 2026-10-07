import { Link } from "react-router-dom";
import PedidoDTO from "../../dto/PedidoDTO";
import "./Listagens.css";

interface TabelaPedidosProps {
    pedidos: PedidoDTO[];
}

function TabelaPedidos({ pedidos }: TabelaPedidosProps): JSX.Element {
    if (pedidos.length === 0) {
        return <p className="mensagem-vazia">Nenhum pedido registrado até o momento.</p>;
    }

    const formatarData = (dataStr?: string) => {
        if (!dataStr) return "N/A";
        const data = new Date(dataStr);
        return isNaN(data.getTime()) ? dataStr : data.toLocaleString("pt-BR");
    };

    return (
        <div className="tabela-container">
            <table className="tabela-dados">
                <thead>
                    <tr>
                        <th>Nº Pedido (Venda)</th>
                        <th>Cliente</th>
                        <th>Data da Venda</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido, index) => (
                        <tr key={pedido.idVenda || index}>
                            <td>#{pedido.idVenda ?? "-"}</td>
                            <td>
                                <strong>{pedido.nomeCliente || `Cliente ID: ${pedido.idCliente}`}</strong>
                            </td>
                            <td>{formatarData(pedido.dataVenda)}</td>
                            <td>
                                <Link 
                                    to={`/pedidos/${pedido.idVenda}`}
                                    className="btn-detalhes"
                                >
                                    Ver Detalhes
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaPedidos;
