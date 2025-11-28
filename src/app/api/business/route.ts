import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

// ============================
// 📌 GET — Obtener negocios (público)
// ============================
export async function GET() {
  try {
    const [rows] = await pool.query(
      `
        SELECT 
          id,
          name,
          business_category_id,
          city,
          district,
          address
        FROM business
        ORDER BY id ASC
      `,
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al cargar negocios:", error);
    return NextResponse.json(
      { message: "Error al cargar negocios" },
      { status: 500 },
    );
  }
}
export async function POST(req: Request) {
  try {
    // 1️⃣ Validar token
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token no proporcionado" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET as string);

    // 2️⃣ Extraer body
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

    // 3️⃣ Validaciones mínimas
    if (!owner_id || !name || !business_category_id) {
      return NextResponse.json(
        { error: "owner_id, name y business_category_id son requeridos" },
        { status: 400 }
      );
    }

    // 4️⃣ Insert en business
    const [businessResult] = await pool.query(
      `
      INSERT INTO business
        (name, business_category_id, city, district, address, legal_name, tax_id, address_notes, status_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());
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
        status_id
      ]
    );

    const businessId = (businessResult as any).insertId;

    // 5️⃣ Registrar dueño del negocio
    await pool.query(
      `
      INSERT INTO business_owners (business_id, user_id, invited_by, status_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW());
      `,
      [businessId, owner_id, owner_id, 1]
    );

    // 6️⃣ Asignar rol OWNER (role_id = 2) al usuario (WITH UPSERT)
    await pool.query(
      `
      INSERT INTO user_roles (user_id, role_id)
      VALUES (?, 2)
      ON DUPLICATE KEY UPDATE role_id = 2;
      `,
      [owner_id]
    );

    // 7️⃣ Retornar negocio creado
    const [data] = await pool.query(`SELECT * FROM business WHERE id = ?`, [businessId]);

    return NextResponse.json(
      {
        message: "Negocio creado correctamente",
        business: (data as any)[0],
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error al crear negocio:", error);
    return NextResponse.json(
      { error: "Error interno", details: (error as Error).message },
      { status: 500 }
    );
  }
}
