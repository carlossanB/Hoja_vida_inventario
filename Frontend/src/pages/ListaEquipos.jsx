import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Laptop, ChevronRight, Plus } from 'lucide-react';
import api from '../services/api';

function ListaEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    async function traerDatos() {
      try {
        const [resEquipos, resAsignaciones] = await Promise.all([
          api.get('/equipos'),
          api.get('/asignaciones'),
        ]);
        setEquipos(resEquipos.data || []);
        const activas = (resAsignaciones.data || []).filter((a) => !a.fechaDevolucion);
        setAsignaciones(activas);
      } catch (error) {
        console.log('Error al traer datos:', error);
      } finally {
        setCargando(false);
      }
    }
    traerDatos();
  }, []);

  function estaAsignado(equipoId) {
    return asignaciones.some(
      (a) => a.equipo?.id === equipoId || a.equipoId === equipoId
    );
  }

  function nombreResponsable(equipoId) {
    const a = asignaciones.find(
      (a) => a.equipo?.id === equipoId || a.equipoId === equipoId
    );
    return a?.responsable?.nombre || null;
  }

  const equiposFiltrados = equipos.filter((equipo) => {
    const texto = busqueda.toLowerCase();
    const coincide =
      equipo.numeroInventario?.toLowerCase().includes(texto) ||
      equipo.marca?.toLowerCase().includes(texto) ||
      equipo.modelo?.toLowerCase().includes(texto);

    if (!coincide) return false;
    if (filtro === 'bodega') return !estaAsignado(equipo.id);
    if (filtro === 'asignados') return estaAsignado(equipo.id);
    return true;
  });

  const totalBodega = equipos.filter((e) => !estaAsignado(e.id)).length;
  const totalAsignados = equipos.filter((e) => estaAsignado(e.id)).length;

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Encabezado Fluido */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="fluid-title font-bold text-[var(--color-text-main)] tracking-tight">
            Inventario
          </h1>
          <p className="fluid-subtitle text-[var(--color-text-sub)] mt-2 flex flex-wrap items-center gap-1.5">
            <span className="text-blue-500 font-semibold">{equipos.length}</span> equipos
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="text-emerald-500 font-semibold">{totalAsignados}</span> en uso
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="text-amber-500 font-semibold">{totalBodega}</span> en bodega
          </p>
        </div>
      </div>

      {/* Barra de Filtros + Buscador Adaptable */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-1">
        {/* Pestañas de Filtro */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              filtro === 'todos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-102'
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-sub)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)]'
            }`}
          >
            Todos ({equipos.length})
          </button>
          <button
            onClick={() => setFiltro('asignados')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              filtro === 'asignados'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-102'
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-sub)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)]'
            }`}
          >
            En uso ({totalAsignados})
          </button>
          <button
            onClick={() => setFiltro('bodega')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              filtro === 'bodega'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-102'
                : 'bg-[var(--color-surface-subtle)] text-[var(--color-text-sub)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)]'
            }`}
          >
            Bodega ({totalBodega})
          </button>
        </div>

        {/* Campo de Búsqueda Fluido */}
        <div className="relative w-full md:w-72 lg:w-80 shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por inventario, marca o modelo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-input-text)] text-xs sm:text-sm placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Grid de equipos Fluido con auto-fit/minmax */}
      {equiposFiltrados.length === 0 ? (
        <div className="text-center py-16 sm:py-24 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-sm">
          <Laptop className="w-12 h-12 sm:w-14 sm:h-14 text-[var(--color-text-muted)] mx-auto mb-3.5" />
          <p className="text-[var(--color-text-main)] font-semibold text-base sm:text-lg">
            No hay equipos en esta vista
          </p>
          <p className="text-[var(--color-text-muted)] text-xs sm:text-sm mt-1 mb-5">
            {busqueda ? 'Prueba con otra búsqueda o cambia de filtro' : 'Registra el primer equipo para comenzar'}
          </p>
          {!busqueda && (
            <Link
              to="/equipos/nuevo"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold px-4.5 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-blue-500/35 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Registrar equipo
            </Link>
          )}
        </div>
      ) : (
        <div className="fluid-cards-grid">
          {equiposFiltrados.map((equipo) => {
            const asignado = estaAsignado(equipo.id);
            const responsable = nombreResponsable(equipo.id);

            return (
              <Link
                key={equipo.id}
                to={`/equipos/${equipo.id}`}
                className="app-card app-card-interactive group p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="bg-blue-500/15 text-blue-600 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-500/25 truncate max-w-[60%]">
                      {equipo.numeroInventario}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                        asignado
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/25'
                      }`}
                    >
                      {asignado ? '● En uso' : '○ Bodega'}
                    </span>
                  </div>

                  {/* Nombre y Modelo */}
                  <h3 className="font-bold text-[var(--color-text-main)] text-base leading-snug group-hover:text-blue-500 transition-colors duration-200 line-clamp-2">
                    {equipo.marca} {equipo.modelo}
                  </h3>

                  {/* Serial */}
                  <p className="text-xs sm:text-sm text-[var(--color-text-sub)] mt-1.5 truncate">
                    Serial: <span className="font-medium">{equipo.serial || '—'}</span>
                  </p>

                  {/* Responsable Actual si está asignado */}
                  {asignado && responsable && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 truncate font-medium flex items-center gap-1">
                      <span>→</span> {responsable}
                    </p>
                  )}
                </div>

                {/* Pie de la Tarjeta */}
                <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      equipo.estadoFisico === 'BUENO'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : equipo.estadoFisico === 'REGULAR'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        : 'bg-red-500/15 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {equipo.estadoFisico}
                  </span>
                  <span className="flex items-center text-xs sm:text-sm text-blue-500 font-semibold opacity-90 sm:opacity-0 sm:group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">
                    Ver detalle
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ListaEquipos;