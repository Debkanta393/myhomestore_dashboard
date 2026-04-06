export default function CardSection({ cards = [] }) {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {cards.map((card, i) => (
        <div key={i} className="border rounded p-4 shadow">
          <img src={card.image} className="mb-4" />
          <h3 className="text-xl font-semibold">{card.title}</h3>
          <p className="text-gray-600">{card.description}</p>
        </div>
      ))}
    </div>
  );
}