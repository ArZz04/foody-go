import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;
    jwt.verify(token, secret);

    // 👇 ESTA ES LA SOLUCIÓN
    const { id: userId } = await context.params;

    const [rows] = (await pool.query(
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

        /* ROLES (subquery con DISTINCT) */
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', r2.id,
              'code', r2.code,
              'name', r2.name
            )
          )
          FROM (
            SELECT DISTINCT r.id, r.code, r.name
            FROM user_roles ur2
            LEFT JOIN roles r ON r.id = ur2.role_id
            WHERE ur2.user_id = u.id
          ) AS r2
        ) AS roles,

        /* NEGOCIOS DONDE ES OWNER */
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', b.id,
              'name', b.name
            )
          )
          FROM business_owners bo
          LEFT JOIN business b ON b.id = bo.business_id
          WHERE bo.user_id = u.id
        ) AS businesses

      FROM users u
      WHERE u.id = ?
      GROUP BY u.id
      `,
      [userId]
    )) as any;

    return NextResponse.json({ user: rows[0] ?? null });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Error al obtener usuario owner",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
