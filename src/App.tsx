import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuNavegacao from "./components/Navegacao/MenuNavegacao";
import Rodape from "./components/Rodape/Rodape";

// Páginas
import PHome from "./pages/PHome/PHome";
import PListagemCliente from "./pages/PListagem/PListagemCliente";
import PListagemProduto from "./pages/PListagem/PListagemProduto";
import PListagemAlertaProduto from "./pages/PListagem/PListagemAlertaProduto";
import PListagemPedido from "./pages/PListagem/PListagemPedido";
import PCadastroCliente from "./pages/PCadastro/PCadastroCliente";
import PCadastroProduto from "./pages/PCadastro/PCadastroProduto";
import PCadastroPedido from "./pages/PCadastro/PCadastroPedido";
import PDetalhesPedido from "./pages/PDetalhes/PDetalhesPedido";

import "./App.css";

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="app-container">
                <MenuNavegacao />
                <div className="conteudo-principal">
                    <Routes>
                        <Route path="/" element={<PHome />} />
                        
                        {/* Rotas de Clientes */}
                        <Route path="/lista/clientes" element={<PListagemCliente />} />
                        <Route path="/cadastro/cliente" element={<PCadastroCliente />} />

                        {/* Rotas de Produtos */}
                        <Route path="/lista/produtos" element={<PListagemProduto />} />
                        <Route path="/lista/produtos/alerta" element={<PListagemAlertaProduto />} />
                        <Route path="/cadastro/produto" element={<PCadastroProduto />} />

                        {/* Rotas de Pedidos */}
                        <Route path="/lista/pedidos" element={<PListagemPedido />} />
                        <Route path="/cadastro/pedido" element={<PCadastroPedido />} />
                        <Route path="/pedidos/:id" element={<PDetalhesPedido />} />
                    </Routes>
                </div>
                <Rodape />
            </div>
        </BrowserRouter>
    );
}

export default App;
