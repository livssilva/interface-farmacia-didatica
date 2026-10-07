import { useState } from "react";
import ClienteDTO from "../../dto/ClienteDTO";
import ProdutoDTO from "../../dto/ProdutoDTO";
import { formatarCpf } from "../../utils/formatadorCpf";
import "./Formularios.css";

interface ItemCarrinho {
    idProduto: number;
    descricao: string;
    qtdProduto: number;
    precoUnit: number;
}

interface FormPedidoProps {
    clientes: ClienteDTO[];
    produtos: ProdutoDTO[];
    aoSubmeter: (dados: { idCliente: number; itens: { idProduto: number; qtdProduto: number; precoUnit: number }[] }) => Promise<void>;
}

function FormPedido({ clientes, produtos, aoSubmeter }: FormPedidoProps): JSX.Element {
    const [idCliente, setIdCliente] = useState<number | "">("");
    const [idProdutoSel, setIdProdutoSel] = useState<number | "">("");
    const [qtd, setQtd] = useState<string>("1");
    const [itens, setItens] = useState<ItemCarrinho[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const produtoSelecionado = produtos.find(p => p.idProduto === Number(idProdutoSel));

    const handleAdicionarItem = () => {
        setErro(null);
        if (!idProdutoSel || !produtoSelecionado) {
            setErro("Selecione um produto para adicionar.");
            return;
        }

        const quantidadeNum = parseInt(qtd, 10);
        if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
            setErro("A quantidade deve ser maior que 0.");
            return;
        }

        if (quantidadeNum > produtoSelecionado.qtdEstoque) {
            setErro(`Quantidade solicitada (${quantidadeNum}) excede o estoque disponível (${produtoSelecionado.qtdEstoque}).`);
            return;
        }

        const indexExistente = itens.findIndex(i => i.idProduto === produtoSelecionado.idProduto);
        if (indexExistente >= 0) {
            const novosItens = [...itens];
            novosItens[indexExistente].qtdProduto += quantidadeNum;
            setItens(novosItens);
        } else {
            setItens([
                ...itens,
                {
                    idProduto: Number(produtoSelecionado.idProduto),
                    descricao: produtoSelecionado.descricao,
                    qtdProduto: quantidadeNum,
                    precoUnit: Number(produtoSelecionado.preco)
                }
            ]);
        }

        setIdProdutoSel("");
        setQtd("1");
    };

    const handleRemoverItem = (idProduto: number) => {
        setItens(itens.filter(i => i.idProduto !== idProduto));
    };

    const totalPedido = itens.reduce((acc, item) => acc + (item.qtdProduto * item.precoUnit), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);

        if (!idCliente) {
            setErro("Selecione o cliente do pedido.");
            return;
        }

        if (itens.length === 0) {
            setErro("Adicione ao menos um item ao pedido.");
            return;
        }

        try {
            setCarregando(true);
            await aoSubmeter({
                idCliente: Number(idCliente),
                itens: itens.map(i => ({
                    idProduto: i.idProduto,
                    qtdProduto: i.qtdProduto,
                    precoUnit: i.precoUnit
                }))
            });

            setIdCliente("");
            setItens([]);
        } catch (err: any) {
            setErro(err.message || "Erro ao registrar pedido.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario">
            {erro && <div className="alerta-erro">{erro}</div>}

            <div className="campo-form">
                <label htmlFor="cliente">Cliente *</label>
                <select
                    id="cliente"
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value ? Number(e.target.value) : "")}
                    required
                >
                    <option value="">-- Selecione o Cliente --</option>
                    {clientes.map(c => (
                        <option key={c.idCliente} value={c.idCliente}>
                            {c.nome} (CPF: {formatarCpf(c.cpf)})
                        </option>
                    ))}
                </select>
            </div>

            <fieldset className="secao-itens">
                <legend>Adicionar Produtos ao Pedido</legend>

                <div className="linha-campos">
                    <div className="campo-form" style={{ flex: 3 }}>
                        <label htmlFor="produto">Produto</label>
                        <select
                            id="produto"
                            value={idProdutoSel}
                            onChange={(e) => setIdProdutoSel(e.target.value ? Number(e.target.value) : "")}
                        >
                            <option value="">-- Selecione o Produto --</option>
                            {produtos.map(p => (
                                <option key={p.idProduto} value={p.idProduto}>
                                    {p.descricao} - R$ {Number(p.preco).toFixed(2)} (Estoque: {p.qtdEstoque})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-form" style={{ flex: 1 }}>
                        <label htmlFor="qtd">Quantidade</label>
                        <input
                            id="qtd"
                            type="number"
                            min="1"
                            value={qtd}
                            onChange={(e) => setQtd(e.target.value)}
                        />
                    </div>

                    <div className="campo-form" style={{ alignSelf: "flex-end" }}>
                        <button 
                            type="button" 
                            className="btn-adicionar-item"
                            onClick={handleAdicionarItem}
                        >
                            + Adicionar Item
                        </button>
                    </div>
                </div>

                <div className="tabela-carrinho-container">
                    <h4>Itens Selecionados ({itens.length})</h4>
                    {itens.length === 0 ? (
                        <p className="carrinho-vazio">Nenhum produto adicionado ainda.</p>
                    ) : (
                        <table className="tabela-carrinho">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Qtd</th>
                                    <th>Preço Unit.</th>
                                    <th>Subtotal</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itens.map((item) => (
                                    <tr key={item.idProduto}>
                                        <td>{item.descricao}</td>
                                        <td>{item.qtdProduto}</td>
                                        <td>R$ {item.precoUnit.toFixed(2)}</td>
                                        <td>R$ {(item.qtdProduto * item.precoUnit).toFixed(2)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn-remover-item"
                                                onClick={() => handleRemoverItem(item.idProduto)}
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3}><strong>Total do Pedido:</strong></td>
                                    <td colSpan={2}><strong>R$ {totalPedido.toFixed(2)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </fieldset>

            <button type="submit" className="btn-salvar" disabled={carregando || itens.length === 0}>
                {carregando ? "Finalizando Pedido..." : `Finalizar Pedido (Total: R$ ${totalPedido.toFixed(2)})`}
            </button>
        </form>
    );
}

export default FormPedido;
