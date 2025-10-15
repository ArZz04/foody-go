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

    const decoded = jwt.verify(token, secret) as { verify: number };

    // Devolver todos los usuarios verificados
    const [rows] = await pool.query(
      `
  SELECT 
    u.id, 
    u.first_name, 
    u.last_name, 
    u.email, 
    u.phone, 
    u.created_at, 
    u.updated_at,
    GROUP_CONCAT(ur.role_id ORDER BY ur.role_id) AS roles
  FROM users u
  LEFT JOIN user_roles ur ON ur.user_id = u.id
  GROUP BY u.id
  `,
    );

    return NextResponse.json({
      users: rows,
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
