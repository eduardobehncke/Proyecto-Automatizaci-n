"""
OptiRamos · Engine Prototipo Backend (End-to-End Demo)
Asignatura: Automatización e IA para MVPs (MBAn UAI 2026-B)

Este script demuestra el flujo end-to-end:
1. Simula datos de prueba de Supabase (Ramos y Secciones reales MBAn/UAI).
2. Recibe restricciones del estudiante.
3. Evalúa choques horarios y consulta la lógica del optimizador.
4. Genera resultado en JSON estructurado y simula guardado de logs.
"""

import json

# 1. DATOS MOCK DE PRUEBA (Ramos MBAn UAI)
MOCK_SUPABASE_COURSES = [
    {
        "codigo": "IND-501",
        "nombre": "Automatización e IA",
        "secciones": [
            {
                "seccion": 1,
                "profesor": "Benjamín Happey",
                "bloques": [
                    {"dia": "Martes", "inicio": "08:30", "fin": "10:00"},
                    {"dia": "Jueves", "inicio": "08:30", "fin": "10:00"}
                ]
            },
            {
                "seccion": 2,
                "profesor": "Benjamín Happey",
                "bloques": [
                    {"dia": "Martes", "inicio": "10:15", "fin": "11:45"},
                    {"dia": "Jueves", "inicio": "10:15", "fin": "11:45"}
                ]
            }
        ]
    },
    {
        "codigo": "FIN-602",
        "nombre": "Finanzas Corporativas",
        "secciones": [
            {
                "seccion": 1,
                "profesor": "Carlos Mendoza",
                "bloques": [
                    {"dia": "Martes", "inicio": "10:15", "fin": "11:45"},
                    {"dia": "Jueves", "inicio": "10:15", "fin": "11:45"}
                ]
            },
            {
                "seccion": 2,
                "profesor": "Laura Prieto",
                "bloques": [
                    {"dia": "Lunes", "inicio": "08:30", "fin": "10:00"},
                    {"dia": "Miércoles", "inicio": "08:30", "fin": "10:00"}
                ]
            }
        ]
    },
    {
        "codigo": "MKT-503",
        "nombre": "Marketing Estratégico",
        "secciones": [
            {
                "seccion": 1,
                "profesor": "Andrea Silva",
                "bloques": [
                    {"dia": "Lunes", "inicio": "10:15", "fin": "11:45"},
                    {"dia": "Miércoles", "inicio": "10:15", "fin": "11:45"}
                ]
            }
        ]
    },
    {
        "codigo": "OPE-504",
        "nombre": "Gestión de Operaciones",
        "secciones": [
            {
                "seccion": 1,
                "profesor": "Roberto Gómez",
                "bloques": [
                    {"dia": "Martes", "inicio": "12:00", "fin": "13:30"},
                    {"dia": "Jueves", "inicio": "12:00", "fin": "13:30"}
                ]
            }
        ]
    }
]

# 2. RESTRICCIONES DEL ESTUDIANTE
RESTRICCIONES_ESTUDIANTE = {
    "usuario": "estudiante@uai.cl",
    "dias_prohibidos": ["Viernes"],
    "preferencia_horario": "mañanas",
    "ramos_requeridos": ["IND-501", "FIN-602", "MKT-503", "OPE-504"]
}


def hay_choque(bloque1, bloque2):
    if bloque1["dia"] != bloque2["dia"]:
        return False
    # Comparar horas HH:MM
    return not (bloque1["fin"] <= bloque2["inicio"] or bloque1["inicio"] >= bloque2["fin"])


def evaluar_combinacion(secciones_combo):
    # Verificar choques entre todas las secciones del combo
    todos_bloques = []
    for s in secciones_combo:
        for b in s["bloques"]:
            for b_existente in todos_bloques:
                if hay_choque(b, b_existente):
                    return False  # Hay choque
            todos_bloques.append(b)
    return True  # Válido sin choques


def generar_horarios_optimos(cursos_db, restricciones):
    combos_validos = []
    
    # Extraer secciones disponibles por ramo solicitado
    ramos_solicitados = restricciones["ramos_requeridos"]
    cursos_filtrados = [c for c in cursos_db if c["codigo"] in ramos_solicitados]
    
    # Producto cartesiano simple de secciones
    import itertools
    todas_opciones_secciones = [c["secciones"] for c in cursos_filtrados]
    
    for combo in itertools.product(*todas_opciones_secciones):
        if evaluar_combinacion(combo):
            # Formatear la combinación válida
            opcion = []
            for i, sec in enumerate(combo):
                opcion.append({
                    "codigo": cursos_filtrados[i]["codigo"],
                    "nombre": cursos_filtrados[i]["nombre"],
                    "seccion": sec["seccion"],
                    "profesor": sec["profesor"],
                    "bloques": sec["bloques"]
                })
            combos_validos.append(opcion)
            
    return combos_validos


if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    print("=== OPTIRAMOS ENGINE :: INICIANDO OPTIMIZACION MOCK ===")
    print(f"Estudiante: {RESTRICCIONES_ESTUDIANTE['usuario']}")
    print(f"Ramos solicitados: {RESTRICCIONES_ESTUDIANTE['ramos_requeridos']}\n")
    
    resultados = generar_horarios_optimos(MOCK_SUPABASE_COURSES, RESTRICCIONES_ESTUDIANTE)
    
    print(f"Se encontraron {len(resultados)} alternativas de horario SIN CHOQUES:\n")
    
    for idx, combo in enumerate(resultados, 1):
        print(f"--- OPCION {idx} ---")
        for ramo in combo:
            bloques_str = ", ".join([f"{b['dia']} {b['inicio']}-{b['fin']}" for b in ramo['bloques']])
            print(f"  [{ramo['codigo']}] {ramo['nombre']} (Sec. {ramo['seccion']} - Prof. {ramo['profesor']}) -> {bloques_str}")
        print()

    print("[OK] Registrando log de ejecucion en Supabase...")
    print("=== FIN DE LA EJECUCION END-TO-END ===")
