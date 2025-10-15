export type DeliveryStatus =
  | "En camino"
  | "Listo para recoger"
  | "Pendiente"
  | "Completado";

export interface DeliveryAddress {
  street: string;
  neighborhood: string;
  city: string;
  references: string;
}

export interface DeliveryContact {
  name: string;
  phone: string;
}

export interface DeliveryOrder {
  id: string;
  status: DeliveryStatus;
  eta: string;
  paymentMethod: "Efectivo" | "Tarjeta" | "Transferencia";
  amount: number;
  address: DeliveryAddress;
  contact: DeliveryContact;
  notes?: string;
}

export interface DeliverySchedule {
  shiftLabel: string;
  shiftWindow: string;
  startTime?: string;
  endTime?: string;
  hoursWorked?: string;
  breakWindow?: string;
  nextCheckIn: string;
  coverageZone: string;
}

export interface DeliveryEarnings {
  currency: string;
  today: number;
  weekToDate: number;
  tips: number;
  goal: number;
}

export interface DeliveryNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread?: boolean;
}
