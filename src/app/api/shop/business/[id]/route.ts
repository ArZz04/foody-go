export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import pool from "@/lib/db";

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

    // 1. Obtener información del negocio
    const [businessRows] = await pool.query(
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

    if ((businessRows as any[]).length === 0) {
      return NextResponse.json(
        { error: "Negocio no encontrado" },
        { status: 404 }
      );
    }

    const business = (businessRows as any[])[0];

    // 2. Obtener productos del negocio (consulta separada, más eficiente)
    const [productRows] = await pool.query(
      `
      SELECT 
        p.id,
        p.sku,
        p.name,
        p.description_short,
        p.product_category_id,
        pc.name as category_name,
        p.price,
        p.discount_price,
        p.currency,
        p.sale_format,
        p.price_per_unit,
        p.thumbnail_url,
        p.stock_average,
        p.stock_danger,
        p.is_stock_available,
        p.max_per_order,
        p.min_per_order,
        p.status_id,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN product_categories pc
        ON pc.id = p.product_category_id
      WHERE 
        p.business_id = ?
        AND p.status_id = 1
      ORDER BY 
        pc.name,
        p.name
      `,
      [id]
    );

    const products = (productRows as any[]).map(row => ({
      ...row,
      price: parseFloat(row.price),
      discount_price: row.discount_price ? parseFloat(row.discount_price) : null,
      price_per_unit: row.price_per_unit ? parseFloat(row.price_per_unit) : null,
      is_stock_available: Boolean(row.is_stock_available)
    }));

    // 3. Agrupar productos por categoría (opcional)
    const categoriesMap = new Map();
    products.forEach(product => {
      const categoryId = product.product_category_id;
      
      if (!categoriesMap.has(categoryId)) {
        categoriesMap.set(categoryId, {
          id: categoryId,
          name: product.category_name,
          products: []
        });
      }
      
      categoriesMap.get(categoryId).products.push(product);
    });

    const categories = Array.from(categoriesMap.values());

    return NextResponse.json(
      { 
        message: "OK", 
        business,
        products,
        categories,
        stats: {
          total_products: products.length,
          total_categories: categories.length,
          has_products: products.length > 0
        }
      },
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
