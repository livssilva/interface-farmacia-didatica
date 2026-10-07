export type TipoTema = "light" | "dark";

const CHAVE_TEMA = "farmacia_tema";

export function obterTemaAtual(): TipoTema {
    const salvo = localStorage.getItem(CHAVE_TEMA) as TipoTema | null;
    if (salvo === "light" || salvo === "dark") {
        return salvo;
    }
    // Caso não haja salvo, verifica preferência do sistema
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
}

export function aplicarTema(tema: TipoTema): void {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem(CHAVE_TEMA, tema);
}
