import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  MessageSquare,
  WifiOff,
  Wifi,
  Menu,
  X,
  User,
  ChevronDown,
  Bell,
  LogOut,
  Settings,
  HelpCircle,
  Clock,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, badge: null },
  { to: "/interview", label: "Interview", Icon: ClipboardList, badge: null },
  { to: "/heatmap", label: "Heatmap", Icon: Map, badge: 3 },
  { to: "/policy", label: "Policy Guide", Icon: MessageSquare, badge: null },
  { to: "/offline", label: "Offline", Icon: WifiOff, badge: 5 },
];

// ─── Connection strength indicator ───
function ConnectionBars({ isOnline }) {
  const bars = isOnline ? 4 : 0;
  return (
    <div className="flex items-end gap-[1.5px] h-3">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-[3px] rounded-t-[1px] transition-all ${
            bar <= bars
              ? bar <= 2
                ? "bg-amber-300"
                : "bg-emerald-300"
              : "bg-white/20"
          }`}
          style={{ height: `${bar * 25}%` }}
        />
      ))}
    </div>
  );
}

// ─── Profile dropdown ───
function ProfileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-800">Juan Dela Cruz</p>
          <p className="text-xs text-slate-500">Field Officer · Metro Manila</p>
          <p className="text-xs text-slate-400 mt-1">ID: FO-2024-0147</p>
        </div>
        <div className="py-1">
          {[
            { icon: User, label: "Profile" },
            { icon: Settings, label: "Settings" },
            { icon: Bell, label: "Notifications", badge: 2 },
            { icon: HelpCircle, label: "Help & Support" },
          ].map(({ icon: Icon, label, badge }) => (
            <button
              key={label}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <Icon size={16} className="text-slate-400" />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="border-t border-slate-100 py-1">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Mobile sidebar overlay ───
function MobileSidebar({ isOpen, onClose, isOnline }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden shadow-xl animate-slide-in">
        <div className="bg-emerald-700 text-white px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold tracking-tight">Manigo</p>
            <p className="text-emerald-300 text-xs">Field Officer</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Juan Dela Cruz
              </p>
              <p className="text-xs text-slate-500">Metro Manila Region</p>
            </div>
          </div>
        </div>
        <div className="px-3 py-4 space-y-1">
          {navItems.map(({ to, label, Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {label}
                  </div>
                  {badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div
            className={`px-4 py-3 rounded-xl flex items-center gap-3 ${
              isOnline ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            {isOnline ? (
              <Wifi size={16} className="text-emerald-600" />
            ) : (
              <WifiOff size={16} className="text-red-600" />
            )}
            <div>
              <p
                className={`text-xs font-medium ${isOnline ? "text-emerald-800" : "text-red-800"}`}
              >
                {isOnline ? "Connected" : "Offline"}
              </p>
              <p className="text-[10px] text-slate-500">
                Data syncs when online
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN APP SHELL ───
export default function AppShell({ children, isOnline }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const location = useLocation();

  useEffect(() => {
    function tick() {
      setCurrentTime(
        new Date().toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    }
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const currentPage = navItems.find((item) =>
    item.to === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(item.to),
  );
  const pageTitle = currentPage?.label || "Manigo";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── Top Header ── */}
      <header className="bg-emerald-700 text-white sticky top-0 z-30 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Menu + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 hover:bg-white/10 rounded-lg transition"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold tracking-tight">M</span>
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight leading-none">
                  Manigo
                </h1>
                <p className="text-emerald-300 text-[10px] font-medium uppercase tracking-wider hidden sm:block">
                  Field Officer
                </p>
              </div>
            </div>
          </div>

          {/* Right: Status + Profile */}
          <div className="flex items-center gap-2">
            {currentTime && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-200 mr-2">
                <Clock size={12} /> {currentTime}
              </span>
            )}

            {/* Connection status - inline, no floating */}
            <div
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium transition-colors ${
                isOnline
                  ? "bg-emerald-500/80 text-white"
                  : "bg-red-500/90 text-white"
              }`}
            >
              <ConnectionBars isOnline={isOnline} />
              <span className="hidden sm:inline">
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>

            <button className="relative p-1.5 hover:bg-white/10 rounded-lg transition hidden sm:block">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 hover:bg-white/10 rounded-lg transition"
              >
                <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center border border-white/20">
                  <User size={14} />
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>
              <ProfileMenu
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
              />
            </div>
          </div>
        </div>

        {/* Page title bar (mobile) */}
        <div className="md:hidden px-4 pb-3">
          <p className="text-sm font-medium text-white/90">{pageTitle}</p>
        </div>
      </header>

      {/* ── Desktop Sidebar ── */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-200 pt-[73px] z-20">
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <User size={16} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">
                Juan Dela Cruz
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                FO-2024-0147
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
                    {label}
                  </div>
                  {badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        isActive
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-slate-100">
          <div
            className={`px-3 py-2 rounded-lg flex items-center gap-2.5 ${
              isOnline ? "bg-emerald-50" : "bg-red-50"
            }`}
          >
            {isOnline ? (
              <Wifi size={14} className="text-emerald-600 shrink-0" />
            ) : (
              <WifiOff size={14} className="text-red-600 shrink-0" />
            )}
            <div className="min-w-0">
              <p
                className={`text-[11px] font-medium ${isOnline ? "text-emerald-800" : "text-red-800"}`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {isOnline ? "All systems connected" : "Local data only"}
              </p>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar Overlay ── */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isOnline={isOnline}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 pb-20 md:pb-0 md:ml-56">{children}</main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30">
        <div className="flex">
          {navItems.map(({ to, label, Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 pt-2.5 text-[11px] font-medium transition-colors relative ${
                  isActive ? "text-emerald-700" : "text-slate-500"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-emerald-600 rounded-b-full" />
                  )}
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                    {badge && (
                      <span className="absolute -top-1.5 -right-3 bg-red-500 text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-1">
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="mt-0.5 leading-tight">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
