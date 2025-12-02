import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ============================
// 📌 GET — Obtener negocios (SIN TOKEN)
// ============================
export async function GET(req: Request) {
  try {

    const [rows] = await pool.query(`
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
      b.status_id = 1
      AND bd.is_open_now = 1
    ORDER BY b.id DESC
  `);


    const negocios = (rows as any[]).map(b => ({
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
    }));

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