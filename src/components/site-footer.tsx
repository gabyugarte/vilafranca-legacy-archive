export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="font-display text-2xl text-foreground">Barrio Vilafranca</div>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Un museo digital dedicado a preservar la historia espiritual, cultural
              y humana del Barrio Vilafranca de La Iglesia de Jesucristo de los
              Santos de los Últimos Días.
            </p>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              «Recordad, recordad»
            </div>
            <p className="mt-2 text-sm italic text-muted-foreground">
              «Y esto lo escribimos para que sepan que aún vivimos por Cristo».
            </p>
          </div>
          <div className="text-sm text-muted-foreground md:text-right">
            <p>Un proyecto para las generaciones futuras.</p>
            <p className="mt-1">
              © {new Date().getFullYear()} Barrio Vilafranca. Todos los recuerdos
              pertenecen a sus miembros.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
