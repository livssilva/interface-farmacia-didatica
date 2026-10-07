import "./Rodape.css";

function Rodape(): JSX.Element {
    return (
        <footer className="rodape">
            <p>&copy; {new Date().getFullYear()} Farmácia Didática - Sistema Acadêmico de Gestão Farmacêutica</p>
        </footer>
    );
}

export default Rodape;
