import { useState, useEffect } from "react";
import ProdutoDTO from "../../dto/ProdutoDTO";
import "./Formularios.css";

interface FormProdutoProps {
    produtoInicial?: ProdutoDTO | null;
    aoSubmeter: (produto: ProdutoDTO) => Promise<void>;
    aoCancelar?: () => void;
}

function FormProduto({ produtoInicial, aoSubmeter, aoCancelar }: FormProdutoProps): JSX.Element {
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [qtdEstoque, setQtdEstoque] = useState("");
    const [qtdMinEstoque, setQtdMinEstoque] = useState("");
    const [validade, setValidade] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (produtoInicial) {
            setDescricao(produtoInicial.descricao || "");
            setPreco(produtoInicial.preco ? String(produtoInicial.preco) : "");
            setQtdEstoque(produtoInicial.qtdEstoque !== undefined ? String(produtoInicial.qtdEstoque) : "");
            setQtdMinEstoque(produtoInicial.qtdMinEstoque !== undefined ? String(produtoInicial.qtdMinEstoque) : "");
            
            if (produtoInicial.validade) {
                const dataVal = new Date(produtoInicial.validade);
                if (!isNaN(dataVal.getTime())) {
                    setValidade(dataVal.toISOString().split("T")[0]);
                }
            } else {
                setValidade("");
            }
        }
    }, [produtoInicial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);

        if (!descricao.trim() || preco === "" || qtdEstoque === "" || qtdMinEstoque === "") {
            setErro("Por favor, preencha os campos obrigatórios.");
            return;
        }

        try {
            setCarregando(true);
            const dados: ProdutoDTO = {
                idProduto: produtoInicial?.idProduto,
                descricao: descricao.trim(),
                preco: parseFloat(preco),
                qtdEstoque: parseInt(qtdEstoque, 10),
                qtdMinEstoque: parseInt(qtdMinEstoque, 10),
                validade: validade ? validade : null
            };

            await aoSubmeter(dados);

            if (!produtoInicial) {
                setDescricao("");
                setPreco("");
                setQtdEstoque("");
                setQtdMinEstoque("");
                setValidade("");
            }
        } catch (err: any) {
            setErro(err.message || "Erro ao salvar produto.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario">
            {erro && <div className="alerta-erro">{erro}</div>}

            <div className="campo-form">
                <label htmlFor="descricao">Descrição do Medicamento/Produto *</label>
                <input
                    id="descricao"
                    type="text"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: DIPIRONA 500MG COM 10 COMPRIMIDOS"
                    required
                />
            </div>

            <div className="linha-campos">
                <div className="campo-form">
                    <label htmlFor="preco">Preço Unitário (R$) *</label>
                    <input
                        id="preco"
                        type="number"
                        step="0.01"
                        min="0"
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                        placeholder="Ex: 9.90"
                        required
                    />
                </div>

                <div className="campo-form">
                    <label htmlFor="validade">Data de Validade</label>
                    <input
                        id="validade"
                        type="date"
                        value={validade}
                        onChange={(e) => setValidade(e.target.value)}
                    />
                </div>
            </div>

            <div className="linha-campos">
                <div className="campo-form">
                    <label htmlFor="qtdEstoque">Quantidade em Estoque *</label>
                    <input
                        id="qtdEstoque"
                        type="number"
                        min="0"
                        value={qtdEstoque}
                        onChange={(e) => setQtdEstoque(e.target.value)}
                        placeholder="Ex: 50"
                        required
                    />
                </div>

                <div className="campo-form">
                    <label htmlFor="qtdMinEstoque">Estoque Mínimo (Alerta) *</label>
                    <input
                        id="qtdMinEstoque"
                        type="number"
                        min="0"
                        value={qtdMinEstoque}
                        onChange={(e) => setQtdMinEstoque(e.target.value)}
                        placeholder="Ex: 10"
                        required
                    />
                </div>
            </div>

            <div className="botoes-form">
                <button type="submit" className="btn-salvar" disabled={carregando}>
                    {carregando ? "Salvando..." : produtoInicial ? "Salvar Alterações" : "Cadastrar Produto"}
                </button>
                {aoCancelar && (
                    <button type="button" className="btn-cancelar" onClick={aoCancelar} disabled={carregando}>
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}

export default FormProduto;
