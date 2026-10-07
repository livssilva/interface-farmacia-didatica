import ClienteDTO from "../../dto/ClienteDTO";
import { formatarCpf } from "../../utils/formatadorCpf";
import "./Listagens.css";

interface TabelaClientesProps {
    clientes: ClienteDTO[];
}

function TabelaClientes({ clientes }: TabelaClientesProps): JSX.Element {
    if (clientes.length === 0) {
        return <p className="mensagem-vazia">Nenhum cliente cadastrado até o momento.</p>;
    }

    return (
        <div className="tabela-container">
            <table className="tabela-dados">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((cliente, index) => (
                        <tr key={cliente.idCliente || index}>
                            <td>{cliente.idCliente ?? "-"}</td>
                            <td><strong>{cliente.nome}</strong></td>
                            <td>{formatarCpf(cliente.cpf)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaClientes;
