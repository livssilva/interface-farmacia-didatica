import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ClienteDTO from "../../dto/ClienteDTO";
import ProdutoDTO from "../../dto/ProdutoDTO";
import ClienteRequests from "../../fetch/ClienteRequests";
import ProdutoRequests from "../../fetch/ProdutoRequests";
import PedidoRequests from "../../fetch/PedidoRequests";
import FormPedido from "../../components/Formularios/FormPedido";

function PCadastroPedido(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const navigate = useNavigate();

    const carregarDadosAuxiliares = async () => {
        try {
            setCarregando(true);
            setErro(null);
            const [listaClientes, listaProdutos] = await Promise.all([
                ClienteRequests.obterListaDeClientes(),
                ProdutoRequests.obterListaDeProdutos()
            ]);
            setClientes(listaClientes || []);
            setProdutos(listaProdutos || []);
        } catch (err: any) {
            setErro(err.message || "Erro ao carregar dados de clientes e produtos.");
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarDadosAuxiliares();
    }, []);

    const handleSalvarPedido = async (dados: { idCliente: number; itens: { idProduto: number; qtdProduto: number; precoUnit: number }[] }) => {
        setSucesso(null);
        await PedidoRequests.cadastrarPedido(dados);
        setSucesso("Pedido registrado com sucesso!");
        setTimeout(() => {
            navigate("/lista/pedidos");
        }, 1200);
    };

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>Novo Pedido / Venda</h2>
                    <p>Selecione o cliente e os itens para registrar uma venda</p>
                </div>
                <Link to="/lista/pedidos" className="btn-voltar">
                    Voltar para a Lista de Pedidos
                </Link>
            </div>

            {erro && <div className="alerta-erro">{erro}</div>}
            {sucesso && <div className="alerta-sucesso">{sucesso} Redirecionando...</div>}

            {carregando ? (
                <p className="mensagem-carregando">Carregando formulário...</p>
            ) : clientes.length === 0 ? (
                <div className="alerta-aviso">
                    <p>É necessário ter ao menos um cliente cadastrado para criar um pedido.</p>
                    <Link to="/cadastro/cliente" className="btn-novo" style={{ marginTop: "1rem" }}>
                        Cadastrar Cliente Agora
                    </Link>
                </div>
            ) : produtos.length === 0 ? (
                <div className="alerta-aviso">
                    <p>É necessário ter produtos cadastrados para registrar um pedido.</p>
                    <Link to="/cadastro/produto" className="btn-novo" style={{ marginTop: "1rem" }}>
                        Cadastrar Produto Agora
                    </Link>
                </div>
            ) : (
                <FormPedido 
                    clientes={clientes}
                    produtos={produtos}
                    aoSubmeter={handleSalvarPedido}
                />
            )}
        </main>
    );
}

export default PCadastroPedido;
