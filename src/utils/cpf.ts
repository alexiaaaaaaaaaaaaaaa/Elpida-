/** Remove tudo que não for dígito. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Aplica a máscara 000.000.000-00 enquanto o usuário digita. */
export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean);
  let formatted = parts.join('.');
  const lastTwo = digits.slice(9, 11);
  if (lastTwo) formatted += `-${lastTwo}`;
  return formatted;
}

/**
 * Valida um CPF usando o algoritmo oficial dos dígitos verificadores
 * (Receita Federal). Rejeita CPFs com todos os dígitos iguais
 * (000.000.000-00, 111.111.111-11, etc.), que são formalmente
 * inválidos mesmo passando pela conta dos dígitos.
 */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split('').map(Number);

  const calcCheckDigit = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += digits[i] * (length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const firstCheck = calcCheckDigit(9);
  const secondCheck = calcCheckDigit(10);

  return firstCheck === digits[9] && secondCheck === digits[10];
}
