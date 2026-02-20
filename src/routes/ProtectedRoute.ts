import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", {
        replace: true,
        state: { from: location },
      });
      return;
    }

    if (roles && roles.length > 0) {
      const hasAccess = user.roles?.some((r: any) =>
        typeof r === "string"
          ? roles.includes(r)
          : roles.includes(r.name)
      );

      if (!hasAccess) {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [user, loading, roles, navigate, location]);

  // ⏳ tunggu auth siap
  if (loading) return null;

  // ❌ belum login atau role salah → redirect via effect
  if (!user) return null;

  if (
    roles &&
    roles.length > 0 &&
    !user.roles?.some((r: any) =>
      typeof r === "string"
        ? roles.includes(r)
        : roles.includes(r.name)
    )
  ) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
