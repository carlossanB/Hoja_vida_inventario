import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Sun, Moon } from 'lucide-react';
import LogoAnimado from './LogoAnimado';

function Layout({ children }) {
  const location = useLocation();
  const enInicio = location.pathname === '/' || (location.pathname.startsWith('/equipos/') && location.pathname !== '/equipos/nuevo');
  const enNuevo = location.pathname === '/equipos/nuevo';

  // Modo claro / oscuro con persistencia
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tecmovil_theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (tema === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('tecmovil_theme', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-300">
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-header)] backdrop-blur-xl transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[4.25rem] sm:min-h-[4.75rem] py-2.5 sm:py-3 gap-3">
            
            {/* Logo y Nombre — Aumentado y Responsive */}
             <Link to="/" className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg group">
                <LogoAnimado size={45} />
                    <span className="text-[var(--color-text-main)] font-bold text-lg sm:text-xl md:text-2xl tracking-tight block">
                       Inventario de equipos
                    </span>
              </Link>
  
            {/* Navegación + Toggle de Tema */}
            <nav className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Toggle Modo Claro / Oscuro */}
              <button
                type="button"
                onClick={toggleTema}
                aria-label={`Cambiar a modo ${tema === 'dark' ? 'claro' : 'oscuro'}`}
                title={`Cambiar a modo ${tema === 'dark' ? 'claro' : 'oscuro'}`}
                className="p-2 sm:p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-sub)] hover:text-[var(--color-primary-light)] hover:border-blue-500/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                {tema === 'dark' ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin-once" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 animate-spin-once" />
                )}
              </button>

              {/* Botón Equipos */}
              <Link
                to="/"
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  enInicio && !enNuevo
                    ? 'bg-blue-600/15 text-blue-500 border border-blue-500/30 shadow-sm'
                    : 'text-[var(--color-text-sub)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text-main)]'
                }`}
              >
                <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="hidden xs:inline sm:inline">Equipos</span>
              </Link>

              {/* Botón Nuevo */}
              <Link
                to="/equipos/nuevo"
                className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md ${
                  enNuevo
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-blue-600/40 ring-2 ring-blue-400/40 scale-[1.02]'
                    : 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white shadow-blue-600/25 hover:shadow-blue-500/35 hover:scale-[1.03] active:scale-[0.98]'
                }`}
              >
                <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                <span>Nuevo</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido Principal Fluido */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex-1">
        {children}
      </main>

      {/* Footer Corporativo */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] py-6 px-4 sm:px-6 transition-colors duration-300 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-[var(--color-text-main)]">Tecmovil Group S.A.S.</span>
            <span>·</span>
            <span>Sistema de Hoja de Vida & Inventario de Equipos</span>
          </div>
          <div className="text-center sm:text-right">
            <span>© {new Date().getFullYear()} Todos los derechos reservados</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;