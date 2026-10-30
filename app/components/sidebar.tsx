"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Factory,
  LayoutDashboard,
  Menu,
  Wrench,
  X,
} from "lucide-react";

const enlaces = [
  { href: "/", label: "Panel", icon: LayoutDashboard },
  { href: "/maquinas", label: "Máquinas", icon: Factory },
  { href: "", label: "Mantenimientos", icon: Wrench },
] as const;

function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      
      <span className="text-sm font-semibold text-white">
        MetalCom
        <span className="ml-1.5 font-normal text-white/50">Mantenimiento</span>
      </span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  function activo(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between bg-steel px-5 py-3 md:hidden">
        <Marca />
        <button
          type="button"
          onClick={() => setAbierto(true)}
          className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {abierto && (
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="fixed inset-0 z-40 bg-steel/50 md:hidden"
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-steel transition-transform duration-200 md:translate-x-0 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Marca />
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          <p className="px-3 pb-2 text-[11px] font-medium tracking-wider text-white/40 uppercase">
            Menú
          </p>
          {enlaces.map(({ href, label, icon: Icono }) => {
            const seleccionado = activo(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setAbierto(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  seleccionado
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icono
                  className={`size-4.5 ${
                    seleccionado ? "text-industrial" : "text-white/50"
                  }`}
                />
                {label}
                {seleccionado && (
                  <span className="ml-auto size-1.5 rounded-full bg-industrial" />
                )}
              </Link>
            );
          })}
        </nav>

       
      </aside>
    </>
  );
}
