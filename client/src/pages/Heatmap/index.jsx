import { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  List,
  MapPin,
  AlertTriangle,
  Users,
  DollarSign,
  ChevronRight,
  X,
  Navigation,
  Layers,
  SlidersHorizontal,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { heatmapPoints } from "../../data/mockData";

const riskConfig = {
  high: {
    color: "#ef4444",
    fill: "#ef4444",
    label: "High Risk",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
  medium: {
    color: "#f59e0b",
    fill: "#f59e0b",
    label: "Medium Risk",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  low: {
    color: "#22c55e",
    fill: "#22c55e",
    label: "Low Risk",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
};

// ─── Fly to location when clicking list item ───
function FlyTo({ point }) {
  const map = useMap();
  if (point) map.flyTo([point.lat, point.lng], 15, { duration: 0.8 });
  return null;
}

// ─── Summary bar ───
function SummaryBar({ points }) {
  const highCount = points.filter((p) => p.risk === "high").length;
  const totalOverdue = points.reduce((sum, p) => sum + p.overdue, 0);
  const totalClients = points.reduce((sum, p) => sum + p.clients, 0);

  return (
    <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-white border-b border-slate-100">
      <div className="text-center">
        <p className="text-xs text-slate-500">Total Clients</p>
        <p className="text-lg font-bold text-slate-800">{totalClients}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-500">Total Overdue</p>
        <p className="text-lg font-bold text-red-600">{totalOverdue}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-500">High Risk Zones</p>
        <p className="text-lg font-bold text-red-600">{highCount}</p>
      </div>
    </div>
  );
}

// ─── List panel ───
function ListPanel({ points, onSelect, onClose, filter, setFilter }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = points;
    if (filter !== "all") result = result.filter((p) => p.risk === filter);
    if (search)
      result = result.filter((p) =>
        p.barangay.toLowerCase().includes(search.toLowerCase()),
      );
    return result;
  }, [points, filter, search]);

  return (
    <div className="absolute inset-0 z-[1000] bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">Zone List</h2>
          <p className="text-xs text-slate-500">
            {filtered.length} of {points.length} zones
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 rounded-lg"
        >
          <X size={20} className="text-slate-500" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 border-b border-slate-100">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search barangay..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 px-4 py-2.5 border-b border-slate-100 overflow-x-auto">
        {["all", "high", "medium", "low"].map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize whitespace-nowrap transition ${
              filter === r
                ? r === "all"
                  ? "bg-slate-800 text-white"
                  : r === "high"
                    ? "bg-red-500 text-white"
                    : r === "medium"
                      ? "bg-amber-500 text-white"
                      : "bg-green-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {r === "all" ? "All" : riskConfig[r].label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((point) => {
          const cfg = riskConfig[point.risk];
          return (
            <button
              key={point.barangay}
              onClick={() => onSelect(point)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition text-left"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${cfg.bg}`}
              >
                <MapPin size={18} className={cfg.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {point.barangay}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {point.clients}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <AlertTriangle size={12} /> {point.overdue}
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Search size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No barangays found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail drawer ───
function DetailDrawer({ point, onClose }) {
  if (!point) return null;
  const cfg = riskConfig[point.risk];
  const overdueRate = Math.round((point.overdue / point.clients) * 100) || 0;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-2xl shadow-lg border-t border-slate-200 max-h-[60%] overflow-y-auto">
      {/* Handle */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 bg-slate-300 rounded-full" />
      </div>

      <div className="px-4 pb-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {point.barangay}
            </h3>
            <p className="text-xs text-slate-500">
              {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}
            >
              {cfg.label}
            </span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg"
            >
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`p-3 rounded-xl ${cfg.bg} ${cfg.border} border`}>
            <p className="text-xs text-slate-500">Clients</p>
            <p className="text-xl font-bold text-slate-800">{point.clients}</p>
          </div>
          <div className="p-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-xs text-slate-500">Overdue</p>
            <p className="text-xl font-bold text-red-600">{point.overdue}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs text-slate-500">Rate</p>
            <p className="text-xl font-bold text-amber-600">{overdueRate}%</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
            <Navigation size={15} /> Navigate
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
            <Users size={15} /> View Clients
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN HEATMAP ───
export default function Heatmap() {
  const [selected, setSelected] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showList, setShowList] = useState(false);

  const visible =
    filter === "all"
      ? heatmapPoints
      : heatmapPoints.filter((p) => p.risk === filter);

  const handleSelect = (point) => {
    setSelected(point);
    setFlyTo(point);
    setShowList(false);
  };

  const handleListSelect = (point) => {
    setSelected(point);
    setFlyTo(point);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] relative">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-bold text-slate-800">
            Arrears Heatmap
          </h1>
          <p className="text-xs text-slate-500">{visible.length} zones shown</p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowList(true)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg font-medium text-slate-700 hover:bg-slate-200 transition"
          >
            <List size={14} /> List
          </button>
          <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 rounded-lg font-medium text-slate-700 hover:bg-slate-200 transition">
            <Layers size={14} /> Overlay
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <SummaryBar points={visible} />

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[14.5895, 121.0]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ZoomControl position="bottomright" />
          {flyTo && <FlyTo point={flyTo} />}

          {visible.map((point) => {
            const isSelected = selected?.barangay === point.barangay;
            const cfg = riskConfig[point.risk];

            return (
              <CircleMarker
                key={point.barangay}
                center={[point.lat, point.lng]}
                radius={
                  isSelected
                    ? 18 + point.overdue * 0.6
                    : 12 + point.overdue * 0.6
                }
                pathOptions={{
                  color: cfg.color,
                  fillColor: cfg.fill,
                  fillOpacity: isSelected ? 0.9 : 0.6,
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{ click: () => handleSelect(point) }}
              >
                <Popup>
                  <div className="text-sm space-y-1.5 min-w-[150px]">
                    <p className="font-bold text-slate-800">{point.barangay}</p>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Users size={13} />
                      <span>
                        <strong>{point.clients}</strong> clients
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <AlertTriangle size={13} className="text-red-500" />
                      <span>
                        <strong className="text-red-600">
                          {point.overdue}
                        </strong>{" "}
                        overdue
                      </span>
                    </div>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.text}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Floating filter chips on map */}
        <div className="absolute top-3 left-3 z-[500] flex gap-1.5">
          {["high", "medium", "low"].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(filter === r ? "all" : r)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize shadow-md transition ${
                filter === r
                  ? r === "high"
                    ? "bg-red-500 text-white"
                    : r === "medium"
                      ? "bg-amber-500 text-white"
                      : "bg-green-500 text-white"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {riskConfig[r].label}
            </button>
          ))}
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="text-xs px-2 py-1.5 bg-white rounded-full shadow-md text-slate-500 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Detail drawer */}
        {selected && (
          <DetailDrawer point={selected} onClose={() => setSelected(null)} />
        )}

        {/* List panel overlay */}
        {showList && (
          <ListPanel
            points={heatmapPoints}
            onSelect={handleListSelect}
            onClose={() => setShowList(false)}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-slate-100 px-4 py-2 flex gap-4 text-xs text-slate-600 overflow-x-auto">
        {Object.entries(riskConfig).map(([key, cfg]) => (
          <span
            key={key}
            className="flex items-center gap-1.5 whitespace-nowrap"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: cfg.color }}
            />
            {cfg.label}
          </span>
        ))}
        <span className="ml-auto text-slate-400 whitespace-nowrap">
          <span className="inline-block w-3 h-3 rounded-full bg-slate-300 mr-1 align-middle" />
          size = overdue count
        </span>
      </div>
    </div>
  );
}
