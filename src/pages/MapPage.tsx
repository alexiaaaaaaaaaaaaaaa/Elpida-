import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, RefreshCw } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import {
  fetchNearbyPlaces,
  directionsUrl,
  CATEGORY_META,
  type NearbyPlace,
  type PlaceCategory,
} from '../utils/places';

type Coords = { lat: number; lon: number };
type LoadState = 'locating' | 'searching' | 'ready' | 'error';

const filters: Array<{ key: PlaceCategory | 'todos'; label: string }> = [
  { key: 'todos', label: 'Todos' },
  { key: 'delegacia-mulher', label: 'Delegacia da Mulher' },
  { key: 'delegacia', label: 'Delegacia' },
  { key: 'hospital', label: 'Hospital' },
  { key: 'bombeiros', label: 'Bombeiros' },
];

function buildIcon(emoji: string, color: string, size = 32) {
  return L.divIcon({
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${size * 0.5}px;box-shadow:0 2px 6px rgba(0,0,0,0.4);border:2px solid #fff;">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const userIcon = buildIcon('📍', '#2b4439', 36);

const MapPage: React.FC = () => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [state, setState] = useState<LoadState>('locating');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeFilter, setActiveFilter] = useState<PlaceCategory | 'todos'>('todos');

  const locate = () => {
    setState('locating');
    setErrorMsg('');

    if (!('geolocation' in navigator)) {
      setState('error');
      setErrorMsg('Seu navegador não tem suporte a geolocalização.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (err) => {
        setState('error');
        setErrorMsg(
          err.code === err.PERMISSION_DENIED
            ? 'Permissão de localização negada. Ative nas configurações do navegador/celular e tente novamente.'
            : 'Não conseguimos obter sua localização agora.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    locate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    setState('searching');
    fetchNearbyPlaces(coords.lat, coords.lon)
      .then((result) => {
        if (cancelled) return;
        setPlaces(result);
        setState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setState('error');
        setErrorMsg('Não conseguimos buscar os lugares próximos agora. Tente novamente em alguns instantes.');
      });
    return () => {
      cancelled = true;
    };
  }, [coords]);

  const visiblePlaces = useMemo(
    () => (activeFilter === 'todos' ? places : places.filter((p) => p.category === activeFilter)),
    [places, activeFilter]
  );

  return (
    <div className="elpida-app-screen">
      <AppHeader />
      <PageTitle>Perto de você</PageTitle>
      <div className="elpida-map-toolbar">
        <p>Delegacias da mulher, delegacias, hospitais e bombeiros mais próximos.</p>
        <button className="elpida-map-refresh" aria-label="Atualizar localização" onClick={locate}>
          <RefreshCw size={16} />
        </button>
      </div>

      {(state === 'locating' || state === 'searching') && (
        <div className="elpida-empty-state">
          <div className="elpida-empty-state__icon">
            <RefreshCw size={36} className="elpida-spin" />
          </div>
          <h2>{state === 'locating' ? 'Obtendo sua localização...' : 'Buscando lugares próximos...'}</h2>
          <p>Isso pode levar alguns segundos.</p>
        </div>
      )}

      {state === 'error' && (
        <div className="elpida-empty-state">
          <div className="elpida-empty-state__icon">
            <Navigation size={36} />
          </div>
          <h2>Não foi possível carregar o mapa</h2>
          <p>{errorMsg}</p>
          <button onClick={locate}>Tentar novamente</button>
        </div>
      )}

      {state === 'ready' && coords && (
        <>
          <div className="elpida-chip-row" style={{ marginTop: 14 }}>
            {filters.map((f) => (
              <button
                key={f.key}
                className={`elpida-chip ${activeFilter === f.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ height: 260, margin: '12px 20px', borderRadius: 16, overflow: 'hidden' }}>
            <MapContainer center={[coords.lat, coords.lon]} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coords.lat, coords.lon]} icon={userIcon}>
                <Popup>Você está aqui</Popup>
              </Marker>
              {visiblePlaces.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lon]}
                  icon={buildIcon(CATEGORY_META[place.category].emoji, CATEGORY_META[place.category].color)}
                >
                  <Popup>
                    <strong>{place.name}</strong>
                    <br />
                    {CATEGORY_META[place.category].label} · {place.distanceKm.toFixed(1)} km
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div style={{ padding: '0 20px 12px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#333' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: meta.color, display: 'inline-block' }} />
                {meta.label}
              </span>
            ))}
          </div>

          <div style={{ padding: '4px 0 24px' }}>
            {visiblePlaces.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: 13, color: '#666', padding: '20px 0' }}>
                Nenhum lugar encontrado nesse raio para o filtro selecionado.
              </p>
            )}
            {visiblePlaces.map((place) => (
              <div key={place.id} className="elpida-list-item" style={{ cursor: 'default' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: CATEGORY_META[place.category].color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {CATEGORY_META[place.category].emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="elpida-list-item__name">{place.name}</p>
                  <p className="elpida-list-item__preview">
                    {CATEGORY_META[place.category].label} · {place.distanceKm.toFixed(1)} km
                    {place.address ? ` · ${place.address}` : ''}
                  </p>
                </div>
                <a
                  href={directionsUrl(coords.lat, coords.lon, place.lat, place.lon)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                    background: 'var(--elpida-purple)',
                    borderRadius: 20,
                    padding: '8px 12px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Como chegar
                </a>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default MapPage;
