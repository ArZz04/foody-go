import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken"


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // 1) Buscar usuario por email
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 },
      );
    }

    const user = users[0];

    // 2) Validar contraseña con bcrypt
    const pepper = process.env.PASSWORD_PEPPER ?? "";
    const passwordMatch = await bcrypt.compare(
      password + pepper,
      user.password,
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 },
      );
    }

    // 3) Generar token JWT
    const secret: jwt.Secret = process.env.JWT_SECRET as string
    if (!secret) {
      throw new Error("JWT_SECRET no configurado en .env");
    }

    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || "9h") as SignOptions["expiresIn"],
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
      },
      secret,
      options
    )

    // 4) Decidir redirección según rol
    const redirectTo =
      user.role === "CUSTOMER" ? "/tiendas" : "/dashboard";

    // 5) Devolver token y ruta de redirección
    return NextResponse.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
      },
      redirectTo,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 },
    );
  }
}
