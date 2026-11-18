export const PASSWORD_HINT = 'Mínimo 8 caracteres, con mayúscula, minúscula y número.'

export function passwordProblem(password: string): string | null {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'La contraseña debe incluir mayúscula, minúscula y número.'
  }
  return null
}
