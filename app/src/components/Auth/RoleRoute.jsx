import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

const RoleRoute = ({ children, requiredRoles }) => {
  const { authorize, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Si no hay sesión activa → redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/user/login" replace />;
  }

  // Si el usuario no tiene el rol requerido → muestra mensaje de acceso denegado
  if (!authorize(requiredRoles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso no autorizado</h1>
        <p className="mb-6">No tienes permisos para acceder a esta sección.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/90"
        >
          Regresar
        </button>
      </div>
    );
  }

  // Si cumple con los roles → renderiza el contenido
  return children;
};

export default RoleRoute;
