export default function Banner({ image, link }) {
  return (
    <div className="py-6">
      <a href={link}>
        <img
          src={image}
          alt="banner"
          className="w-full h-64 object-cover rounded-lg"
        />
      </a>
    </div>
  );
}