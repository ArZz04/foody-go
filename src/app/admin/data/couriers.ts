export type CourierStatus = "Activo" | "En descanso" | "Suspendido";
export type CourierAssignmentStatus = "Entregado" | "En ruta" | "Cancelado";

export interface CourierAssignment {
  id: string;
  negocio: string;
  pedido: string;
  total: number;
  estado: CourierAssignmentStatus;
  fecha: string;
  direccionEntrega: string;
}

export interface CourierSchedule {
  turno: string;
  inicio: string;
  fin: string;
  zona: string;
}

export interface CourierRecord {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  estado: CourierStatus;
  vehiculo: string;
  placas: string;
  inicioEnFoodyGo: string;
  promedioEntrega: string;
  calificacion: number;
  horario: CourierSchedule;
  asignaciones: CourierAssignment[];
}

export const couriers: CourierRecord[] = [
  {
    id: 1,
    nombre: "Daniela Pérez",
    telefono: "33 6543 2109",
    email: "daniela@foodygo.com",
    estado: "Activo",
    vehiculo: "Motocicleta",
    placas: "JJK-23-45",
    inicioEnFoodyGo: "2023-08-12",
    promedioEntrega: "28 min",
    calificacion: 4.9,
    horario: {
      turno: "Matutino",
      inicio: "08:00",
      fin: "16:00",
      zona: "Guadalajara Centro",
    },
    asignaciones: [
      {
        id: "AS-5542",
        negocio: "Cafetería Central",
        pedido: "FG-2201",
        total: 189.5,
        estado: "Entregado",
        fecha: "2024-06-01T13:45:00",
        direccionEntrega: "Av. Hidalgo 320, Col. Centro",
      },
      {
        id: "AS-5531",
        negocio: "Farmacia Los Ángeles",
        pedido: "FG-2056",
        total: 320.9,
        estado: "En ruta",
        fecha: "2024-06-02T18:20:00",
        direccionEntrega: "Av. Mexico 780, Col. Chapultepec",
      },
    ],
  },
  {
    id: 2,
    nombre: "Luis Martínez",
    telefono: "33 5678 9012",
    email: "luis@foodygo.com",
    estado: "En descanso",
    vehiculo: "Bicicleta eléctrica",
    placas: "N/A",
    inicioEnFoodyGo: "2023-10-04",
    promedioEntrega: "32 min",
    calificacion: 4.7,
    horario: {
      turno: "Vespertino",
      inicio: "14:00",
      fin: "22:00",
      zona: "Zapopan Norte",
    },
    asignaciones: [
      {
        id: "AS-5520",
        negocio: "Tacos El Güero",
        pedido: "FG-2204",
        total: 245.2,
        estado: "Entregado",
        fecha: "2024-05-30T21:10:00",
        direccionEntrega: "Calle Reforma 154, Col. Arcos",
      },
    ],
  },
  {
    id: 3,
    nombre: "María Núñez",
    telefono: "33 2888 9012",
    email: "maria@foodygo.com",
    estado: "Activo",
    vehiculo: "Motocicleta",
    placas: "JLM-98-76",
    inicioEnFoodyGo: "2024-01-15",
    promedioEntrega: "26 min",
    calificacion: 4.8,
    horario: {
      turno: "Nocturno",
      inicio: "18:00",
      fin: "02:00",
      zona: "Tlaquepaque y Tonalá",
    },
    asignaciones: [
      {
        id: "AS-5601",
        negocio: "Llantera El Rayo",
        pedido: "FG-2212",
        total: 580.0,
        estado: "En ruta",
        fecha: "2024-06-04T11:15:00",
        direccionEntrega: "Carretera a Chapala Km 13",
      },
    ],
  },
  {
    id: 4,
    nombre: "Óscar Ramírez",
    telefono: "33 2109 8765",
    email: "oscar@foodygo.com",
    estado: "Suspendido",
    vehiculo: "Automóvil",
    placas: "JXY-45-32",
    inicioEnFoodyGo: "2023-05-22",
    promedioEntrega: "35 min",
    calificacion: 4.2,
    horario: {
      turno: "Flexible",
      inicio: "10:00",
      fin: "18:00",
      zona: "Guadalajara Metropolitana",
    },
    asignaciones: [],
  },
];

export function getCourierById(id: number) {
  return couriers.find((courier) => courier.id === id) ?? null;
}
