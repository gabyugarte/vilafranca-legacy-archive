import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/historia")({
  component: HistoriaLayout,
});

function HistoriaLayout() {
  return <Outlet />;
}