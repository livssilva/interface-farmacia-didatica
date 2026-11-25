import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProdutoDTO from "../../dto/ProdutoDTO";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import TabelaProdutos from "../../components/Listagens/TabelaProdutos";

function PListagemProduto(): JSX.Element {
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);
    const [pesquisa, setPesquisa] = useState<string>("");
    const navigate = useNavigate();

    const buscarProdutos = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const listaDeProdutos = await ProdutoRequests.obterListaDeProdutos();
            setProdutos(listaDeProdutos || []);
        } catch (err: any) {
            setErro(err.message || "Erro ao carregar produtos.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarProdutos();
    }, []);

    const handleEditar = (produto: ProdutoDTO) => {
        navigate(`/cadastro/produto`, { state: { produtoParaEditar: produto } });
    };

    const produtosFiltrados: ProdutoDTO[] = produtos.filter((produto) =>
        (produto.descricao || "")
            .toLowerCase()
            .startsWith(pesquisa.toLowerCase())
    );

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>Lista de Produtos</h2>
                    <p>Medicamentos e itens disponíveis no estoque</p>
                </div>
                <div className="acoes-cabecalho">
                    <Link to="/lista/produtos/alerta" className="btn-alerta-link">
                        ⚠️ Ver Alertas de Estoque
                    </Link>
                    <Link to="/cadastro/produto" className="btn-novo">
                        + Novo Produto
                    </Link>
                </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Pesquisar produto pela descrição..."
                    value={pesquisa}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPesquisa(e.target.value)
                    }
                />
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}

            {carregando ? (
                <p className="mensagem-carregando">Carregando catálogo de produtos...</p>
            ) : (
                <TabelaProdutos produtos={produtosFiltrados} aoEditar={handleEditar} />
            )}
        </main>
    );
}

export default PListagemProduto;