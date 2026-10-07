import { Link } from "react-router-dom";
import "./BoasVindas.css";

function BoasVindas(): JSX.Element {
    return (
        <section className="boas-vindas">
            <div className="hero-banner">
                <h1>Bem-vindo ao Sistema da Farmácia Didática 🥼🧪</h1>
                <p>Gerencie clientes, controle de estoque de medicamentos e pedidos com facilidade.</p>
            </div>

            <div className="cards-grid">
                <div className="card-modulo">
                    <div className="card-icone">👥</div>
                    <h2>Clientes</h2>
                    <p>Cadastro e listagem de clientes do sistema.</p>
                    <div className="card-acoes">
                        <Link to="/lista/clientes" className="btn-link">Ver Clientes</Link>
                        <Link to="/cadastro/cliente" className="btn-link btn-link-primary">Cadastrar</Link>
                    </div>
                </div>

                <div className="card-modulo">
                    <div className="card-icone">💊</div>
                    <h2>Produtos</h2>
                    <p>Controle de catálogo, preços e níveis de estoque.</p>
                    <div className="card-acoes">
                        <Link to="/lista/produtos" className="btn-link">Ver Produtos</Link>
                        <Link to="/lista/produtos/alerta" className="btn-link btn-alerta">Alertas</Link>
                        <Link to="/cadastro/produto" className="btn-link btn-link-primary">Cadastrar</Link>
                    </div>
                </div>

                <div className="card-modulo">
                    <div className="card-icone">📦</div>
                    <h2>Pedidos</h2>
                    <p>Registro de novas vendas e consulta ao histórico de pedidos.</p>
                    <div className="card-acoes">
                        <Link to="/lista/pedidos" className="btn-link">Ver Pedidos</Link>
                        <Link to="/cadastro/pedido" className="btn-link btn-link-primary">Novo Pedido</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BoasVindas;
