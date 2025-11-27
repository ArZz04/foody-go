"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  roles: string[];
}

interface DecodedToken {
  exp: number;
  iat: number;
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) return;

  (async () => {
    try {
      // 1️⃣ Verificar token
      const verifyRes = await fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verifyRes.ok) {
        logout();
        return;
      }

      // 2️⃣ Obtener roles actualizados del backend
      const rolesRes = await fetch("/api/auth/role", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let roles: string[] = [];
      if (rolesRes.ok) {
        const data = await rolesRes.json();
        roles = Array.isArray(data.roles)
          ? data.roles.map((r: any) => r.name)
          : [];
      }

      // 3️⃣ Reconstruir objeto user actualizado
      const parsedUser = JSON.parse(storedUser);
      const updatedUser = { ...parsedUser, roles };

      setUser(updatedUser);

      // 4️⃣ Guardar actualización
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("roles", JSON.stringify(roles));
      
    } catch (error) {
      console.error("Error verificando sesión:", error);
      logout();
    }
  })();
}, []);


  const login = async (userData: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Obtener roles desde el backend
    try {
      const rolesRes = await fetch("/api/auth/role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (rolesRes.ok) {
        const { roles } = await rolesRes.json();

        // Extrae los nombres de todos los roles (si existen)
        const userRoles = Array.isArray(roles)
          ? roles.map((r: any) => r.name)
          : ["user"];

        // Actualizamos el usuario en memoria (estado React)
        setUser((prev) => (prev ? { ...prev, roles: userRoles } : null));

        // Guardamos también los roles actualizados en localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          parsedUser.roles = userRoles;
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }

        // O si prefieres guardar todos los roles por separado
        localStorage.setItem("roles", JSON.stringify(userRoles));
      }
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
    document.cookie = "authToken=; path=/; max-age=0; secure; samesite=lax";
    router.push("/"); // ← correcto
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
