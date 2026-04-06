export default function ImageText({
  image,
  title,
  description,
  reverse
}) {
  return (
    <div className={`flex ${reverse ? "flex-row-reverse" : ""} items-center gap-6 p-6`}>
      <img src={image} className="w-1/2 rounded" />

      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-3">{description}</p>
      </div>
    </div>
  );
}