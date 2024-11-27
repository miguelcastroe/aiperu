import { InsightCard } from "@/lib/types";
import { useEffect, useState } from "react";

interface CardProps {
  card: InsightCard;
  index: number;
}

const Card = ({ card, index }: CardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCategoryVisible, setIsCategoryVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Delay the category animation slightly after the card appears
          setTimeout(() => {
            setIsCategoryVisible(true);
          }, 200);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentElement = document.getElementById(`card-${index}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [index]);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "propuesta":
        return "bg-green-100 text-green-800";
      case "observación":
        return "bg-yellow-100 text-yellow-800";
      case "observación":
        return "bg-red-100 text-red-800";
      case "reflexión":
        return "bg-orange-100 text-orange-800";
      case "nuestra sugerencia":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div
      id={`card-${index}`}
      className={`bg-white rounded-lg shadow-md p-6 mb-4 transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h2 
          className={`text-xl font-bold text-primary transition-opacity duration-500 ease-in-out ${
            isCategoryVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {card.Category}
        </h2>
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