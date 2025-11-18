import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;
    jwt.verify(token, secret);

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
        u.status_id,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', r.id,
            'code', r.code,
            'name', r.name
          )
        ) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      GROUP BY u.id
      `
    );

    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Error al obtener usuarios",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
