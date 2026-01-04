# Guía de Trabajo: Implementación de Promesa de Valor (Marketing)

Este documento establece la estructura paso a paso para plasmar los servicios de NeuroV en contenido educativo y funcional, asegurando que el cliente entienda no solo *qué* hacemos, sino *cómo* le beneficia.

## 🏁 Fase 1: Estructuración del Contenido (Cerebro)
El objetivo es transformar funcionalidades técnicas en soluciones de negocio.

1.  **Definir el "Storytelling" de cada servicio:**
    *   **Gancho:** El problema que le quita el sueño al dueño de la clínica (ej: "Pierdo 2 horas al día respondiendo WhatsApp").
    *   **Mecanismo Único:** Cómo lo resuelve NeuroV (ej: "IA BANT detecta presupuesto en 30 segundos").
    *   **Prueba:** Métrica o dato real (ej: "40% ahorro de tiempo").

2.  **Mapeo de Atributos:**
    *   **BANT:** Explicar el scoring 0-100 y priorización.
    *   **Psicografía:** Explicar los 4 perfiles (Impulsivo, Analítico, etc.).
    *   **Donna:** El asistente 24/7 que "nunca duerme y siempre vende".
    *   **Mail/Automations:** Nutrición de leads tibios.

## 🎨 Fase 2: Diseño de Experiencia (Cuerpo)
Cómo visualizamos el servicio para que sea digerible.

1.  **Iteración de `/growth`:**
    *   Remplazar listas estáticas por **Tabs Interactivos**.
    *   Crear **Infografías Dinámicas** para el flujo de Ads -> Cita.
    *   Implementar **Calculadoras de ROI** (ej: Calculadora de No-Shows).

2.  **Páginas de Solución por Especialidad:**
    *   Crear sub-páginas o secciones dedicadas para Kinesiología, Estética y Dental.

## 🛠 Fase 3: Implementación Técnica (Ejecución)
Pasos de codificación en `app/page.tsx` y `app/growth/page.tsx`.

1.  **Componentes UI:**
    *   `ServiceTabs.tsx`: Componente para navegar entre BANT, Psicografía, etc.
    *   `ROICalculator.tsx`: Herramienta interactiva para que el cliente vea su ahorro.
    *   `CaseStudyCard.tsx`: Para mostrar testimonios y resultados reales.

2.  **SEO & Marketing Copy:**
    *   Asegurar que cada H2 y H3 tenga palabras clave de búsqueda local.
    *   Alinear cada texto con la `GUIA_VOZ_Y_TONO.md`.

## ✅ Fase 4: Verificación (Calidad)
1.  **Mobile First:** Verificar que las calculadoras y tabs funcionen perfectamente en celulares.
2.  **Prueba de Flujo:** Asegurar que los CTAs ("Agendar Demo") sean coherentes con el nuevo contenido educativo.
3.  **Voz y Tono:** Revisión final para eliminar lenguaje "cyber/tech" excesivo y mantener el tono "colega experto".

---

> [!IMPORTANT]
> **Regla de Oro:** Cada pieza de contenido informativo debe terminar con una invitación a la acción (CTA) específica relacionada con lo enseñado.
