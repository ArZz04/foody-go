# 🛒 Foody Go — Sistema de Marketplace y Logística Local

**Foody Go** es un sistema web diseñado para mejorar la eficiencia del comercio y la entrega de productos en zonas rurales. Su objetivo principal es conectar de manera efectiva a **clientes**, **comercios** y **repartidores**, reduciendo la fragmentación e informalidad en los procesos de venta y distribución local.

---

## 🧑‍💻 Autores

| Nombre | Matrícula | Rol |
|--------|------------|-----|
| **Juan Arvizu** | 230111367 | Desarrollador principal / Arquitectura del sistema |
| **Yaritza Chavez** | 230110692 | Análisis de requerimientos / Diseño UX |
| **Andrea del Carmen Rojas** | - | Diseño UX |

---

## 🚀 Tecnologías Utilizadas

- **Next.js 15** — Framework React moderno y optimizado.  
- **TypeScript** — Tipado estático para un desarrollo más seguro.  
- **Tailwind CSS** — Estilos rápidos y personalizables.  
- **MySQL / MongoDB** — Bases de datos relacionales y documentales (según el módulo).  
- **API REST / Express.js** — Comunicación entre frontend y backend.  
- **ZeroTier / Raspberry Pi** *(para entornos reales)* — Conectividad en zonas rurales.

---

## 📋 Resumen Ejecutivo

El proyecto propone el **diseño de un sistema de marketplace y logística** orientado a zonas rurales como **Mazamitla**, donde los procesos de pedidos y entregas aún se gestionan de forma manual o por WhatsApp.  

**Foody Go** busca:
- Gestionar pedidos y transacciones de forma centralizada.  
- Mejorar la visibilidad de pequeños negocios locales.  
- Reducir errores, tiempos de entrega y costos logísticos.  
- Funcionar bajo condiciones de **conectividad limitada**, ofreciendo una solución **ligera, escalable y accesible**.  

---

## ⚙️ Planteamiento del Problema

### Problemática
En comunidades rurales existen barreras tecnológicas que dificultan la eficiencia del comercio local:
- **Pedidos fragmentados** sin registro centralizado.  
- **Rutas ineficientes** y direcciones imprecisas.  
- **Riesgos en transacciones** (pagos en efectivo sin control).  
- **Imposibilidad de auditar** entregas o desempeño.

### Consecuencias
- Pérdida de ventas por errores o retrasos.  
- Baja satisfacción del cliente.  
- Dificultad para escalar y evaluar el sistema logístico.  

---

## 💡 Justificación

El proyecto **responde a la necesidad de digitalización rural** mediante una plataforma adaptable, económica y fácil de implementar.

### Beneficios
- **Económico y social:** fortalece la economía local al visibilizar comercios pequeños.  
- **Logístico:** reduce tiempos y costos de entrega con asignación precisa de rutas.  
- **Técnico:** el sistema está optimizado para funcionar con conexión intermitente y soportar futuras integraciones.  

---

## 🎯 Objetivos del Proyecto

### Objetivo General
Diseñar y modelar un **sistema de marketplace y logística** que optimice los pedidos a domicilio, conectando a clientes, comercios y repartidores.

---

## 🧩 Desarrollo del Proyecto

### Requerimientos Funcionales (RF)
- Registro y gestión de pedidos.  
- Seguimiento del estado del pedido (pendiente, en reparto, entregado).  
- Registro de comercios y productos.  
- Gestión de rutas y repartidores.  
- Registro de pagos (efectivo / digital futuro).

### Requerimientos No Funcionales (RNF)
- Funcionamiento con baja conectividad.  
- Interfaz adaptable a móviles.  
- Seguridad en datos y transacciones.  
- Escalabilidad para integrar nuevos comercios.

---

### Modelo de Desarrollo

**Modelo elegido:** 🌀 **Espiral**

- Combina **prototipado**, **gestión de riesgos** y **validación iterativa**.  
- Ideal para entornos con incertidumbre y pruebas de campo.  
- Permite ajustar el sistema progresivamente según retroalimentación real.

---

## 📊 Modelado del Negocio

- **Casos de Uso:** Representan la interacción entre usuarios (cliente, comercio, repartidor).  
- **Actores principales:** Cliente, Comercio, Administrador, Repartidor.  
- **Procesos clave:** registro de pedido, seguimiento, asignación de entrega, confirmación y pago.

---

## 🧠 Conclusiones

El desarrollo de **Foody Go** permitió identificar los principales retos de digitalización rural.  
Su enfoque integral hacia la logística y la trazabilidad lo convierte en una herramienta esencial para **modernizar la economía local** y **mejorar la experiencia del cliente**.

El modelo **Espiral** resultó clave para reducir riesgos y adaptar el sistema a condiciones reales, sentando las bases para futuras fases de desarrollo más robustas.

---

## 📦 Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/ArZzDev/foody-go.git
cd foody-go

# Instalar dependencias
npm install

# Ejecutar el entorno de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para visualizar la aplicación.

---

## 📘 Estructura del Proyecto

```
📦 foody-go
├── app/
│   ├── api/
│   ├── components/
│   ├── (routes)/
│   ├── layout.tsx
│   └── page.tsx
├── public/
│   └── assets/
├── lib/
│   ├── db.ts
│   └── utils/
├── models/
├── styles/
└── README.md
```

---
