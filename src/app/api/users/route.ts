import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

import pool from "@/lib/db";

export const revalidate = 0;

interface UserRow extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  rol: string;
  created_at: string;
}

export async function GET() {
  try {
    const [rows] = await pool.query<UserRow[]>(
      `SELECT id, first_name, last_name, email, phone, rol, created_at
       FROM users
       ORDER BY created_at DESC`,
    );

    const usuarios = rows.map((row) => ({
      id: row.id,
      nombre: [row.first_name, row.last_name].filter(Boolean).join(" ").trim(),
      correo: row.email,
      telefono: row.phone ?? "",
      rol: row.rol,
      estatus: "ACTIVO",
      creadoEn: row.created_at,
    }));

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("[GET /api/users] Error:", error);
    return NextResponse.json(
      { message: "Error al obtener usuarios" },
      { status: 500 },
    );
  }
}
