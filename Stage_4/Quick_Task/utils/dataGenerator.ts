// Bloque de generación de datos:
// Crea valores únicos para identificar cada ejecución sin reutilizar datos fijos.
export function generateRandomName(): string {
  return `QA_User_${Date.now()}`;
}

export function generateRandomEmail(): string {
  return `qa_${Date.now()}@test.com`;
}
