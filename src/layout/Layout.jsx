import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  PanelsTopLeft
} from "lucide-react";

// ─── Nav Config ─────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Products", icon: Package, to: "/products" },
  { label: "Orders", icon: ShoppingCart, to: "/orders" },
  { label: "Customers", icon: Users, to: "/customers" },
  { label: "Create Pages", icon: PanelsTopLeft, to: "/create-pages" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

// ─── SVG Logo ────────────────────────────────────────────────────────────────
const Logo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    aria-label="AdminPanel logo"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="32" height="32" rx="9" fill="#4f46e5" />
    <rect x="7" y="7" width="8" height="8" rx="2.5" fill="white" />
    <rect
      x="17"
      y="7"
      width="8"
      height="8"
      rx="2.5"
      fill="white"
      fillOpacity="0.5"
    />
    <rect
      x="7"
      y="17"
      width="8"
      height="8"
      rx="2.5"
      fill="white"
      fillOpacity="0.5"
    />
    <rect x="17" y="17" width="8" height="8" rx="2.5" fill="white" />
  </svg>
);

// ─── Single Nav Item ─────────────────────────────────────────────────────────
const NavItem = ({ item, isCollapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === item.to;
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`
        group relative flex flex-col gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
        transition-all duration-200 outline-none select-none
        focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
        focus-visible:ring-offset-[#0f0f1a]
        ${
          isActive
            ? "text-white"
            : "text-white/50 hover:text-white hover:bg-white/[0.06]"
        }
      `}
    >
      <div className="flex items-center gap-3">
        {/* Animated active background pill */}
        {isActive && (
          <motion.span
            layoutId="activeNav"
            className="absolute inset-0 rounded-xl bg-indigo-500/20 border border-indigo-500/30"
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
        )}

        <Icon
          size={18}
          className={`relative z-10 flex-shrink-0 transition-colors duration-200
          ${isActive ? "text-indigo-400" : "text-white/40 group-hover:text-white/80"}`}
        />

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative z-10 overflow-hidden whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {isActive &&
          !isCollapsed &&
          (
            <ChevronRight
              size={14}
              className="relative z-10 ml-auto text-indigo-400/70 flex-shrink-0"
            />
          )}

        {/* Tooltip — only when sidebar is collapsed */}
        {isCollapsed && (
          <span
            className=" 
          pointer-events-none absolute left-full ml-3 z-50
          px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium
          opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100
          translate-x-1 group-hover:translate-x-0
          transition-all duration-150 whitespace-nowrap
          shadow-xl border border-white/10
        "
          >
            {item.label}
          </span>
        )}
      </div>
      {/* {item.label == "Pages" && isActive && (
        <div 
        className="w-full bg-[#0f0f1a]/50 p-3 rounded-xl flex flex-col gap-2 list-none">
            <motion.li initial={{x: -20, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{duration: 0.3, ease: "easeInOut"}}><Link>Home</Link></motion.li>
            <motion.li initial={{x: -20, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: 0.2, duration: 0.3, ease: "easeInOut"}}><Link>About</Link></motion.li>
            <motion.li initial={{x: -20, opacity: 0}} animate={{x: 0, opacity: 1}} transition={{delay: 0.4, duration: 0.3, ease: "easeInOut"}}><Link>Product</Link></motion.li>
        </div>
      )} */}
    </Link>
  );
};

