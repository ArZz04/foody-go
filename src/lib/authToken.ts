
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function validateAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return false;

  const token = auth.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch (error) {
    console.error("❌ Token inválido:", error);
    return false;
  }
}