export default function CTA({
  title,
  buttonText,
  buttonLink
}) {
  return (
    <div className="bg-black text-white text-center py-16">
      <h2 className="text-3xl mb-4">{title}</h2>

      <a
        href={buttonLink}
        className="bg-white text-black px-6 py-2 rounded"
      >
        {buttonText}
      </a>
    </div>
  );
}