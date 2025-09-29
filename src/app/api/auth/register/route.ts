import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { first_name, last_name, phone, email, password, role } =
      await req.json();

    // 1) Validación de campos obligatorios (sin role porque DB ya lo maneja)
    const missing: string[] = [];
    if (!first_name) missing.push("first_name");
    if (!last_name) missing.push("last_name");
    if (!phone) missing.push("phone");
    if (!email) missing.push("email");
    if (!password) missing.push("password");

    if (missing.length) {
      return NextResponse.json(
        { error: `Missing fields: ${missing.join(", ")}` },
        { status: 400 },
      );
    }

    // 2) Hashear la password
    const pepper = process.env.PASSWORD_PEPPER ?? "";
    const rounds = parseInt(process.env.SALT_ROUNDS || "12", 10);
    const hashedPassword = await bcrypt.hash(password + pepper, rounds);

    // 3) Preparar valores para role (opcional)
    let values: any[] = [first_name, last_name, phone, email, hashedPassword];
    let query =
      "INSERT INTO users (first_name, last_name, phone, email, password";

    if (role) {
      query += ", role) VALUES (?, ?, ?, ?, ?, ?)";
      values.push(role.toUpperCase());
    } else {
      query += ") VALUES (?, ?, ?, ?, ?)";
    }

    // 4) Guardar en DB
    await pool.query(query, values);

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error?.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
