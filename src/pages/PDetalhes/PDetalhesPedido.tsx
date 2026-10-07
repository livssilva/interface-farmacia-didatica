import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import PedidoDTO from "../../dto/PedidoDTO";
import ItemPedidoDTO from "../../dto/ItemPedidoDTO";
import ProdutoDTO from "../../dto/ProdutoDTO";
import PedidoRequests from "../../fetch/PedidoRequests";
import ItemPedidoRequests from "../../fetch/ItemPedidoRequests";
import ProdutoRequests from "../../fetch/ProdutoRequests";

function PDetalhesPedido(): JSX.Element {
    const { id } = useParams<{ id: string }>();
    const [pedido, setPedido] = useState<PedidoDTO | null>(null);
    const [itens, setItens] = useState<ItemPedidoDTO[]>([]);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    // Estado para adicionar item adicional ao pedido
    const [idProdutoNovo, setIdProdutoNovo] = useState<number | "">("");
    const [qtdNovo, setQtdNovo] = useState<string>("1");
    const [adicionando, setAdicionando] = useState(false);

    const carregarPedido = useCallback(async () => {
        if (!id) return;
        try {
            setCarregando(true);
            setErro(null);
            const dados = await PedidoRequests.obterPedidoPorId(Number(id));
            setPedido(dados.pedido);
            setItens(dados.itens || []);

            const listaProdutos = await ProdutoRequests.obterListaDeProdutos();
            setProdutos(listaProdutos || []);
        } catch (err: any) {
            setErro(err.message || "Erro ao carregar detalhes do pedido.");
        } finally {
            setCarregando(false);
        }
    }, [id]);

    useEffect(() => {
        carregarPedido();
    }, [carregarPedido]);

    const handleAdicionarItemAoPedido = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !idProdutoNovo) return;

        const prod = produtos.find(p => p.idProduto === Number(idProdutoNovo));
        if (!prod) return;

        const quantidadeNum = parseInt(qtdNovo, 10);
        if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
            setErro("A quantidade deve ser maior que 0.");
            return;
        }

        try {
            setAdicionando(true);
            setErro(null);
            setSucesso(null);

            await PedidoRequests.adicionarItemAoPedido(Number(id), {
                idProduto: Number(prod.idProduto),
                qtdProduto: quantidadeNum,
                precoUnit: Number(prod.preco)
            });

            setSucesso("Item adicionado ao pedido com sucesso!");
            setIdProdutoNovo("");
            setQtdNovo("1");
            await carregarPedido();
        } catch (err: any) {
            setErro(err.message || "Erro ao adicionar item ao pedido.");
        } finally {
            setAdicionando(false);
        }
    };

    const handleRemoverItem = async (idProduto: number) => {
        if (!id) return;
        if (!window.confirm("Deseja realmente remover este item do pedido?")) return;

        try {
            setErro(null);
            setSucesso(null);
            await ItemPedidoRequests.removerItem(Number(id), idProduto);
            setSucesso("Item removido do pedido com sucesso!");
            await carregarPedido();
        } catch (err: any) {
            setErro(err.message || "Erro ao remover item.");
        }
    };

    const totalPedido = itens.reduce((acc, item) => acc + (item.qtdProduto * item.precoUnit), 0);

    const formatarData = (dataStr?: string) => {
        if (!dataStr) return "N/A";
        const data = new Date(dataStr);
        return isNaN(data.getTime()) ? dataStr : data.toLocaleString("pt-BR");
    };

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>Detalhes do Pedido #{id}</h2>
                    <p>Informações da venda e produtos associados</p>
                </div>
                <Link to="/lista/pedidos" className="btn-voltar">
                    Voltar para a Lista de Pedidos
                </Link>
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso}</div>}

            {carregando ? (
                <p className="mensagem-carregando">Carregando dados do pedido...</p>
            ) : !pedido ? (
                <p className="mensagem-vazia">Pedido não encontrado.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="card-detalhes">
                        <h3>Informações Gerais</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Número do Pedido:</span>
                                <span className="info-valor">#{pedido.idVenda}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Cliente:</span>
                                <span className="info-valor">
                                    {pedido.nomeCliente || `Cliente ID: ${pedido.idCliente}`}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Data da Venda:</span>
                                <span className="info-valor">{formatarData(pedido.dataVenda)}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Valor Total:</span>
                                <span className="info-valor" style={{ color: "#1e3a8a", fontWeight: "bold" }}>
                                    R$ {totalPedido.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="tabela-container">
                        <table className="tabela-dados">
                            <thead>
                                <tr>
                                    <th>ID Prod.</th>
                                    <th>Descrição</th>
                                    <th>Quantidade</th>
                                    <th>Preço Unit.</th>
                                    <th>Subtotal</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itens.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "1.5rem" }}>
                                            Nenhum item associado a este pedido.
                                        </td>
                                    </tr>
                                ) : (
                                    itens.map((item, index) => (
                                        <tr key={item.idProduto || index}>
                                            <td>{item.idProduto}</td>
                                            <td><strong>{item.descricao || `Produto #${item.idProduto}`}</strong></td>
                                            <td>{item.qtdProduto}</td>
                                            <td>R$ {Number(item.precoUnit).toFixed(2)}</td>
                                            <td>R$ {(item.qtdProduto * item.precoUnit).toFixed(2)}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleRemoverItem(item.idProduto)}
                                                    className="btn-remover-item"
                                                >
                                                    Remover
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {itens.length > 0 && (
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} style={{ textAlign: "right", fontWeight: "bold", padding: "1rem" }}>
                                            Total Geral:
                                        </td>
                                        <td colSpan={2} style={{ fontWeight: "bold", color: "#1e3a8a", fontSize: "1.05rem" }}>
                                            R$ {totalPedido.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>

                    {/* Formulário para adicionar mais itens ao pedido existente */}
                    <div className="card-detalhes">
                        <h3>Adicionar Item a Este Pedido</h3>
                        <form onSubmit={handleAdicionarItemAoPedido} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end", marginTop: "1rem" }}>
                            <div className="campo-form" style={{ flex: 2, minWidth: "220px" }}>
                                <label htmlFor="novoProduto">Produto</label>
                                <select
                                    id="novoProduto"
                                    value={idProdutoNovo}
                                    onChange={(e) => setIdProdutoNovo(e.target.value ? Number(e.target.value) : "")}
                                    required
                                >
                                    <option value="">-- Selecione o Produto --</option>
                                    {produtos.map(p => (
                                        <option key={p.idProduto} value={p.idProduto}>
                                            {p.descricao} - R$ {Number(p.preco).toFixed(2)} (Estoque: {p.qtdEstoque})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo-form" style={{ flex: 1, minWidth: "100px" }}>
                                <label htmlFor="novaQtd">Quantidade</label>
                                <input
                                    id="novaQtd"
                                    type="number"
                                    min="1"
                                    value={qtdNovo}
                                    onChange={(e) => setQtdNovo(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-adicionar-item"
                                disabled={adicionando || !idProdutoNovo}
                                style={{ height: "42px" }}
                            >
                                {adicionando ? "Adicionando..." : "+ Adicionar Item"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default PDetalhesPedido;
