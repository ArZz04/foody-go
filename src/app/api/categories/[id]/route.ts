import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { validateAuth } from "@/lib/authToken";

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

    // ⬇️ FIX IMPORTANTE — params ahora es Promise
    const { id } = await context.params;
    const businessId = id;

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        name,
        business_id,
        created_at,
        updated_at
      FROM product_categories
      WHERE business_id = ?
      ORDER BY name ASC
      `,
      [businessId]
    );

    return NextResponse.json({ categories: rows }, { status: 200 });
  } catch (error) {
    console.error("❌ Error GET /categories/[id]:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
