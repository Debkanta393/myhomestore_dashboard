export default function Hero({ title, subtitle }) {
  return (
    <div className="bg-blue-500 text-white text-center py-20">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-4 text-lg">{subtitle}</p>
    </div>
  );
}