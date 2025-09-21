import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function POST(req: Request) {
  try {
  
  
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    await pool.query("INSERT INTO usuarios (email, password) VALUES (?, ?)", [email, password])

    return NextResponse.json({ message: "Usuario registrado con éxito" })
  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
