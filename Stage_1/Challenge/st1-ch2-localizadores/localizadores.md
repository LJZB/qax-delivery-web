# Challenge 2 - Localizando elementos

## Descripción

Este documento contiene la identificación de localizadores para diferentes páginas de la suite **QAX Sandbox** usando Playwright.

El objetivo es reconocer elementos interactivos y visibles en cada página, documentando el localizador más adecuado según las buenas prácticas de automatización web.

## Estrategia de localización

Para seleccionar los elementos se usará la siguiente prioridad:

1. `getByRole()` para botones, enlaces y elementos con roles accesibles.
2. `getByText()` para textos visibles o etiquetas identificables.
3. `getByPlaceholder()` para campos de entrada con placeholder.
4. `locator()` con CSS solo cuando no exista una mejor alternativa semántica.
5. XPath solo como último recurso.

## URLs analizadas

| Página               | URL                                                           |
| -------------------- | ------------------------------------------------------------- |
| QAX Bank - Login     | https://qaxpert.com/lab/sites/stage-1/bank/index.html         |
| QAX Bank - Dashboard | https://qaxpert.com/lab/sites/stage-1/bank/dashboard.html     |
| QAX Bank - Historial | https://qaxpert.com/lab/sites/stage-1/bank/history.html       |
| QAX Clinic - Login   | https://qaxpert.com/lab/sites/stage-1/clinic/index.html       |
| QAX Clinic - Reserva | https://qaxpert.com/lab/sites/stage-1/clinic/appointment.html |
| QAX Shop - Catálogo  | https://qaxpert.com/lab/sites/stage-1/shop/index.html         |

## Localizadores identificados

