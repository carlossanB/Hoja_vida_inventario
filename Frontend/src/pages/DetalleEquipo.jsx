import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Monitor, Wrench, Calendar, Cpu, UserPlus, X, FileText, Check, Trash2 } from 'lucide-react';
import api from '../services/api';
import { exportarHojaVidaWord } from '../services/exportarWord';

function DetalleEquipo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [asignacion, setAsignacion] = useState(null);
  const [historialAsignaciones, setHistorialAsignaciones] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [responsables, setResponsables] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [exportandoWord, setExportandoWord] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // Formulario de asignación libre
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreResponsable, setNombreResponsable] = useState('');
  const [cedulaResponsable, setCedulaResponsable] = useState('');
  const [areaResponsable, setAreaResponsable] = useState('');
  const [fechaAsignacion, setFechaAsignacion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function cargarDatos() {
    try {
      const resEquipo = await api.get(`/equipos/${id}`);
      setEquipo(resEquipo.data);

      // Asignación activa
      try {
        const resAsignacion = await api.get(`/asignaciones/activa/${id}`);
        setAsignacion(resAsignacion.data);
      } catch {
        setAsignacion(null);
      }

      // Historial completo de asignaciones
      try {
        const resTodas = await api.get('/asignaciones');
        const delEquipo = (resTodas.data || []).filter(
          (a) => a.equipo?.id === Number(id) || a.equipoId === Number(id)
        );
        delEquipo.sort((a, b) => new Date(b.fechaAsignacion) - new Date(a.fechaAsignacion));
        setHistorialAsignaciones(delEquipo);
      } catch {
        setHistorialAsignaciones([]);
      }

      // Mantenimientos
      try {
        const resMantenimientos = await api.get(`/mantenimientos/equipo/${id}`);
        setMantenimientos(resMantenimientos.data);
      } catch {
        setMantenimientos([]);
      }

      // Lista de responsables existentes
      try {
        const resResponsables = await api.get('/responsables');
        setResponsables(resResponsables.data || []);
      } catch {
        setResponsables([]);
      }
    } catch (error) {
      console.log('Error al cargar el detalle:', error);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, [id]);

  // Manejar cambio en el campo de nombre (combobox)
  function manejarCambioNombre(valor) {
    setNombreResponsable(valor);
    // Si coincide exactamente con un responsable existente, auto-completar sus datos
    const coincidencia = responsables.find(
      (r) => r.nombre.toLowerCase().trim() === valor.toLowerCase().trim()
    );
    if (coincidencia) {
      setCedulaResponsable(coincidencia.cedula || '');
      setAreaResponsable(coincidencia.area || '');
    }
  }

  // Asignar responsable (existente o nuevo)
  async function asignarResponsable(e) {
    e.preventDefault();
    setError('');

    const nombreLimpio = nombreResponsable.trim();
    if (!nombreLimpio) {
      setError('Por favor ingresa el nombre del responsable.');
      return;
    }

    setGuardando(true);

    try {
      await api.post('/asignaciones', {
        equipo: { id: Number(id) },
        responsable: {
          nombre: nombreLimpio,
          cedula: cedulaResponsable.trim() || undefined,
          area: areaResponsable.trim() || 'General',
        },
        fechaAsignacion: fechaAsignacion || new Date().toISOString().split('T')[0],
        observaciones: observaciones.trim() || null,
      });

      setMostrarFormulario(false);
      setNombreResponsable('');
      setCedulaResponsable('');
      setAreaResponsable('');
      setFechaAsignacion('');
      setObservaciones('');
      await cargarDatos();
    } catch (err) {
      console.log(err);
      setError('No se pudo asignar el responsable. Verifica los datos.');
    } finally {
      setGuardando(false);
    }
  }

  // Devolver equipo
  async function devolverEquipo() {
    if (!asignacion) return;
    if (!confirm('¿Confirmas que se devuelve este equipo?')) return;

    try {
      const hoy = new Date().toISOString().split('T')[0];
      await api.put(`/asignaciones/${asignacion.id}`, {
        fechaDevolucion: hoy,
      });
      await cargarDatos();
    } catch (err) {
      console.log(err);
      alert('No se pudo registrar la devolución');
    }
  }

  // Exportar Hoja de Vida a Word (.docx) — usa plantilla oficial Teams Pro via backend
  async function handleExportarWord() {
    if (!equipo) return;
    try {
      setExportandoWord(true);
      await exportarHojaVidaWord(equipo.id, equipo.numeroInventario);
    } catch (err) {
      console.error('Error al exportar a Word:', err);
      alert('Ocurrió un error al generar el documento Word. Intenta nuevamente.');
    } finally {
      setExportandoWord(false);
    }
  }

  // Eliminar equipo con confirmación
  async function eliminarEquipo() {
    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar este equipo (${equipo.numeroInventario || ''})?\n\nEsta acción también eliminará sus asignaciones y mantenimientos asociados.`
    );
    if (!confirmar) return;

    try {
      setEliminando(true);
      await api.delete(`/equipos/${id}`);
      alert('Equipo eliminado correctamente.');
      navigate('/');
    } catch (err) {
      console.error('Error al eliminar el equipo:', err);
      alert('No se pudo eliminar el equipo. Intenta nuevamente.');
      setEliminando(false);
    }
  }

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="text-center py-24 app-card">
        <p className="text-[var(--color-text-muted)] mb-4">No se encontró el equipo</p>
        <Link to="/" className="text-blue-500 hover:underline text-sm font-medium">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Volver */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[var(--color-text-sub)] hover:text-blue-500 transition-all duration-200 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a equipos
      </Link>

      {/* Título y Botones de Acción */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="bg-blue-500/15 text-blue-600 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-500/25">
              {equipo.numeroInventario}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                equipo.estadoFisico === 'BUENO'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/25'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/25'
              }`}
            >
              {equipo.estadoFisico}
            </span>
          </div>
          <h1 className="fluid-title font-bold text-[var(--color-text-main)] tracking-tight">
            {equipo.marca} {equipo.modelo}
          </h1>
        </div>

        {/* Botones de Acción: Exportar a Word y Eliminar Equipo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Botón Exportar a Word */}
          <button
            type="button"
            onClick={handleExportarWord}
            disabled={exportandoWord || eliminando}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/25 hover:shadow-blue-500/35 hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer shrink-0"
          >
            <FileText className="w-4 h-4" />
            {exportandoWord ? 'Generando Word...' : 'Exportar a Word (.docx)'}
          </button>

          {/* Botón Eliminar Equipo */}
          <button
            type="button"
            onClick={eliminarEquipo}
            disabled={eliminando || exportandoWord}
            className="inline-flex items-center justify-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-600/30 hover:border-rose-600/50 disabled:opacity-50 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer shrink-0"
            title="Eliminar este equipo"
          >
            <Trash2 className="w-4 h-4" />
            {eliminando ? 'Eliminando...' : 'Eliminar equipo'}
          </button>
        </div>
      </div>

      {/* Grid: Responsable + Info general */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* RESPONSABLE ACTUAL */}
        <div className="lg:col-span-1 app-card p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
                <User className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="font-bold text-[var(--color-text-main)]">Responsable actual</h2>
            </div>

            {asignacion?.responsable ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Nombre</p>
                  <p className="font-semibold text-[var(--color-text-main)] mt-0.5 text-sm">{asignacion.responsable.nombre}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Cédula</p>
                  <p className="font-medium text-[var(--color-text-sub)] mt-0.5 text-sm">{asignacion.responsable.cedula}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Área</p>
                  <p className="font-medium text-[var(--color-text-sub)] mt-0.5 capitalize text-sm">
                    {asignacion.responsable.area}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    ACTIVO
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)]">Desde {asignacion.fechaAsignacion}</span>
                </div>

                <button
                  onClick={devolverEquipo}
                  className="w-full mt-3 text-xs sm:text-sm text-[var(--color-text-sub)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)] py-2 rounded-xl transition-all duration-200 cursor-pointer font-medium"
                >
                  🏁 Registrar devolución
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center py-3 mb-3">
                  <p className="text-[var(--color-text-muted)] text-xs sm:text-sm mb-2">Sin responsable asignado</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-300 bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-lg">
                    📦 EN BODEGA
                  </span>
                </div>

                {!mostrarFormulario ? (
                  <button
                    onClick={() => setMostrarFormulario(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    Asignar responsable
                  </button>
                ) : (
                  <form onSubmit={asignarResponsable} className="space-y-3 border-t border-[var(--color-border)] pt-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs sm:text-sm font-bold text-[var(--color-text-main)]">Nueva asignación</p>
                      <button type="button" onClick={() => setMostrarFormulario(false)}>
                        <X className="w-4 h-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]" />
                      </button>
                    </div>

                    {error && (
                      <p className="text-xs text-red-600 dark:text-red-300 bg-red-500/15 border border-red-500/30 p-2 rounded-lg">{error}</p>
                    )}

                    {/* Campo de Nombre Libre con Datalist de opciones previas */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-sub)] mb-1">
                        Nombre del Responsable *
                      </label>
                      <input
                        type="text"
                        list="lista-responsables-existentes"
                        value={nombreResponsable}
                        onChange={(e) => manejarCambioNombre(e.target.value)}
                        required
                        placeholder="Escribe o selecciona..."
                        className="app-input"
                      />
                      <datalist id="lista-responsables-existentes">
                        {responsables.map((r) => (
                          <option key={r.cedula} value={r.nombre}>
                            {r.cedula} - {r.area}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    {/* Cédula */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-sub)] mb-1">
                        Cédula / Identificación (opcional)
                      </label>
                      <input
                        type="text"
                        value={cedulaResponsable}
                        onChange={(e) => setCedulaResponsable(e.target.value)}
                        placeholder="Ej: 1020304050"
                        className="app-input"
                      />
                    </div>

                    {/* Área */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-sub)] mb-1">
                        Área / Dependencia
                      </label>
                      <input
                        type="text"
                        value={areaResponsable}
                        onChange={(e) => setAreaResponsable(e.target.value)}
                        placeholder="Ej: Sistemas, Operaciones, Ventas..."
                        className="app-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-sub)] mb-1">
                        Fecha de asignación
                      </label>
                      <input
                        type="date"
                        value={fechaAsignacion}
                        onChange={(e) => setFechaAsignacion(e.target.value)}
                        className="app-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-sub)] mb-1">
                        Observaciones
                      </label>
                      <input
                        type="text"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Opcional"
                        className="app-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={guardando || !nombreResponsable.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 cursor-pointer"
                    >
                      {guardando ? 'Guardando...' : 'Confirmar asignación'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* INFORMACIÓN GENERAL */}
        <div className="lg:col-span-2 app-card p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
              <Monitor className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className="font-bold text-[var(--color-text-main)]">Información general</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Tipo</p>
              <p className="font-medium text-[var(--color-text-main)] mt-0.5 text-sm">{equipo.tipoActivo || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Serial</p>
              <p className="font-medium text-[var(--color-text-main)] mt-0.5 text-sm">{equipo.serial || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Adquisición</p>
              <p className="font-medium text-[var(--color-text-main)] mt-0.5 text-sm">
                {equipo.fechaAdquisicion || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Garantía</p>
              <p className="font-medium text-[var(--color-text-main)] mt-0.5 text-sm">{equipo.garantia || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Accesorios</p>
              <p className="font-medium text-[var(--color-text-main)] mt-0.5 text-sm">{equipo.accesorios || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Observaciones</p>
              <p className="font-medium text-[var(--color-text-main)] mt-0.5 text-sm">
                {equipo.observaciones || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ESPECIFICACIONES TÉCNICAS */}
      <div className="app-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="font-bold text-[var(--color-text-main)]">Especificaciones técnicas</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {[
            { label: 'Procesador', value: equipo.procesador },
            { label: 'Memoria RAM', value: equipo.memoriaRam },
            { label: 'Disco duro', value: equipo.discoDuro },
            { label: 'Tarjeta gráfica', value: equipo.tarjetaGrafica },
            { label: 'Sistema operativo', value: equipo.sistemaOperativo },
            { label: 'Licencia Office', value: equipo.licenciaOffice },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-xl p-3.5">
              <p className="text-xs text-[var(--color-text-muted)] font-medium mb-1">{item.label}</p>
              <p className="font-semibold text-[var(--color-text-main)] text-xs sm:text-sm leading-snug">
                {item.value || '—'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORIAL DE RESPONSABLES */}
      <div className="app-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="font-bold text-[var(--color-text-main)]">📋 Historial de responsables</h2>
        </div>

        {historialAsignaciones.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-xs sm:text-sm py-4 text-center">
            Aún no hay asignaciones registradas
          </p>
        ) : (
          <div className="space-y-3">
            {historialAsignaciones.map((a) => {
              const activo = !a.fechaDevolucion;
              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    activo
                      ? 'border-emerald-500/30 bg-emerald-500/10'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-bold text-[var(--color-text-main)] text-sm">
                        {a.responsable?.nombre || 'Sin nombre'}
                      </p>
                      <p className="text-xs text-[var(--color-text-sub)] mt-0.5">
                        Cédula: {a.responsable?.cedula || '—'} · Área:{' '}
                        {a.responsable?.area || '—'}
                      </p>
                    </div>

                    <div className="text-sm">
                      {activo ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Tiene el equipo ahora
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-subtle)] border border-[var(--color-border)] px-2.5 py-1 rounded-lg">
                          Devuelto
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-[var(--color-text-sub)]">
                    <span>
                      📅 Asignado:{' '}
                      <strong className="text-[var(--color-text-main)]">{a.fechaAsignacion}</strong>
                    </span>
                    {a.fechaDevolucion && (
                      <span>
                        🏁 Devuelto:{' '}
                        <strong className="text-[var(--color-text-main)]">{a.fechaDevolucion}</strong>
                      </span>
                    )}
                  </div>

                  {a.observaciones && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-2 italic">{a.observaciones}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HISTORIAL DE MANTENIMIENTO */}
      <div className="app-card p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
            <Wrench className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="font-bold text-[var(--color-text-main)]">🔧 Historial de mantenimiento</h2>
        </div>

        {mantenimientos.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-xs sm:text-sm py-4 text-center">
            No hay mantenimientos registrados
          </p>
        ) : (
          <div className="space-y-3">
            {mantenimientos.map((m) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] hover:bg-[var(--color-surface-hover)] transition-all duration-200"
              >
                <div className="flex items-center gap-2 sm:w-36 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span className="text-xs sm:text-sm text-[var(--color-text-main)] font-semibold">{m.fecha}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {m.tipo && (
                      <span className="text-xs font-semibold bg-blue-500/15 border border-blue-500/25 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-md">
                        {m.tipo}
                      </span>
                    )}
                    {m.tecnico && (
                      <span className="text-xs text-[var(--color-text-muted)]">por {m.tecnico}</span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--color-text-sub)]">{m.detalle}</p>
                  {m.observaciones && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 italic">{m.observaciones}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DetalleEquipo;