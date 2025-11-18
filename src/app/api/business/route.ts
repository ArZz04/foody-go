import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

// ============================
// 📌 GET — Obtener negocios
// ============================
export async function GET(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = auth.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET as string);

    // Query principal
    const [rows] = await pool.query(`
      SELECT 
        b.id,
        b.name,
        b.business_category_id,
        b.city,
        b.district,
        b.address,
        b.legal_name,
        b.tax_id,
        b.address_notes,
        b.status_id,
        b.created_at,
        b.updated_at,
        bo.user_id AS owner_id
      FROM business b
      LEFT JOIN business_owners bo 
        ON bo.business_id = b.id 
        AND bo.status_id = 1
      ORDER BY b.id DESC
    `);


    const negocios = (rows as any[]).map(b => ({
      ...b,
      business_owner: { user_id: b.owner_id ?? null }
    }));


    if (!negocios || negocios.length === 0) {
      return NextResponse.json(
        { message: "No hay negocios registrados", negocios: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "OK", negocios },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error al obtener negocios:", error);
    return NextResponse.json(
      { error: "Error interno", details: (error as Error).message },
      { status: 500 }
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
      status_id = 1, // por defecto activo
    } = body;

    // 3️⃣ Validaciones mínimas
    if (!owner_id || !name || !business_category_id) {
      return NextResponse.json(
        { error: "owner_id, name y business_category_id son requeridos" },
        { status: 400 }
      );
    }

    // 4️⃣ Insert a businesses
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

    // 5️⃣ Insertar relación en business_owners
    await pool.query(
      `
      INSERT INTO business_owners (business_id, user_id, invited_by, status_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW());
      `,
      [businessId, owner_id, owner_id, 1] // invited_by será el mismo owner por ahora
    );

    // 6️⃣ Retornar negocio creado
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
