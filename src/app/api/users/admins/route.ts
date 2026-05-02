import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

import pool from "@/lib/db";

type JwtPayload = {
  id: number;
  roles?: string[];
};

type AdminUserRow = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  status_id: number | null;
};

function getAuthUser(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ")
    ? auth.split(" ")[1]
    : req.cookies.get("authToken")?.value;
  const secret = process.env.JWT_SECRET || "gogi-dev-secret";

  if (!token) return null;

  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);

    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Token inválido o faltante", users: [] },
        { status: 401 },
      );
    }

    const [rows] = await pool.query<AdminUserRow[]>(
      `
        SELECT
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.phone,
          u.status_id
        FROM users u
        INNER JOIN user_roles ur ON ur.user_id = u.id
        INNER JOIN roles r ON r.id = ur.role_id
        WHERE r.name = 'admin_general' AND u.status_id = 1
        ORDER BY u.created_at DESC
      `,
    );

    return NextResponse.json({
      success: true,
      users: Array.isArray(rows) ? rows : [],
    });
  } catch (error) {
    console.error("Error GET /api/users/admins:", error);
    return NextResponse.json(
      {
        success: false,
        error: "No pudimos cargar los administradores en este momento.",
        details: error instanceof Error ? error.message : String(error),
        users: [],
      },
      { status: 500 },
    );
  }
}
