import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { first_name, last_name, phone, email, password, roles } =
      await req.json();

    // 1) Validación de campos requeridos
    const missing: string[] = [];
    if (!first_name) missing.push("first_name");
    if (!last_name) missing.push("last_name");
    if (!phone) missing.push("phone");
    if (!email) missing.push("email");
    if (!password) missing.push("password");

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // 2) Hashear contraseña
    const pepper = process.env.PASSWORD_PEPPER ?? "";
    const rounds = parseInt(process.env.SALT_ROUNDS || "12", 10);
    const password_hash = await bcrypt.hash(password + pepper, rounds);

    // 3) Insertar usuario en DB
    const [result] = await pool.query(
      `
      INSERT INTO users (first_name, last_name, phone, email, password_hash, is_verified, status_id)
      VALUES (?, ?, ?, ?, ?, FALSE, 1)
      `,
      [first_name, last_name, phone, email, password_hash]
    );

    const userId = (result as any).insertId;

    // 4) Insertar roles (si vienen)
    if (roles && Array.isArray(roles) && roles.length > 0) {
      const roleValues = roles.map((role_id: number) => [userId, role_id]);
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id) VALUES ?`,
        [roleValues]
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user_id: userId,
        roles_created: roles ?? [],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);

    // Error email duplicado
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Server error", details: error?.message },
      { status: 500 }
    );
  }
}
