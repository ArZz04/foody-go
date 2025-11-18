import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

// ============================
// 📌 Middleware auth helper
// ============================
function validateAuth(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return null;
  }
  const token = auth.split(" ")[1];
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch {
    return null;
  }
}

// ============================
// 📌 GET — Obtener negocio por ID
// ============================
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!validateAuth(req)) {
      return NextResponse.json({ error: "Token inválido o faltante" }, { status: 401 });
    }

    const [rows]: any = await pool.query(
      `
        SELECT 
          b.*,
          bo.user_id AS owner_id
        FROM business b
        LEFT JOIN business_owners bo ON bo.business_id = b.id AND bo.status_id = 1
        WHERE b.id = ? LIMIT 1
      `,
      [params.id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: "Negocio no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ business: rows[0] }, { status: 200 });

  } catch (error) {
    console.error("❌ Error GET business/:id:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// ============================
// 📌 PUT — Actualizar negocio
// ============================
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    if (!validateAuth(req)) {
      return NextResponse.json({ error: "Token inválido o faltante" }, { status: 401 });
    }

    const businessId = context.params.id;
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

    // Validación mínima
    if (!owner_id || !name || !business_category_id) {
      return NextResponse.json(
        { error: "owner_id, name y business_category_id son requeridos" },
        { status: 400 }
      );
    }

    // Update business
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

    // Update owner relation
    await pool.query(
      `
      UPDATE business_owners
      SET user_id = ?, updated_at = NOW()
      WHERE business_id = ?;
      `,
      [owner_id, businessId]
    );

    // Return updated business
    const [updated] = await pool.query(`SELECT * FROM business WHERE id = ?`, [businessId]);

    return NextResponse.json(
      {
        message: "Negocio actualizado correctamente",
        business: (updated as any)[0],
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error PUT business/:id:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// ============================
// 🗑 DELETE — (opcional)
// ============================
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!validateAuth(req)) {
      return NextResponse.json({ error: "Token inválido o faltante" }, { status: 401 });
    }

    await pool.query(`DELETE FROM business_owners WHERE business_id = ?`, [params.id]);
    await pool.query(`DELETE FROM business WHERE id = ?`, [params.id]);

    return NextResponse.json({ message: "Negocio eliminado" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error DELETE business/:id:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
