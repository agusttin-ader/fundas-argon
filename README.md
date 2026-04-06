# Fundas Argon

Sitio web + panel de administracion para **Fundas Argon**, marca de fundas artesanales semirrigidas para instrumentos musicales.

> Identidad de marca: fuerte, musical y profesional.  
> Objetivo: mostrar catalogo, captar consultas y facilitar gestion interna.

---

## Que incluye

- **Landing publica** con Hero, Catalogo, Personalizacion y Comentarios.
- **Detalle de producto** estilo ecommerce con variantes visuales y CTA a WhatsApp.
- **Panel admin** con autenticacion y CRUD de productos/comentarios/solicitudes.
- **Arquitectura preparada** para carrito y futura pasarela de pagos.
- **Tema claro/oscuro** consistente con soporte para preferencias del sistema.

---

## Stack tecnico

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **TanStack Query**
- **Firebase** (listo para integracion)
- **Zod**

---

## Scripts

```bash
npm run dev    # entorno local
npm run lint   # validacion de codigo
npm run build  # build de produccion
npm run start  # correr build en local
```

---

## Puesta en marcha local

1. Clonar repositorio.
2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo de entorno local (si aplica) tomando como base `.env.example`.
4. Levantar en desarrollo:

```bash
npm run dev
```

5. Abrir [http://localhost:3000](http://localhost:3000).

---

## Estructura principal

```text
src/
  app/                # rutas App Router (publicas + admin + producto)
  features/           # modulos funcionales (catalogo, admin, cart, shared)
  content/            # contenido de marca y textos globales
  lib/                # servicios, adapters y utilidades
  types/              # tipos de dominio y comercio
public/
  images/             # assets de marca
```

---

## Estado del proyecto

- **Listo para produccion** a nivel frontend.
- Build y lint validados.
- Integraciones futuras ya contempladas:
  - carrito de compras completo,
  - checkout real/pasarela de pago,
  - backend persistente productivo.

---

## Roadmap sugerido

- Integrar checkout real (Mercado Pago o similar).
- Persistir carrito (local storage + sesion usuario).
- Integrar analitica (eventos de conversion en CTA).
- Automatizar deploy continuo.

---

## Autoría y marca

Desarrollado para **Fundas Argon**.  
Diseno y experiencia centrados en conversion, identidad musical y escalabilidad.