// ─── Sidebar Content ─────────────────────────────────────────────────────────
const SidebarContent = ({ isCollapsed, setIsCollapsed, onNavClick }) => (
  <div className="flex flex-col h-full">
    {/* Brand Header */}
    <div
      className={`flex items-center gap-3 px-4 py-5 border-b border-white/[0.07]
      ${isCollapsed ? "justify-center" : ""}`}
    >
      <Logo />

      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden flex-1 min-w-0"
          >
            <p className="text-white font-semibold text-sm leading-none tracking-tight">
              AdminPanel
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setIsCollapsed((p) => !p)}
        className="hidden lg:flex p-1.5 rounded-lg text-white/30 hover:text-white
                   hover:bg-white/[0.08] transition-all duration-200 ml-auto flex-shrink-0"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 0 : 180 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronRight size={15} />
        </motion.div>
      </button>
    </div>

    {/* Nav Links */}
    <nav
      className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto"
      aria-label="Main navigation"
    >
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-semibold uppercase tracking-widest
                       text-white/25 px-3 mb-2"
          >
            Menu
          </motion.p>
        )}
      </AnimatePresence>

      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.to}
          item={item}
          isCollapsed={isCollapsed}
          onClick={onNavClick}
        />
      ))}
    </nav>

    {/* User Profile Footer */}
    <div className="px-3 py-4 border-t border-white/[0.07]">
      <div
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5
        hover:bg-white/[0.06] transition-all duration-200 cursor-pointer group
        ${isCollapsed ? "justify-center" : ""}`}
      >
        <div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400
                        to-purple-500 flex-shrink-0 flex items-center justify-center
                        text-white text-xs font-bold shadow-lg"
        >
          D
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden min-w-0 flex-1"
            >
              <p className="text-white text-sm font-medium leading-none truncate">
                Debkanta Dey
              </p>
              <p className="text-white/40 text-xs mt-0.5 truncate">
                debkanta@email.com
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LogOut
                size={15}
                className="text-white/25 group-hover:text-red-400
                           transition-colors duration-200 flex-shrink-0"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

// ─── Sidebar (desktop + mobile drawer) ───────────────────────────────────────
function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30
                   bg-[#0f0f1a] border-r border-white/[0.07] overflow-visible
                   shadow-[4px_0_24px_rgba(0,0,0,0.3)]"
      >
        <SidebarContent
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onNavClick={() => {}}
        />
      </motion.aside>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl
                   bg-[#0f0f1a] border border-white/10 text-white
                   shadow-lg hover:bg-white/[0.08] transition-all duration-200"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
            />

            <motion.aside
              className="lg:hidden fixed left-0 top-0 h-screen w-64 z-50
                         bg-[#0f0f1a] border-r border-white/[0.07]
                         shadow-[4px_0_32px_rgba(0,0,0,0.5)]"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/40
                           hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>

              <SidebarContent
                isCollapsed={false}
                setIsCollapsed={() => {}}
                onNavClick={() => setIsMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar() {
  const location = useLocation();
  const currentPage =
    NAV_ITEMS.find((item) => item.to === location.pathname)?.label ??
    "Dashboard";

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between
                 bg-white/80 backdrop-blur-md border-b border-gray-200/80
                 px-6 py-3.5 shadow-sm"
    >
      {/* Left — Page title */}
      <div className="flex items-center gap-4">
        <div className="w-8 lg:hidden" /> {/* spacer for mobile hamburger */}
        <div>
          <h1 className="text-base font-semibold text-gray-900 leading-none">
            {currentPage}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
            Welcome back, Debkanta 👋
          </p>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Search button */}
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl
                     border border-gray-200 text-sm text-gray-400
                     hover:text-gray-700 hover:border-gray-300 bg-gray-50
                     hover:bg-white transition-all duration-200"
          aria-label="Search"
        >
          <Search size={15} />
          <span className="text-xs">Search…</span>
          <kbd
            className="ml-2 text-[10px] bg-gray-200 text-gray-500
                          px-1.5 py-0.5 rounded font-mono"
          >
            ⌘K
          </kbd>
        </button>

        {/* Notification bell */}
        <button
          className="relative p-2.5 rounded-xl text-gray-500 hover:text-gray-800
                     hover:bg-gray-100 transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                           bg-indigo-500 ring-2 ring-white"
          />
        </button>

        {/* User avatar */}
        <div
          className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400
                        to-purple-500 flex items-center justify-center text-white
                        text-sm font-bold cursor-pointer ring-2 ring-transparent
                        hover:ring-indigo-300 transition-all duration-200 shadow-md"
        >
          D
        </div>
      </div>
    </header>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function Layout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-[#F7F8FA] min-h-screen">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Offset content by sidebar width */}
      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        animate={{ marginLeft: isCollapsed ? 72 : 240 }}
        initial={{ marginLeft: 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Topbar />

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}

export default Layout;
