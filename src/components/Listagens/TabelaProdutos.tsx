import ProdutoDTO from "../../dto/ProdutoDTO";
import "./Listagens.css";

interface TabelaProdutosProps {
    produtos: ProdutoDTO[];
    aoEditar?: (produto: ProdutoDTO) => void;
}

function TabelaProdutos({ produtos, aoEditar }: TabelaProdutosProps): JSX.Element {
    if (produtos.length === 0) {
        return <p className="mensagem-vazia">Nenhum produto encontrado.</p>;
    }

    const formatarData = (dataStr?: string | null) => {
        if (!dataStr) return "N/A";
        const data = new Date(dataStr);
        return isNaN(data.getTime()) ? dataStr : data.toLocaleDateString("pt-BR");
    };

    const formatarMoeda = (valor: number) => {
        return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    return (
        <div className="tabela-container">
            <table className="tabela-dados">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Estoque Mín.</th>
                        <th>Validade</th>
                        <th>Status</th>
                        {aoEditar && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto, index) => {
                        const emAlerta = produto.emAlerta || produto.qtdEstoque <= produto.qtdMinEstoque;
                        return (
                            <tr key={produto.idProduto || index} className={emAlerta ? "linha-alerta" : ""}>
                                <td>{produto.idProduto ?? "-"}</td>
                                <td><strong>{produto.descricao}</strong></td>
                                <td>{formatarMoeda(produto.preco)}</td>
                                <td>
                                    <span className={emAlerta ? "tag-alerta" : "tag-normal"}>
                                        {produto.qtdEstoque}
                                    </span>
                                </td>
                                <td>{produto.qtdMinEstoque}</td>
                                <td>{formatarData(produto.validade)}</td>
                                <td>
                                    {emAlerta ? (
                                        <span className="badge badge-perigo">Estoque Baixo</span>
                                    ) : (
                                        <span className="badge badge-sucesso">Normal</span>
                                    )}
                                </td>
                                {aoEditar && (
                                    <td>
                                        <button 
                                            className="btn-acao-editar"
                                            onClick={() => aoEditar(produto)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaProdutos;
