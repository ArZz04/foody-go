"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  name: string;
  role: string;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      (async () => {
        try {
          const res = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            setUser(JSON.parse(userData));
          } else {
            logout();
          }
        } catch (err) {
          console.error("Error al verificar token:", err);
          logout();
        }
      })();
    }
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
