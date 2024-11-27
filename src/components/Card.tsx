import { InsightCard } from "@/lib/types";

interface CardProps {
  card: InsightCard;
  index: number;
}

const Card = ({ card, index }: CardProps) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "propuesta":
        return "bg-green-100 text-green-800";
      case "observación":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 mb-4 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-primary">{card.Category}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
            card.Type
          )}`}
        >
          {card.Type}
        </span>
      </div>
      <p className="text-gray-700 leading-relaxed">{card.Description}</p>
    </div>
  );
};

export default Card;