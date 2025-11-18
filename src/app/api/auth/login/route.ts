import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // 1) Buscar usuario por email (solo columnas necesarias)
    const [rows] = await pool.query(
      `
      SELECT id, first_name, last_name, email, password_hash, is_verified, status_id
      FROM users
      WHERE email = ?
      `,
      [email]
    );
    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const user = users[0];

    // 2) Validar contraseña
    const pepper = process.env.PASSWORD_PEPPER ?? "";
    const passwordMatch = await bcrypt.compare(password + pepper, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // 3) Obtener roles del usuario
    const [roleRows] = await pool.query(
      `
      SELECT r.id, r.code, r.name 
      FROM user_roles ur
      INNER JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = ?
      `,
      [user.id]
    );

    const roles = roleRows as { id: number; code: string; name: string }[];

    // 4) Definir si tiene permisos especiales
    const hasRoles = roles.length > 0;

    // 5) Redirección basada en roles
    const redirectTo = hasRoles ? "/pickdash" : "/";

    // 6) Generar JWT
    const secret: jwt.Secret = process.env.JWT_SECRET as string;
    if (!secret) throw new Error("JWT_SECRET no configurado en .env");

    // normalize expiresIn to the type expected by the jsonwebtoken types
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "9h") as unknown as SignOptions["expiresIn"];

    const options: SignOptions = {
      expiresIn,
    };

    const token = jwt.sign(
      {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        roles: roles.map((r) => r.code), // almacenar solo códigos
      },
      secret,
      options
    );

    // 7) Respuesta final
    return NextResponse.json({
      message: "Login exitoso",
      token,
      redirectTo,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        roles: roles.map((r) => r.code), // ejemplo: ["ADMIN","OWNER"]
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Error en el servidor",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
