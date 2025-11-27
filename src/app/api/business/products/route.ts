import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

/**
 * GET /api/business/products?business_id=7
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const businessId = url.searchParams.get("business_id");

    if (!businessId) {
      return NextResponse.json(
        { error: "business_id es requerido" },
        { status: 400 }
      );
    }

    // ============================
    // 🔐 Validar token Bearer
    // ============================

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return NextResponse.json(
        { error: "Error interno: JWT_SECRET faltante" },
        { status: 500 }
      );
    }

    try {
      jwt.verify(token, secret);
      console.log(token)
    } catch {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    // ============================
    // 📌 Consultar productos
    // ============================

    const [rows] = await pool.query<any[]>(
      `
        SELECT
          p.id,
          p.business_id,
          p.sku,
          p.barcode,
          p.name,
          p.description_short,
          p.description_long,
          p.product_category_id,
          p.product_subcategory_id,
          p.price,
          p.discount_price,
          p.currency,
          p.sale_format,
          p.price_per_unit,
          p.tax_included,
          p.tax_rate,
          p.commission_rate,
          p.is_stock_available,
          p.max_per_order,
          p.min_per_order,
          p.promotion_id,
          p.thumbnail_url,
          p.stock_average,
          p.stock_danger,
          p.expires_at,
          p.status_id,
          p.created_at,
          p.updated_at,

          -- Categoría
          c.name AS category_name

        FROM products p
        LEFT JOIN product_categories c 
          ON p.product_category_id = c.id

        WHERE p.business_id = ?
        ORDER BY p.created_at DESC
      `,
      [businessId]
    );

    return NextResponse.json(
      { products: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error en GET /products:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
    const now = new Date();
    const createdAt = toMySQLDate(now);
    const updatedAt = toMySQLDate(now);

  try {
    // ============================
    // 🔐 1. Validar token
    // ============================
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token no proporcionado" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("❌ JWT_SECRET no definido");
      return NextResponse.json(
        { error: "Error interno (JWT)" },
        { status: 500 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    // ============================
    // 📥 2. Leer body
    // ============================
    const { product } = await req.json();
    console.log("Received product:", product);

    if (!product) {
      return NextResponse.json(
        { error: "Objeto 'product' requerido" },
        { status: 400 }
      );
    }

    const {
      business_id,
        sku,
        barcode,
        name,
        description_long,
        description_short,
        product_category_id,
        product_subcategory_id,
        price,
        discount_price,
        currency,
        sale_format,
        price_per_unit,
        tax_included,
        tax_rate,
        commission_rate,
        is_stock_available,
        max_per_order,
        min_per_order,
        promotion_id,
        thumbnail_url,
        stock_average,
        stock_danger,
        expires_at,
        status_id,
    } = product;

    // ============================
    // ❗ 3. Validar campos obligatorios
    // ============================
    if (!business_id || !product_category_id || !name || !price) {
      return NextResponse.json(
        {
          error:
            "Campos obligatorios faltantes: business_id, product_category_id, name, price",
        },
        { status: 400 }
      );
    }

    // ============================
    // 🛠️ 4. Insertar en la base de datos
    // ============================
    const [result] = await pool.query(
  `
    INSERT INTO products (
      business_id,
      sku,
      barcode,
      name,
      description_long,
      description_short,
      product_category_id,
      product_subcategory_id,
      price,
      discount_price,
      currency,
      sale_format,
      price_per_unit,
      tax_included,
      tax_rate,
      commission_rate,
      is_stock_available,
      max_per_order,
      min_per_order,
      promotion_id,
      thumbnail_url,
      stock_average,
      stock_danger,
      created_at,
      updated_at,
      expires_at,
      status_id
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `,
  [
    business_id,
    sku ?? null,
    barcode ?? null,
    name,
    description_long ?? null,
    description_short ?? null,
    product_category_id,
    product_subcategory_id ?? null,
    price,
    discount_price ?? null,
    currency ?? "MXN",
    sale_format ?? "UNIDAD",
    price_per_unit ?? null,
    tax_included ? 1 : 0,
    tax_rate ?? 0,
    commission_rate ?? 0,
    is_stock_available ? 1 : 0,
    max_per_order ?? null,
    min_per_order ?? null,
    promotion_id ?? null,
    thumbnail_url ?? null,
    stock_average ?? null,
    stock_danger ?? null,
    createdAt,
    updatedAt,
    expires_at ? toMySQLDate(new Date(expires_at)) : null,
    status_id ?? 1,
  ]
);


    return NextResponse.json(
      {
        message: "Producto creado correctamente",
        product_id: (result as any).insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error en POST /products:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function toMySQLDate(date: Date) {
  const pad = (n: number) => (n < 10 ? "0" + n : n);

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}