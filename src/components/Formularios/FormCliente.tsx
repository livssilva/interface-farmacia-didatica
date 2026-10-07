import { useState } from "react";
import ClienteDTO from "../../dto/ClienteDTO";
import { formatarCpf, limparCpf, validarCpf } from "../../utils/formatadorCpf";
import "./Formularios.css";

interface FormClienteProps {
    aoSubmeter: (cliente: ClienteDTO) => Promise<void>;
}

function FormCliente({ aoSubmeter }: FormClienteProps): JSX.Element {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valorMascarado = formatarCpf(e.target.value);
        if (limparCpf(e.target.value).length <= 11) {
            setCpf(valorMascarado);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);

        if (!nome.trim() || !cpf.trim()) {
            setErro("Por favor, preencha todos os campos.");
            return;
        }

        const cpfNumeros = limparCpf(cpf);
        if (cpfNumeros.length !== 11) {
            setErro("O CPF deve conter exatamente 11 dígitos numéricos.");
            return;
        }

        if (!validarCpf(cpfNumeros)) {
            setErro("CPF inválido. Por favor, verifique os números digitados.");
            return;
        }

        try {
            setCarregando(true);
            await aoSubmeter({
                nome: nome.trim(),
                cpf: cpf.trim()
            });
            setNome("");
            setCpf("");
        } catch (err: any) {
            setErro(err.message || "Erro ao salvar cliente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="formulario">
            {erro && <div className="alerta-erro">{erro}</div>}

            <div className="campo-form">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Maria Pereira da Silva"
                    required
                />
            </div>

            <div className="campo-form">
                <label htmlFor="cpf">CPF (com máscara e validação) *</label>
                <input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={handleCpfChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    required
                />
            </div>

            <button type="submit" className="btn-salvar" disabled={carregando}>
                {carregando ? "Salvando..." : "Cadastrar Cliente"}
            </button>
        </form>
    );
}

export default FormCliente;
