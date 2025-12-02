import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ============================
// 📌 GET — Obtener negocio por ID (SIN TOKEN)
// ============================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Falta el ID del negocio" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `
      SELECT 
        b.id,
        b.name,
        b.business_category_id,
        bc.name AS category_name,
        b.city,
        b.district,
        b.address,
        b.status_id,
        b.created_at,
        b.updated_at,
        bd.is_open_now
      FROM business b
      LEFT JOIN business_categories bc
        ON bc.id = b.business_category_id
      INNER JOIN business_details bd
        ON bd.business_id = b.id
      WHERE 
        b.id = ?
        AND b.status_id = 1
      LIMIT 1
      `,
      [id]
    );

    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    const b = (rows as any[])[0];

    const business = {
      id: b.id,
      name: b.name,
      category_id: b.business_category_id,
      category_name: b.category_name,
      city: b.city,
      district: b.district,
      address: b.address,
      status_id: b.status_id,
      created_at: b.created_at,
      updated_at: b.updated_at,
      is_open_now: b.is_open_now,
    };

    return NextResponse.json(
      { message: "OK", business },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error al obtener negocio:", error);
    return NextResponse.json(
      { error: "Error interno", details: (error as Error).message },
      { status: 500 }
    );
  }
}
