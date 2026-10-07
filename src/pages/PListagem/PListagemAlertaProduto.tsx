import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProdutoDTO from "../../dto/ProdutoDTO";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import TabelaProdutos from "../../components/Listagens/TabelaProdutos";

function PListagemAlertaProduto(): JSX.Element {
    const [produtosAlerta, setProdutosAlerta] = useState<ProdutoDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [erro, setErro] = useState<string | null>(null);

    const buscarProdutosAlerta = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const listaAlerta = await ProdutoRequests.obterProdutosEmAlerta();
            setProdutosAlerta(listaAlerta || []);
        } catch (err: any) {
            setErro(err.message || "Erro ao carregar produtos em alerta.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarProdutosAlerta();
    }, []);

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>⚠️ Alertas de Estoque</h2>
                    <p>Produtos com quantidade em estoque igual ou abaixo do nível mínimo de segurança</p>
                </div>
                <Link to="/lista/produtos" className="btn-voltar">
                    Voltar para Todos os Produtos
                </Link>
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}

            {carregando ? (
                <p className="mensagem-carregando">Verificando estoque dos produtos...</p>
            ) : produtosAlerta.length === 0 ? (
                <p className="mensagem-vazia">Nenhum produto em nível crítico de estoque no momento. ✅</p>
            ) : (
                <TabelaProdutos produtos={produtosAlerta} />
            )}
        </main>
    );
}

export default PListagemAlertaProduto;
