import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import DynamicPage from "./DynamicPage";

const EMPTY_DATA = { content: [], root: { props: {} } };

export default function PageBySlug() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(EMPTY_DATA);
  const [meta, setMeta] = useState({ title: "", customCss: "" });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/page/page/${slug}`);
        const payload = res?.data?.data || res?.data?.page || res?.data || {};
        const rawContent = payload?.content ?? res?.data?.content ?? EMPTY_DATA;
        const parsedContent =
          typeof rawContent === "string" ? JSON.parse(rawContent) : rawContent;
        const embeddedMeta = parsedContent?.root?.props?.__cmsMeta || {};
        const title = payload?.title || embeddedMeta?.title || slug;
        const customCss = payload?.customCss || embeddedMeta?.customCss || "";

        if (!mounted) return;
        setData(parsedContent || EMPTY_DATA);
        setMeta({ title, customCss });
        if (title) document.title = title;
      } catch (err) {
        if (!mounted) return;
        setError(
          err?.response?.status === 404
            ? "Page not found"
            : err?.response?.data?.message || "Failed to load page",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading page...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <>
      {meta.customCss?.trim() && <style>{meta.customCss}</style>}
      <DynamicPage data={data} />
    </>
  );
}