| Página               | Elemento                        | Localizador usado                                                                | Acción              |
| -------------------- | ------------------------------- | -------------------------------------------------------------------------------- | ------------------- |
| QAX Bank - Login     | Encabezado principal            | `getByRole('heading', { name: 'QAX BANK' })`                                     | validar visibilidad |
| QAX Bank - Login     | Texto descriptivo               | `getByText('Banca Digital · Su dinero, seguro')`                                 | validar visibilidad |
| QAX Bank - Login     | Campo correo electrónico        | `getByPlaceholder('ej. cliente@qaxbank.com')`                                    | fill                |
| QAX Bank - Login     | Campo contraseña                | `getByPlaceholder('Ingrese su contraseña')`                                      | fill                |
| QAX Bank - Login     | Botón ingresar                  | `getByRole('button', { name: 'Ingresar' })`                                      | click               |
| QAX Bank - Dashboard | Mensaje de bienvenida principal | `getByRole('heading', { name: 'Hola, Carlos Andrés López' })`                    | validar visibilidad |
| QAX Bank - Dashboard | Tipo de cuenta                  | `getByText('Cuenta de Ahorros')`                                                 | validar visibilidad |
| QAX Bank - Dashboard | Saldo cuenta de ahorros         | `getByText('$ 1.845.000 COP')`                                                   | validar visibilidad |
| QAX Bank - Dashboard | Sección últimos movimientos     | `getByRole('heading', { name: 'Últimos Movimientos' })`                          | validar visibilidad |
| QAX Bank - Dashboard | Movimiento supermercado         | `getByText('Supermercado Éxito')`                                                | validar visibilidad |
| QAX Bank - Dashboard | Usuario en barra superior       | `getByText('Bienvenido, Carlos')`                                                | validar visibilidad |
| QAX Bank - Dashboard | Botón cerrar sesión             | `getByRole('button', { name: 'Cerrar Sesión' })`                                 | click               |
| QAX Bank - Historial | Enlace volver al panel          | `getByRole('link', { name: '← Panel' })`                                         | click               |
| QAX Bank - Historial | Botón cerrar sesión             | `getByRole('button', { name: 'Cerrar Sesión' })`                                 | click               |
| QAX Bank - Historial | Total créditos                  | `getByText('Total Créditos')`                                                    | validar visibilidad |
| QAX Bank - Historial | Valor total créditos            | `getByText('$ 7.065.600 COP')`                                                   | validar visibilidad |
| QAX Bank - Historial | Total débitos                   | `getByText('Total Débitos')`                                                     | validar visibilidad |
| QAX Bank - Historial | Valor total débitos             | `getByText('$ 1.716.400 COP')`                                                   | validar visibilidad |
| QAX Bank - Historial | Total transacciones             | `getByText('Transacciones')`                                                     | validar visibilidad |
| QAX Bank - Historial | Campo buscar descripción        | `getByPlaceholder('Buscar por descripción...')`                                  | fill                |
| QAX Bank - Historial | Movimiento servicios públicos   | `getByText('Pago Servicios Públicos EPM')`                                       | validar visibilidad |
| QAX Clinic - Login   | Encabezado principal            | `getByRole('heading', { name: 'QAX Clinic' })`                                   | validar visibilidad |
| QAX Clinic - Login   | Texto descriptivo               | `getByText('Sistema de Reserva de Citas Médicas')`                               | validar visibilidad |
| QAX Clinic - Login   | Campo documento                 | `getByLabel('Documento de Identidad')`                                           | fill                |
| QAX Clinic - Login   | Campo contraseña                | `getByPlaceholder('Ingrese su contraseña')`                                      | fill                |
| QAX Clinic - Login   | Botón ingresar                  | `getByRole('button', { name: 'Ingresar' })`                                      | click               |
| QAX Clinic - Reserva | Usuario en barra superior       | `getByText('Paciente: María Camila Restrepo')`                                   | validar visibilidad |
| QAX Clinic - Reserva | Botón cerrar sesión             | `getByRole('button', { name: 'Cerrar Sesión' })`                                 | click               |
| QAX Clinic - Reserva | Campo centro médico             | `getByLabel('Centro Médico')`                                                    | selectOption        |
| QAX Clinic - Reserva | Pregunta readmisión             | `getByText('¿Aplica readmisión hospitalaria?')`                                  | validar visibilidad |
| QAX Clinic - Reserva | Campo programa de salud         | `getByLabel('Programa de Salud')`                                                | selectOption        |
| QAX Clinic - Reserva | Campo fecha de visita           | `getByLabel('Fecha de Visita')`                                                  | fill                |
| QAX Clinic - Reserva | Campo comentarios adicionales   | `getByPlaceholder('Describa sus síntomas, alergias o información relevante...')` | fill                |
| QAX Clinic - Reserva | Botón reservar cita             | `getByRole('button', { name: 'Reservar Cita' })`                                 | click               |
| QAX Shop - Catálogo  | Enlace marca QAX Shop           | `getByRole('link', { name: 'QAX Shop' })`                                        | click               |
| QAX Shop - Catálogo  | Campo buscar productos          | `getByPlaceholder('Buscar productos...')`                                        | fill                |
| QAX Shop - Catálogo  | Enlace carrito                  | `getByRole('link', { name: /🛒/ })`                                              | click               |
| QAX Shop - Catálogo  | Contador del carrito            | `getByText('0')`                                                                 | validar visibilidad |
| QAX Shop - Catálogo  | Encabezado catálogo             | `getByRole('heading', { name: 'Catálogo de Productos' })`                        | validar visibilidad |
| QAX Shop - Catálogo  | Subtítulo catálogo              | `getByText('Productos auténticos de América Latina')`                            | validar visibilidad |
| QAX Shop - Catálogo  | Producto café colombiano        | `getByText('Café Colombiano Premium 500g')`                                      | validar visibilidad |
| QAX Shop - Catálogo  | Precio café colombiano          | `getByText('$ 45.000 COP')`                                                      | validar visibilidad |
| QAX Shop - Catálogo  | Botón agregar café al carrito   | `getByRole('button', { name: 'Agregar al Carrito' }).first()`                    | click               |
| QAX Shop - Catálogo  | Producto mochila wayúu          | `getByText('Mochila Wayúu Artesanal')`                                           | validar visibilidad |
| QAX Shop - Catálogo  | Precio mochila wayúu            | `getByText('$ 185.000 COP')`                                                     | validar visibilidad |
| QAX Shop - Catálogo  | Producto chocolate orgánico     | `getByText('Chocolate Orgánico Ecuatoriano')`                                    | validar visibilidad |
| QAX Shop - Catálogo  | Precio chocolate orgánico       | `getByText('$ 32.000 COP')`                                                      | validar visibilidad |
