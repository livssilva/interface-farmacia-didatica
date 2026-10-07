import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ClienteDTO from "../../dto/ClienteDTO";
import ClienteRequests from "../../fetch/ClienteRequests";
import FormCliente from "../../components/Formularios/FormCliente";

function PCadastroCliente(): JSX.Element {
    const [sucesso, setSucesso] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCadastrarCliente = async (cliente: ClienteDTO) => {
        setSucesso(null);
        await ClienteRequests.cadastrarCliente(cliente);
        setSucesso("Cliente cadastrado com sucesso!");
        setTimeout(() => {
            navigate("/lista/clientes");
        }, 1200);
    };

    return (
        <main className="pagina-conteudo">
            <div className="pagina-cabecalho">
                <div>
                    <h2>Cadastrar Novo Cliente</h2>
                    <p>Preencha os dados do cliente</p>
                </div>
                <Link to="/lista/clientes" className="btn-voltar">
                    Voltar para a Lista
                </Link>
            </div>

            {sucesso && <div className="alerta-sucesso">{sucesso} Redirecionando...</div>}

            <FormCliente aoSubmeter={handleCadastrarCliente} />
        </main>
    );
}

export default PCadastroCliente;
