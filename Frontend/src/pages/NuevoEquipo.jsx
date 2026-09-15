import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import api from '../services/api';

function NuevoEquipo() {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const [formulario, setFormulario] = useState({
    numeroInventario: '',
    tipoActivo: 'COMPUTADOR PORTÁTIL',
    marca: '',
    modelo: '',
    serial: '',
    fechaAdquisicion: '',
    estadoFisico: 'BUENO',
    procesador: '',
    memoriaRam: '',
    discoDuro: '',
    tarjetaGrafica: '',
    sistemaOperativo: '',
    licenciaOffice: '',
    accesorios: '',
    garantia: '',
    observaciones: '',
  });

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  // Saber qué tipo de equipo es
  const esComputador =
    formulario.tipoActivo === 'COMPUTADOR PORTÁTIL' ||
    formulario.tipoActivo === 'COMPUTADOR DE ESCRITORIO';
  const esCelular = formulario.tipoActivo === 'CELULAR';
  const esMonitor = formulario.tipoActivo === 'MONITOR';
  const esImpresora = formulario.tipoActivo === 'IMPRESORA';

  async function guardar(e) {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      await api.post('/equipos', formulario);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError('No se pudo guardar el equipo. Revisa los datos.');
    } finally {
      setGuardando(false);
    }
  }

  const inputClass = 'app-input';

  // Marcas según tipo
  const marcasComputador = (
    <>
      <option value="LENOVO" />
      <option value="HP" />
      <option value="DELL" />
      <option value="ASUS" />
      <option value="ACER" />
      <option value="APPLE" />
      <option value="MSI" />
      <option value="SAMSUNG" />
      <option value="LG" />
      <option value="HUAWEI" />
      <option value="TOSHIBA" />
      <option value="MICROSOFT" />
    </>
  );

  const marcasCelular = (
    <>
      <option value="SAMSUNG" />
      <option value="APPLE" />
      <option value="XIAOMI" />
      <option value="MOTOROLA" />
      <option value="HUAWEI" />
      <option value="REALME" />
      <option value="OPPO" />
      <option value="VIVO" />
      <option value="ONEPLUS" />
      <option value="NOKIA" />
      <option value="ZTE" />
      <option value="HONOR" />
    </>
  );

  const marcasMonitor = (
    <>
      <option value="SAMSUNG" />
      <option value="LG" />
      <option value="DELL" />
      <option value="HP" />
      <option value="ASUS" />
      <option value="AOC" />
      <option value="BENQ" />
      <option value="VIEWSONIC" />
      <option value="PHILIPS" />
    </>
  );

  const marcasImpresora = (
    <>
      <option value="HP" />
      <option value="EPSON" />
      <option value="CANON" />
      <option value="BROTHER" />
      <option value="XEROX" />
      <option value="RICOH" />
      <option value="KYOCERA" />
      <option value="SAMSUNG" />
    </>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[var(--color-text-sub)] hover:text-blue-500 transition-all duration-200 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a equipos
      </Link>

      <div className="app-card p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-main)] tracking-tight mb-1">
          📦 Registrar equipo en inventario
        </h1>
        <p className="text-[var(--color-text-sub)] text-xs sm:text-sm mb-6">
          Úsalo para equipos nuevos o para los que ya existen en bodega / en uso
        </p>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-300 text-sm">{error}</div>
        )}

        <form onSubmit={guardar} className="space-y-5">
          {/* Datos principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Nº de Inventario *
              </label>
              <input
                type="text"
                name="numeroInventario"
                value={formulario.numeroInventario}
                onChange={manejarCambio}
                required
                placeholder="Ej: TPROPCL-103"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Tipo de activo *
              </label>
              <select
                name="tipoActivo"
                value={formulario.tipoActivo}
                onChange={manejarCambio}
                className={inputClass}
              >
                <option value="COMPUTADOR PORTÁTIL">💻 Computador Portátil</option>
                <option value="COMPUTADOR DE ESCRITORIO">🖥️ Computador de Escritorio</option>
                <option value="MONITOR">🖥️ Monitor</option>
                <option value="IMPRESORA">🖨️ Impresora</option>
                <option value="CELULAR">📱 Celular</option>
                <option value="OTRO">📦 Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Marca</label>
              <input
                list="lista-marcas"
                name="marca"
                value={formulario.marca}
                onChange={manejarCambio}
                placeholder="Escribe o elige..."
                className={inputClass}
              />
              <datalist id="lista-marcas">
                {esComputador && marcasComputador}
                {esCelular && marcasCelular}
                {esMonitor && marcasMonitor}
                {esImpresora && marcasImpresora}
                {!esComputador && !esCelular && !esMonitor && !esImpresora && (
                  <>
                    {marcasComputador}
                    {marcasCelular}
                    {marcasMonitor}
                    {marcasImpresora}
                  </>
                )}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Modelo</label>
              <input
                type="text"
                name="modelo"
                value={formulario.modelo}
                onChange={manejarCambio}
                placeholder={
                  esCelular
                    ? 'Ej: Galaxy A54'
                    : esImpresora
                    ? 'Ej: LaserJet Pro'
                    : esMonitor
                    ? 'Ej: 24" Full HD'
                    : 'Ej: IDEAPAD SLIM 5'
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {esCelular ? 'IMEI / Serial' : 'Serial'}
              </label>
              <input
                type="text"
                name="serial"
                value={formulario.serial}
                onChange={manejarCambio}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Fecha de adquisición
              </label>
              <input
                type="date"
                name="fechaAdquisicion"
                value={formulario.fechaAdquisicion}
                onChange={manejarCambio}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Estado físico
              </label>
              <select
                name="estadoFisico"
                value={formulario.estadoFisico}
                onChange={manejarCambio}
                className={inputClass}
              >
                <option value="BUENO">✅ Bueno</option>
                <option value="REGULAR">⚠️ Regular</option>
                <option value="MALO">❌ Malo</option>
              </select>
            </div>
          </div>

          {/* ========== ESPECIFICACIONES SEGÚN TIPO ========== */}

          {/* COMPUTADOR (Portátil o Escritorio) */}
          {esComputador && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">
                ⚙️ Especificaciones del computador
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Procesador</label>
                  <input
                    list="lista-procesadores"
                    name="procesador"
                    value={formulario.procesador}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-procesadores">
                    <option value="INTEL Core i3" />
                    <option value="INTEL Core i5" />
                    <option value="INTEL Core i7" />
                    <option value="INTEL Core i7-13620H" />
                    <option value="INTEL Core i9" />
                    <option value="INTEL Celeron" />
                    <option value="AMD Ryzen 3" />
                    <option value="AMD Ryzen 5" />
                    <option value="AMD Ryzen 7" />
                    <option value="AMD Ryzen 9" />
                    <option value="Apple M1" />
                    <option value="Apple M2" />
                    <option value="Apple M3" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Memoria RAM</label>
                  <input
                    list="lista-ram"
                    name="memoriaRam"
                    value={formulario.memoriaRam}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-ram">
                    <option value="4 GB" />
                    <option value="8 GB" />
                    <option value="12 GB" />
                    <option value="16 GB" />
                    <option value="32 GB" />
                    <option value="64 GB" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Disco duro</label>
                  <input
                    list="lista-discos"
                    name="discoDuro"
                    value={formulario.discoDuro}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-discos">
                    <option value="128 GB SSD" />
                    <option value="256 GB SSD" />
                    <option value="512 GB SSD" />
                    <option value="1 TB SSD" />
                    <option value="2 TB SSD" />
                    <option value="1 TB HDD" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tarjeta gráfica</label>
                  <input
                    list="lista-graficas"
                    name="tarjetaGrafica"
                    value={formulario.tarjetaGrafica}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-graficas">
                    <option value="Integrada" />
                    <option value="Intel UHD Graphics" />
                    <option value="Intel Iris Xe" />
                    <option value="NVIDIA GeForce GTX 1650" />
                    <option value="NVIDIA GeForce RTX 3050" />
                    <option value="NVIDIA GeForce RTX 4050" />
                    <option value="AMD Radeon" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Sistema operativo</label>
                  <input
                    list="lista-so-pc"
                    name="sistemaOperativo"
                    value={formulario.sistemaOperativo}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-so-pc">
                    <option value="Windows 10 Home" />
                    <option value="Windows 10 Pro" />
                    <option value="Windows 11 Home" />
                    <option value="Windows 11 Pro" />
                    <option value="Ubuntu" />
                    <option value="macOS" />
                    <option value="Sin sistema operativo" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Licencia Office</label>
                  <input
                    list="lista-office"
                    name="licenciaOffice"
                    value={formulario.licenciaOffice}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-office">
                    <option value="Microsoft 365" />
                    <option value="Office 2021" />
                    <option value="Office 2019" />
                    <option value="LibreOffice" />
                    <option value="Sin licencia" />
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {/* CELULAR */}
          {esCelular && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">
                📱 Especificaciones del celular
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Procesador / Chipset</label>
                  <input
                    list="lista-chipset"
                    name="procesador"
                    value={formulario.procesador}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-chipset">
                    <option value="Snapdragon 8 Gen 2" />
                    <option value="Snapdragon 7 Gen 1" />
                    <option value="Snapdragon 695" />
                    <option value="Dimensity 7020" />
                    <option value="Dimensity 1080" />
                    <option value="Exynos 1380" />
                    <option value="Apple A15 Bionic" />
                    <option value="Apple A16 Bionic" />
                    <option value="Apple A17 Pro" />
                    <option value="Helio G85" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Memoria RAM</label>
                  <input
                    list="lista-ram-cel"
                    name="memoriaRam"
                    value={formulario.memoriaRam}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-ram-cel">
                    <option value="3 GB" />
                    <option value="4 GB" />
                    <option value="6 GB" />
                    <option value="8 GB" />
                    <option value="12 GB" />
                    <option value="16 GB" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Almacenamiento</label>
                  <input
                    list="lista-almacenamiento"
                    name="discoDuro"
                    value={formulario.discoDuro}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-almacenamiento">
                    <option value="32 GB" />
                    <option value="64 GB" />
                    <option value="128 GB" />
                    <option value="256 GB" />
                    <option value="512 GB" />
                    <option value="1 TB" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Sistema operativo</label>
                  <input
                    list="lista-so-cel"
                    name="sistemaOperativo"
                    value={formulario.sistemaOperativo}
                    onChange={manejarCambio}
                    placeholder="Escribe o elige..."
                    className={inputClass}
                  />
                  <datalist id="lista-so-cel">
                    <option value="Android 12" />
                    <option value="Android 13" />
                    <option value="Android 14" />
                    <option value="Android 15" />
                    <option value="iOS 16" />
                    <option value="iOS 17" />
                    <option value="iOS 18" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Pantalla / Resolución</label>
                  <input
                    list="lista-pantalla"
                    name="tarjetaGrafica"
                    value={formulario.tarjetaGrafica}
                    onChange={manejarCambio}
                    placeholder="Ej: 6.5 pulgadas FHD+"
                    className={inputClass}
                  />
                  <datalist id="lista-pantalla">
                    <option value="6.1 pulgadas" />
                    <option value="6.4 pulgadas FHD+" />
                    <option value="6.5 pulgadas FHD+" />
                    <option value="6.7 pulgadas AMOLED" />
                    <option value="6.8 pulgadas QHD+" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Plan / Línea (opcional)</label>
                  <input
                    name="licenciaOffice"
                    value={formulario.licenciaOffice}
                    onChange={manejarCambio}
                    placeholder="Ej: Corporativo Claro"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* MONITOR */}
          {esMonitor && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">
                🖥️ Especificaciones del monitor
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tamaño</label>
                  <input
                    list="lista-tamano"
                    name="procesador"
                    value={formulario.procesador}
                    onChange={manejarCambio}
                    placeholder="Ej: 24 pulgadas"
                    className={inputClass}
                  />
                  <datalist id="lista-tamano">
                    <option value="19 pulgadas" />
                    <option value="21.5 pulgadas" />
                    <option value="24 pulgadas" />
                    <option value="27 pulgadas" />
                    <option value="32 pulgadas" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Resolución</label>
                  <input
                    list="lista-resolucion"
                    name="memoriaRam"
                    value={formulario.memoriaRam}
                    onChange={manejarCambio}
                    placeholder="Ej: 1920x1080"
                    className={inputClass}
                  />
                  <datalist id="lista-resolucion">
                    <option value="1366x768 (HD)" />
                    <option value="1920x1080 (Full HD)" />
                    <option value="2560x1440 (QHD)" />
                    <option value="3840x2160 (4K)" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo de panel</label>
                  <input
                    list="lista-panel"
                    name="discoDuro"
                    value={formulario.discoDuro}
                    onChange={manejarCambio}
                    placeholder="Ej: IPS"
                    className={inputClass}
                  />
                  <datalist id="lista-panel">
                    <option value="IPS" />
                    <option value="VA" />
                    <option value="TN" />
                    <option value="OLED" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Conectores</label>
                  <input
                    list="lista-conectores"
                    name="tarjetaGrafica"
                    value={formulario.tarjetaGrafica}
                    onChange={manejarCambio}
                    placeholder="Ej: HDMI, VGA, DisplayPort"
                    className={inputClass}
                  />
                  <datalist id="lista-conectores">
                    <option value="HDMI" />
                    <option value="HDMI y VGA" />
                    <option value="HDMI y DisplayPort" />
                    <option value="HDMI, VGA y DisplayPort" />
                    <option value="USB-C" />
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {/* IMPRESORA */}
          {esImpresora && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">
                🖨️ Especificaciones de la impresora
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Tipo</label>
                  <input
                    list="lista-tipo-imp"
                    name="procesador"
                    value={formulario.procesador}
                    onChange={manejarCambio}
                    placeholder="Ej: Láser"
                    className={inputClass}
                  />
                  <datalist id="lista-tipo-imp">
                    <option value="Láser monocromática" />
                    <option value="Láser color" />
                    <option value="Inyección de tinta" />
                    <option value="Multifuncional láser" />
                    <option value="Multifuncional tinta" />
                    <option value="Térmica" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Conectividad</label>
                  <input
                    list="lista-conectividad"
                    name="memoriaRam"
                    value={formulario.memoriaRam}
                    onChange={manejarCambio}
                    placeholder="Ej: USB y WiFi"
                    className={inputClass}
                  />
                  <datalist id="lista-conectividad">
                    <option value="USB" />
                    <option value="USB y Ethernet" />
                    <option value="USB y WiFi" />
                    <option value="USB, Ethernet y WiFi" />
                    <option value="WiFi" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Funciones</label>
                  <input
                    list="lista-funciones"
                    name="discoDuro"
                    value={formulario.discoDuro}
                    onChange={manejarCambio}
                    placeholder="Ej: Imprimir, escanear, copiar"
                    className={inputClass}
                  />
                  <datalist id="lista-funciones">
                    <option value="Solo imprimir" />
                    <option value="Imprimir y escanear" />
                    <option value="Imprimir, escanear y copiar" />
                    <option value="Imprimir, escanear, copiar y fax" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Formato de papel</label>
                  <input
                    list="lista-papel"
                    name="tarjetaGrafica"
                    value={formulario.tarjetaGrafica}
                    onChange={manejarCambio}
                    placeholder="Ej: A4"
                    className={inputClass}
                  />
                  <datalist id="lista-papel">
                    <option value="A4" />
                    <option value="Carta / Oficio" />
                    <option value="A3" />
                    <option value="Etiquetas" />
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {/* OTRO - campos genéricos */}
          {formulario.tipoActivo === 'OTRO' && (
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">
                ⚙️ Detalles del equipo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Descripción técnica</label>
                  <input
                    name="procesador"
                    value={formulario.procesador}
                    onChange={manejarCambio}
                    placeholder="Características principales"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Capacidad / Tamaño</label>
                  <input
                    name="memoriaRam"
                    value={formulario.memoriaRam}
                    onChange={manejarCambio}
                    placeholder="Si aplica"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Accesorios y garantía (común a todos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Accesorios</label>
              <input
                list="lista-accesorios"
                name="accesorios"
                value={formulario.accesorios}
                onChange={manejarCambio}
                placeholder="Escribe o elige..."
                className={inputClass}
              />
              <datalist id="lista-accesorios">
                {esCelular ? (
                  <>
                    <option value="Cargador" />
                    <option value="Cargador y cable" />
                    <option value="Cargador, cable y funda" />
                    <option value="Cargador y auriculares" />
                    <option value="Ninguno" />
                  </>
                ) : esImpresora ? (
                  <>
                    <option value="Cable USB" />
                    <option value="Cable USB y toner" />
                    <option value="Toner incluido" />
                    <option value="Ninguno" />
                  </>
                ) : esMonitor ? (
                  <>
                    <option value="Cable HDMI" />
                    <option value="Cable HDMI y VGA" />
                    <option value="Base y cables" />
                    <option value="Ninguno" />
                  </>
                ) : (
                  <>
                    <option value="Cargador" />
                    <option value="Cargador y mouse" />
                    <option value="Cargador, mouse y maletín" />
                    <option value="Cargador y auriculares" />
                    <option value="Ninguno" />
                  </>
                )}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Garantía</label>
              <input
                list="lista-garantia"
                name="garantia"
                value={formulario.garantia}
                onChange={manejarCambio}
                placeholder="Escribe o elige..."
                className={inputClass}
              />
              <datalist id="lista-garantia">
                <option value="3 meses" />
                <option value="6 meses" />
                <option value="1 año" />
                <option value="2 años" />
                <option value="3 años" />
                <option value="Sin garantía" />
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Observaciones</label>
            <textarea
              name="observaciones"
              value={formulario.observaciones}
              onChange={manejarCambio}
              rows={3}
              placeholder="Notas adicionales..."
              className={inputClass}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-[var(--color-border)]">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-sub)] text-sm font-medium text-center hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-main)] transition-all duration-200 cursor-pointer"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={guardando}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {guardando ? 'Guardando...' : 'Guardar equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevoEquipo;