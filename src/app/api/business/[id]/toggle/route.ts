import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// =======================
// 📌 GET — obtener estado
// =======================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const business_id = Number(id);

    if (!business_id) {
      return NextResponse.json(
        { error: "ID de negocio inválido" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `SELECT is_open_now FROM business_details WHERE business_id = ? LIMIT 1`,
      [business_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({
        business_id,
        exists: false,
        is_open_now: 0,
      });
    }

    return NextResponse.json({
      business_id,
      exists: true,
      is_open_now: rows[0].is_open_now,
    });

  } catch (error) {
    console.error("Error GET toggle:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}


// =======================
// 📌 PUT — toggle y crear
// =======================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const business_id = Number(id);

    if (!business_id) {
      return NextResponse.json(
        { error: "ID de negocio inválido" },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.query(
      `SELECT is_open_now FROM business_details WHERE business_id = ? LIMIT 1`,
      [business_id]
    );

    if (rows.length === 0) {
      await pool.query(
        `
        INSERT INTO business_details (
          business_id,
          is_open_now,
          status_id,
          created_at,
          updated_at
        ) VALUES (?, 1, 1, NOW(), NOW())
        `,
        [business_id]
      );

      return NextResponse.json({
        message: "business_details creado y negocio abierto",
        business_id,
        new_status: 1,
        created: true,
      });
    }

    const currentStatus = rows[0].is_open_now;
    const newStatus = currentStatus === 1 ? 0 : 1;

    await pool.query(
      `
      UPDATE business_details
      SET is_open_now = ?, updated_at = NOW()
      WHERE business_id = ?
      `,
      [newStatus, business_id]
    );

    return NextResponse.json({
      message: "Estado actualizado",
      business_id,
      old_status: currentStatus,
      new_status: newStatus,
      created: false,
    });

  } catch (error) {
    console.error("Error PUT toggle:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
