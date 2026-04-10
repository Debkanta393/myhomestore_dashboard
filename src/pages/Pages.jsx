import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import api from "../api/axios";

const ENDPOINTS = {
  list: ["/api/page", "/api/page/pages", "/api/page/allPages"],
  deleteById: (id) => [`/api/page/${id}`, `/api/page/delete/${id}`],
  deleteBySlug: (slug) => [`/api/page/slug/${slug}`, `/api/page/page/${slug}`],
};

const getValue = (obj, path, fallback = undefined) => {
  try {
    return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? fallback;
  } catch {
    return fallback;
  }
};

const normalizePages = (payload) => {
  const list =
    payload?.pages ||
    getValue(payload, "data.pages") ||
    payload?.data ||
    payload;

  if (!Array.isArray(list)) return [];

  return list.map((item, index) => {
    const slug = item.slug || item.pageSlug || item.path || `page-${index + 1}`;
    const title = item.title || item.name || slug;
    const status = (item.status || (item.published ? "published" : "draft") || "draft")
      .toString()
      .toLowerCase();
    const updatedAt = item.updatedAt || item.updated_at || item.createdAt || null;

    return {
      id: item._id || item.id || slug,
      slug,
      title,
      status,
      updatedAt,
    };
  });
};

export default function Pages() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState([]);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let response = null;
      let lastError = null;
      for (const url of ENDPOINTS.list) {
        try {
          response = await api.get(url);
          break;
        } catch (err) {
          lastError = err;
        }
      }

      if (!response) throw lastError || new Error("Failed to fetch pages.");

      setPages(normalizePages(response.data));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Could not load pages. Check backend page API.",
      );
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const visiblePages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q),
    );
  }, [pages, query]);

  const handleDelete = async (page) => {
    const ok = window.confirm(
      `Delete page "${page.title}" (${page.slug})?\nThis action cannot be undone.`,
    );
    if (!ok) return;

    try {
      const idEndpoints = page.id ? ENDPOINTS.deleteById(page.id) : [];
      const slugEndpoints = ENDPOINTS.deleteBySlug(page.slug);
      const all = [...idEndpoints, ...slugEndpoints];

      let deleted = false;
      for (const url of all) {
        try {
          await api.delete(url);
          deleted = true;
          break;
        } catch {
          // try next endpoint
        }
      }
      if (!deleted) throw new Error("Delete endpoint not available.");

      setPages((prev) => prev.filter((p) => p.slug !== page.slug));
    } catch (err) {
      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete page.",
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pages</h1>
          <p className="text-sm text-gray-400 mt-1">
            WordPress-style page management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPages}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/create-pages")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
          >
            <Plus size={15} />
            Add New Page
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages by title or slug..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p className="col-span-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Page
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Status
          </p>
          <p className="col-span-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Updated
          </p>
          <p className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400 text-right pr-2">
            Actions
          </p>
        </div>

        {loading ? (
          <div className="py-14 text-center text-sm text-gray-500">Loading pages...</div>
        ) : error ? (
          <div className="py-14 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <p className="text-xs text-gray-500 mt-1">
              Required backend: list/delete page endpoints.
            </p>
          </div>
        ) : visiblePages.length === 0 ? (
          <div className="py-14 text-center text-sm text-gray-500">
            No pages found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {visiblePages.map((page) => (
              <div
                key={page.slug}
                className="grid grid-cols-12 gap-3 px-5 py-3.5 hover:bg-gray-50 transition"
              >
                <div className="col-span-5">
                  <p className="text-sm font-semibold text-gray-900">{page.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">/{page.slug}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      page.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {page.status}
                  </span>
                </div>
                <div className="col-span-3 flex items-center text-sm text-gray-600">
                  {page.updatedAt
                    ? new Date(page.updatedAt).toLocaleString()
                    : "—"}
                </div>
                <div className="col-span-2 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => navigate(`/admin/pages/${page.slug}`)}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-600"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => window.open(`/page/${page.slug}`, "_blank")}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 text-gray-600"
                    title="Preview"
                  >
                    <ExternalLink size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(page)}
                    className="p-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 p-4 bg-white">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <FileText size={16} />
          Core CMS working: list pages, create new, load existing, update, delete.
        </div>
      </div>
    </div>
  );
}