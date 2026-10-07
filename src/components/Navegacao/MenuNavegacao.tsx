import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obterTemaAtual, aplicarTema, type TipoTema } from "../../utils/gerenciadorTema";
import "./MenuNavegacao.css";

function MenuNavegacao(): JSX.Element {
    const [tema, setTema] = useState<TipoTema>("light");

    useEffect(() => {
        const temaInicial = obterTemaAtual();
        setTema(temaInicial);
        aplicarTema(temaInicial);
    }, []);

    const alternarTema = () => {
        const novoTema: TipoTema = tema === "light" ? "dark" : "light";
        setTema(novoTema);
        aplicarTema(novoTema);
    };

    return (
        <header className="menu-navegacao">
            <div className="menu-container">
                <div className="menu-logo">
                    <Link to="/">💊 Farmácia Didática</Link>
                </div>
                
                <nav className="menu-links">
                    <div className="menu-dropdown">
                        <span className="dropdown-title">Clientes ▾</span>
                        <div className="dropdown-content">
                            <Link to="/lista/clientes">Listar Clientes</Link>
                            <Link to="/cadastro/cliente">Novo Cliente</Link>
                        </div>
                    </div>

                    <div className="menu-dropdown">
                        <span className="dropdown-title">Produtos ▾</span>
                        <div className="dropdown-content">
                            <Link to="/lista/produtos">Listar Produtos</Link>
                            <Link to="/lista/produtos/alerta">Alerta de Estoque</Link>
                            <Link to="/cadastro/produto">Novo Produto</Link>
                        </div>
                    </div>

                    <div className="menu-dropdown">
                        <span className="dropdown-title">Pedidos ▾</span>
                        <div className="dropdown-content">
                            <Link to="/lista/pedidos">Listar Pedidos</Link>
                            <Link to="/cadastro/pedido">Novo Pedido</Link>
                        </div>
                    </div>

                    <button 
                        type="button" 
                        className="btn-tema-toggle"
                        onClick={alternarTema}
                        title={`Alternar para tema ${tema === "light" ? "escuro" : "claro"}`}
                    >
                        {tema === "light" ? "🌙 Escuro" : "☀️ Claro"}
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default MenuNavegacao;
