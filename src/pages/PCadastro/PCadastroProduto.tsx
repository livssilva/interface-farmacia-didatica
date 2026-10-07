import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ProdutoDTO from "../../dto/ProdutoDTO";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import FormProduto from "../../components/Formularios/FormProduto";

function PCadastroProduto(): JSX.Element {
    const location = useLocation();
    const navigate = useNavigate();
    const produtoEdicao = (location.state as { produtoParaEditar?: ProdutoDTO } | undefined)?.produtoParaEditar;

    const [sucesso, setSucesso] = useState<string | null>(null);

    const handleSalvarProduto = async (produto: ProdutoDTO) => {
        setSucesso(null);

        if (produtoEdicao && produtoEdicao.idProduto) {
            await ProdutoRequests.atualizarProduto(produtoEdicao.idProduto, produto);
            setSucesso("Produto atualizado com sucesso!");
        } else {
            await ProdutoRequests.cadastrarProduto(produto);
            setSucesso("Produto cadastrado com sucesso!");
        }

        setTimeout(() => {
            navigate("/lista/produtos");
        }, 1200);
    };

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>{produtoEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}</h2>
                    <p>{produtoEdicao ? "Atualize as informações do medicamento/produto" : "Insira um novo medicamento no catálogo"}</p>
                </div>
                <Link to="/lista/produtos" className="btn-voltar">
                    Voltar para a Lista
                </Link>
            </div>

            {sucesso && <div className="alerta-sucesso">{sucesso} Redirecionando...</div>}

            <FormProduto 
                produtoInicial={produtoEdicao}
                aoSubmeter={handleSalvarProduto}
                aoCancelar={() => navigate("/lista/produtos")}
            />
        </main>
    );
}

export default PCadastroProduto;
