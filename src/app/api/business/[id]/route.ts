import { NextResponse, type NextRequest } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

// ============================
// 🔐 Validación de token
// ============================
function validateAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;

  const token = auth.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch (error) {
    console.error("❌ Token inválido:", error);
    return false;
  }
}

// ============================
// 📌 GET — Obtener negocio por ID
// ============================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAuth(req)) {
      return NextResponse.json({ error: "Token inválido o faltante" }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    const [rows]: any = await pool.query(
      `
        SELECT 
          b.*,
          bo.user_id AS owner_id
        FROM business b
        LEFT JOIN business_owners bo ON bo.business_id = b.id AND bo.status_id = 1
        WHERE b.id = ? LIMIT 1
      `,
      [id]
    );

    if (!rows?.length) {
      return NextResponse.json({ message: "Negocio no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ business: rows[0] }, { status: 200 });

  } catch (error) {
    console.error("❌ Error GET /business/:id:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// ============================
// 📌 PUT — Actualizar negocio
// ============================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAuth(req)) {
      return NextResponse.json({ error: "Token inválido o faltante" }, { status: 401 });
    }

    const params = await context.params;
    const businessId = params.id;
    const body = await req.json();

    const {
      owner_id,
      name,
      business_category_id,
      city,
      district,
      address,
      legal_name,
      tax_id,
      address_notes,
      status_id = 1,
    } = body;

    if (!owner_id || !name || !business_category_id) {
      return NextResponse.json(
        { error: "owner_id, name y business_category_id son requeridos" },
        { status: 400 }
      );
    }

    await pool.query(
      `
        UPDATE business SET
          name = ?,
          business_category_id = ?,
          city = ?,
          district = ?,
          address = ?,
          legal_name = ?,
          tax_id = ?,
          address_notes = ?,
          status_id = ?,
          updated_at = NOW()
        WHERE id = ?;
      `,
      [
        name,
        business_category_id,
        city ?? null,
        district ?? null,
        address ?? null,
        legal_name ?? null,
        tax_id ?? null,
        address_notes ?? null,
        status_id,
        businessId,
      ]
    );

    await pool.query(
      `
        UPDATE business_owners
        SET user_id = ?, updated_at = NOW()
        WHERE business_id = ?;
      `,
      [owner_id, businessId]
    );

    // 1. Obtener owner anterior
    const [oldOwnerRows] = await pool.query<any[]>(
      `SELECT user_id FROM business_owners WHERE business_id = ?`,
      [businessId]
    );

    const oldOwnerId = oldOwnerRows.length ? oldOwnerRows[0].user_id : null;

    // 2. Eliminar rol OWNER del dueño anterior
    if (oldOwnerId && oldOwnerId !== owner_id) {
      await pool.query(
        `
          DELETE FROM user_roles
          WHERE user_id = ? AND role_id = 2;
        `,
        [oldOwnerId]
      );
    }

    // 3. Asignar rol OWNER al nuevo usuario
    await pool.query(
      `
        INSERT INTO user_roles (user_id, role_id)
        VALUES (?, 2)
        ON DUPLICATE KEY UPDATE role_id = 2;
      `,
      [owner_id]
    );

    const [updated]: any = await pool.query(
      `SELECT * FROM business WHERE id = ?`,
      [businessId]
    );

    return NextResponse.json(
      { message: "Negocio actualizado correctamente", business: updated[0] },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error PUT /business/:id:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// ============================
// 🗑 DELETE — Eliminar negocio
// ============================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAuth(req)) {
      return NextResponse.json({ error: "Token inválido o faltante" }, { status: 401 });
    }

    const params = await context.params;
    const id = params.id;

    await pool.query(`DELETE FROM business_owners WHERE business_id = ?`, [id]);
    await pool.query(`DELETE FROM business WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Negocio eliminado" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error DELETE /business/:id:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}