import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const token = auth.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secret) as { id: number };

    // Buscar roles del usuario
    const [rows] = await pool.query(
      `
      SELECT r.id, r.name, r.code
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ?
      `,
      [decoded.id],
    );

    return NextResponse.json({
      roles: rows,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Error al obtener roles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
