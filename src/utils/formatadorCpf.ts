/**
 * Utilitários para formatação e validação de CPF.
 */

// Limpa caracteres não numéricos
export function limparCpf(cpf: string): string {
    return (cpf || "").replace(/\D/g, "");
}

// Formata string numérica para o padrão 000.000.000-00
export function formatarCpf(cpf: string): string {
    const apenasNumeros = limparCpf(cpf);
    if (!apenasNumeros) return "";
    
    if (apenasNumeros.length <= 3) {
        return apenasNumeros;
    }
    if (apenasNumeros.length <= 6) {
        return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    }
    if (apenasNumeros.length <= 9) {
        return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
    }
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
}

// Validação matemática do algoritmo oficial de CPF
export function validarCpf(cpf: string): boolean {
    const limpo = limparCpf(cpf);

    if (limpo.length !== 11) return false;

    // Rejeita sequências de números iguais como "111.111.111-11"
    if (/^(\d)\1{10}$/.test(limpo)) return false;

    let soma = 0;
    let resto: number;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(limpo.substring(i - 1, i), 10) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(limpo.substring(9, 10), 10)) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(limpo.substring(i - 1, i), 10) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(limpo.substring(10, 11), 10)) return false;

    return true;
}
