import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/organizaciones")({
  component: OrganizacionesLayout,
});

function OrganizacionesLayout() {
  return <Outlet />;
}