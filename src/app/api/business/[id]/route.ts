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
// 📌 GET — Obtener negocio por ID (+ horarios)
// ============================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!validateAuth(req)) {
      return NextResponse.json(
        { error: "Token inválido o faltante" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const id = params.id;

    // ============================
    // 1️⃣ Obtener información del negocio
    // ============================
    const [rows]: any = await pool.query(
      `
        SELECT 
          b.id,
          b.name,
          b.business_category_id,
          bc.name AS category_name,
          b.city,
          b.district,
          b.address,
          b.legal_name,
          b.tax_id,
          b.address_notes,
          b.created_at,
          b.updated_at,
          b.status_id,
          bo.user_id AS owner_id
        FROM business b
        LEFT JOIN business_owners bo 
          ON bo.business_id = b.id AND bo.status_id = 1
        LEFT JOIN business_categories bc 
          ON bc.id = b.business_category_id
        WHERE b.id = ?
        LIMIT 1
      `,
      [id]
    );

    if (!rows?.length) {
      return NextResponse.json(
        { message: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    const business = rows[0];

    // ============================
    // 2️⃣ Obtener horarios del negocio
    // ============================
    const [hours]: any = await pool.query(
      `
        SELECT 
          day_of_week,
          open_time,
          close_time,
          is_closed
        FROM business_hours 
        WHERE business_id = ?
      `,
      [id]
    );

    // Formato de días (0 = Lunes, 6 = Domingo o según tu DB)
    const days = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    // ============================
    // 3️⃣ Combinar horarios (7 días garantizados)
    // ============================
    const formattedHours = days.map((day, index) => {
      const found = hours.find((h: any) => h.day_of_week === index);

      if (!found) {
        return {
          day_of_week: index,
          day_name: day,
          open_time: "undefined",
          close_time: "undefined",
          is_closed: true,
        };
      }

      return {
        day_of_week: index,
        day_name: day,
        open_time: found.open_time ?? "undefined",
        close_time: found.close_time ?? "undefined",
        is_closed: !!found.is_closed,
      };
    });

    // ============================
    // 4️⃣ Respuesta final
    // ============================
    return NextResponse.json(
      {
        business,
        hours: formattedHours,
      },
      { status: 200 }
    );
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

    // 🔹 1. Obtener el owner ANTERIOR ANTES de actualizar
    const [oldOwnerRows] = await pool.query<any[]>(
      `SELECT user_id FROM business_owners WHERE business_id = ?`,
      [businessId]
    );

    const oldOwnerId = oldOwnerRows.length > 0 ? oldOwnerRows[0].user_id : null;

    // 🔹 2. Actualizar datos del negocio
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

    // 🔹 3. Actualizar el owner actual
    await pool.query(
      `
        UPDATE business_owners
        SET user_id = ?, updated_at = NOW()
        WHERE business_id = ?;
      `,
      [owner_id, businessId]
    );

    // 🔹 4. Eliminar rol OWNER del dueño anterior (solo si cambió)
    if (oldOwnerId && oldOwnerId !== owner_id) {
      await pool.query(
        `DELETE FROM user_roles WHERE user_id = ? AND role_id = 2;`,
        [oldOwnerId]
      );
    }

    // 🔹 5. Asignar rol OWNER al nuevo usuario
    await pool.query(
      `
        INSERT INTO user_roles (user_id, role_id)
        VALUES (?, 2)
        ON DUPLICATE KEY UPDATE role_id = 2;
      `,
      [owner_id]
    );

    // 🔹 6. Obtener datos actualizados
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