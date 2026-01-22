import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (
      roles &&
      roles.length > 0 &&
      !user.roles?.some((role: any) => roles.includes(role.name))
    ) {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, roles, loading, navigate]);

  // ⏳ tunggu auth siap
  if (loading) return null;

  // ❌ belum login
  if (!user) return null;

  // ❌ role tidak sesuai
  if (
    roles &&
    roles.length > 0 &&
    !user.roles?.some((role: any) => roles.includes(role.name))
  ) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
