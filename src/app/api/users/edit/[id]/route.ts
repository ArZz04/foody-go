import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const userId = Number(id);

  if (!userId) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const connection = await pool.getConnection();

  try {
    console.log("➡️ Actualizando usuario:", userId);

    // Validar token
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET as string;
    const token = auth.split(" ")[1];
    jwt.verify(token, secret);

    // Leer body
    const body = await req.json();
    const { roles, ...fields } = body;

    await connection.beginTransaction();

    // Actualizar datos básicos
    const allowedFields = ["first_name", "last_name", "email", "phone", "status_id"];
    const updates: string[] = [];
    const values: any[] = [];

    for (const key of allowedFields) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length > 0) {
      values.push(userId);
      await connection.query(
        `UPDATE users SET ${updates.join(", ")}, updated_at = NOW() WHERE id = ?`,
        values
      );
    }

    // ========= ROLES ==========
    if (Array.isArray(roles)) {
      const [oldRolesData] = await connection.query(
        `SELECT r.code 
         FROM roles r 
         JOIN user_roles ur ON ur.role_id = r.id 
         WHERE ur.user_id = ?`,
        [userId]
      );

      const oldRoles = (oldRolesData as any[]).map(r => r.code);

      // Map frontend codes -> DB codes
      const roleMap: Record<string, string> = {
        ADMIN: "1",
        OWNER: "2",
        DELIVERY: "4",
        CUSTOMER: "5",
      };

      const roleCodes = roles.map(r => roleMap[r]).filter(Boolean);

      const sameRoles =
        oldRoles.length === roleCodes.length &&
        oldRoles.every(r => roleCodes.includes(r));

      if (!sameRoles) {
        console.log("🔁 Roles cambiaron, aplicando cambios...");
        console.log("📌 old:", oldRoles, "➡ new:", roleCodes);

        await connection.query(`DELETE FROM user_roles WHERE user_id = ?`, [userId]);

        if (roleCodes.length > 0) {
          const placeholders = roleCodes.map(() => "?").join(",");
          const [roleRows] = await connection.query(
            `SELECT id FROM roles WHERE code IN (${placeholders})`,
            roleCodes
          );

          const roleIds = (roleRows as any[]).map(r => r.id);

          const insertValues = roleIds.map(roleId => [userId, roleId]);
          const insertPlaceholders = insertValues.map(() => "(?, ?)").join(",");

          await connection.query(
            `INSERT INTO user_roles (user_id, role_id) VALUES ${insertPlaceholders}`,
            insertValues.flat()
          );
        }
      }
    }

    await connection.commit();

    const [updatedUser] = await pool.query(
      `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        u.status_id,
        u.created_at,
        u.updated_at,
        JSON_ARRAYAGG(JSON_OBJECT('id', r.id, 'code', r.code, 'name', r.name)) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON ur.user_id = u.id
      LEFT JOIN roles r ON r.id = ur.role_id
      WHERE u.id = ?
      GROUP BY u.id
      `,
      [userId]
    );

    connection.release();

    return NextResponse.json({
      success: true,
      message: "Usuario actualizado correctamente",
      user: (updatedUser as any[])[0] ?? null
    });

  } catch (error) {
    console.error("❌ ERROR, HACIENDO ROLLBACK:", error);
    await connection.rollback();
    connection.release();
    return NextResponse.json(
      { error: "Error al actualizar usuario", details: (error as Error).message },
      { status: 500 }
    );
  }
}
