import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ? AND password = ?", [email, password])
    const usuarios = rows as any[]

    if (usuarios.length === 0) {
      return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 })
    }

    return NextResponse.json({ message: "Login exitoso", user: usuarios[0] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
