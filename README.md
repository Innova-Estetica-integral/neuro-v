# NeuroV - Infraestructura Operacional para Clínicas

> [!IMPORTANT]
> **NeuroV no compite con los gigantes (SII, I-Med, Buk, etc.); se posiciona como el Orquestador que conecta todas estas piezas en una sola interfaz fluida para el médico.**

## Aplicación Desplegada 🚀

### URL de Producción
**https://neuro-ventas-v6.vercel.app**

### Tecnologías
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS 3.4.1 + Glassmorphism
- **Backend**: Supabase (PostgreSQL)
- **Despliegue**: Vercel
- **Control de Versiones**: Git

### Características Implementadas

#### 1. **Perfilado Psicográfico**
- 4 perfiles: Impulsivo, Analítico, Sensible al Precio, Indeciso
- UI adaptativa basada en el perfil del usuario
- Configuración dinámica de mensajes y colores

#### 2. **componentes de Conversión**
- `ScarcityTimer`: Contador de escasez con animaciones premium
- `TechnicalSpecs`: Especificaciones técnicas para perfiles analíticos
- Sistema de colores adaptativos según perfil psicográfico

#### 3. **Base de Datos (Schema Creado)**
- Tabla `leads` con columna `psych_profile` (ENUM)
- Tabla `appointments` con `payment_status` y `is_flash_offer`
- Trigger `check_abandoned_carts` (15 minutos)
- Función `detect_psychographic_profile` para auto-detección

### Configuración de Supabase

#### Credenciales
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

```

#### Desplegar Schema SQL
1. Ir a Supabase Dashboard: https://app.supabase.com/
2. Seleccionar proyecto: `ogclvhtjddnkngetsxve`
3. Ir a SQL Editor
4. Ejecutar el archivo: `supabase/schema.sql`

### Estructura del Proyecto

```
NeuroV/
├── app/
│   ├── globals.css          # Estilos globales + animaciones
│   ├── layout.tsx            # Layout raíz
│   └── page.tsx              # Página principal
├── components/
│   ├── scarcity-timer.tsx    # Timer de escasez
│   └── technical-specs.tsx   # Specs técnicas
├── lib/
│   ├── psychographic-adapter.ts  # Lógica de perfilado
│   └── supabase/
│       ├── client.ts         # Cliente browser
│       └── server.ts         # Cliente server
├── supabase/
│   └── schema.sql            # Schema completo
├── .env.local                # Variables de entorno
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json

```

### Próximos Pasos

1. **Desplegar Schema en Supabase**
   - Ejecutar `supabase/schema.sql` en SQL Editor

2. **Configurar Variables de Entorno en Vercel**
   - Ir a Vercel Dashboard
   - Project Settings → Environment Variables
   - Añadir las credenciales de Supabase

3. **Desarrollar Páginas de Conversión**
   - Página de Landing con detección de perfil
   - Formulario de captura de leads
   - Sistema de booking con payment gate

4. **Integrar Pagos**
   - Configurar webhook para payments
   - Implementar lógica de deposit/full payment

5. **Testing**
   - Probar cada perfil psicográfico
   - Validar trigger de carritos abandonados
   - Verificar flujo completo de conversión

### Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Desplegar a Vercel
vercel --prod

# Verificar tipos TypeScript
npx tsc --noEmit
```

### Soporte y Contacto

Para cualquier consulta sobre la implementación, revisar:
- Implementación Plan: `implementation_plan.md`
- Tareas Pendientes: `task.md`
