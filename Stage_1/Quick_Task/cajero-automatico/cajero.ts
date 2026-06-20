import * as readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

interface Cuenta {
  numero: string;
  titular: string;
  saldo: number;
}

interface Transaccion {
  tipo: string;
  numeroCuenta: string;
  monto: number;
  saldoFinal: number;
}

const cuentas: Cuenta[] = [];
const transacciones: Transaccion[] = [];

function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pregunta, (respuesta) => {
      resolve(respuesta);
    });
  });
}

//Función para registrar una nueva cuenta
async function registrarCuenta() {
  if (cuentas.length >= 10) {
    console.log("No se pueden registrar más de 10 cuentas.\n");
    return;
  }

  //Validar que el número de cuenta tenga exactamente 4 dígitos
  const numero = await preguntar("Número de cuenta (4 dígitos): ");
  if (!/^\d{4}$/.test(numero)) {
    console.log("El número de cuenta debe tener exactamente 4 dígitos.\n");

    return;
  }

  //Validar si existe la cuenta
  const cuentaExistente = cuentas.find((cuenta) => cuenta.numero === numero);
  if (cuentaExistente) {
    console.log("Ya existe una cuenta con ese número.\n");
    return;
  }

  const titular = await preguntar("Nombre del titular: ");
  const saldoTexto = await preguntar("Saldo inicial: ");

  const saldo = Number(saldoTexto);
  //Validar que el saldo inicial sea un número mayor o igual a 0
  if (Number.isNaN(saldo) || saldo < 0) {
    console.log("El saldo inicial debe ser un número mayor o igual a 0.\n");
    return;
  }
  const cuenta: Cuenta = {
    numero,
    titular,
    saldo,
  };

  cuentas.push(cuenta);

  console.log("Cuenta registrada correctamente.\n");
  console.log("-------------------------------\n");
}

async function main() {
  console.log("=== CAJERO AUTOMÁTICO QAX ===\n");
  await registrarCuenta();

  //Función para mostrar el menú de operaciones
  function mostrarMenu() {
    console.log("Seleccione una operación:");
    console.log("1. Consultar saldo");
    console.log("2. Depositar");
    console.log("3. Retirar");
    console.log("4. Registrar otra cuenta");
    console.log("000. Finalizar");
  }

  let opcion = "";

  //Función para seleccionar una cuenta por su número
  async function seleccionarCuenta(): Promise<Cuenta | undefined> {
    const numero = await preguntar("\nIngrese número de cuenta: ");

    const cuenta = cuentas.find((cuenta) => cuenta.numero === numero);

    if (!cuenta) {
      console.log("Cuenta no encontrada.\n");
      return undefined;
    }

    return cuenta;
  }

  //Función para consultar el saldo de una cuenta
  async function consultarSaldo() {
    const cuenta = await seleccionarCuenta();

    if (!cuenta) {
      return;
    }

    console.log(`Titular: ${cuenta.titular}`);
    console.log(`Saldo actual: $${cuenta.saldo}\n`);
    console.log("-------------------------------\n");
  }

  //Función para depositar dinero en una cuenta
  async function depositar() {
    const cuenta = await seleccionarCuenta();

    if (!cuenta) {
      return;
    }

    const montoTexto = await preguntar("Monto a depositar: ");
    const monto = Number(montoTexto);

    if (Number.isNaN(monto) || monto <= 0) {
      console.log("El monto a depositar debe ser mayor a 0.\n");
      console.log("-------------------------------\n");
      return;
    }

    cuenta.saldo += monto;

    transacciones.push({
      tipo: "Depósito",
      numeroCuenta: cuenta.numero,
      monto,
      saldoFinal: cuenta.saldo,
    });

    console.log(`Depósito exitoso. Nuevo saldo: $${cuenta.saldo}\n`);
    console.log("-------------------------------\n");
  }

  //Función para retirar dinero de una cuenta
  async function retirar() {
    const cuenta = await seleccionarCuenta();

    if (!cuenta) {
      return;
    }

    const montoTexto = await preguntar("Monto a retirar: ");
    const monto = Number(montoTexto);

    if (Number.isNaN(monto) || monto <= 0) {
      console.log("El monto a retirar debe ser mayor a 0.\n");
      console.log("-------------------------------\n");
      return;
    }

    if (monto > 10000) {
      console.log("Límite de retiro excedido.\n");
      console.log("-------------------------------\n");
      return;
    }

    if (monto > cuenta.saldo) {
      console.log("Fondos insuficientes.\n");
      console.log("-------------------------------\n");
      return;
    }

    cuenta.saldo -= monto;
    transacciones.push({
      tipo: "Retiro",
      numeroCuenta: cuenta.numero,
      monto,
      saldoFinal: cuenta.saldo,
    });
    console.log(`Retiro exitoso. Nuevo saldo: $${cuenta.saldo}\n`);
    console.log("-------------------------------\n");
  }

  //Función para mostrar el resumen final de todas las cuentas
  function mostrarResumenFinal() {
    console.log("\n=== RESUMEN FINAL ===");

    if (cuentas.length === 0) {
      console.log("No hay cuentas registradas.");
      return;
    }

    for (const cuenta of cuentas) {
      console.log(`Cuenta: ${cuenta.numero}`);
      console.log(`Titular: ${cuenta.titular}`);
      console.log(`Saldo final: $${cuenta.saldo}`);
      console.log("--------------------");
    }
  }
  //Función para mostrar el resumen de todas las transacciones realizadas
  function mostrarResumenTransacciones() {
    console.log("\n=== RESUMEN DE TRANSACCIONES ===");

    if (transacciones.length === 0) {
      console.log("No se realizaron transacciones.");
      return;
    }

    for (const transaccion of transacciones) {
      console.log(`Tipo: ${transaccion.tipo}`);
      console.log(`Cuenta: ${transaccion.numeroCuenta}`);
      console.log(`Monto: $${transaccion.monto}`);
      console.log(`Saldo final: $${transaccion.saldoFinal}`);
      console.log("------------------------");
    }
  }

  while (opcion !== "000") {
    mostrarMenu();
    opcion = await preguntar("Opción: ");

    if (opcion === "1") {
      await consultarSaldo();
    } else if (opcion === "2") {
      await depositar();
    } else if (opcion === "3") {
      await retirar();
    } else if (opcion === "4") {
      console.log("-------------------------------\n");
      await registrarCuenta();
    } else if (opcion !== "000") {
      console.log("Opción inválida.\n");
    }
  }
  mostrarResumenFinal();
  mostrarResumenTransacciones();
  rl.close();
}

main();
