import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import Custom404 from "@/pages/404";

const withAuth = (Component, type) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);

    const [stat, setStat] = useState(200);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      if (type === "admin" && user?.role !== "admin") {
        setStat(404);
        return;
      }

      if (
        type === "moderator" &&
        user?.role !== "moderator" &&
        user?.role !== "admin"
      ) {
        setStat(404);
        return;
      }
    }, [isAuthenticated, user]);

    if (stat === 404) return <Custom404 />;

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};
export default withAuth;
