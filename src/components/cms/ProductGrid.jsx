export default function ProductGrid({
  title,
  products = [],
  columns = 4
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
  };

  return (
    <div className="py-10 px-6">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>

      <div className={`grid ${gridCols[columns]} gap-4`}>
        {products.map((p, i) => (
          <div key={i} className="border p-4 rounded shadow">
            <p>{p}</p>
          </div>
        ))}
      </div>
    </div>
  );
}