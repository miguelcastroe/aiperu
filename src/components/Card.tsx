import { InsightCard } from "@/lib/types";
import { useEffect, useState } from "react";
import { Tag, Tile } from '@carbon/react';

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
        return "green";
      case "observación":
        return "magenta";
      case "reflexión":
        return "blue";
      case "nuestra sugerencia":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <div
      id={`card-${index}`}
      className="cds--tile-container"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : '20px'})`,
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        marginBottom: '1rem'
      }}
    >
      <Tile className="cds--tile">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginBottom: '1rem',
          borderBottom: '1px solid var(--cds-border-subtle)',
          paddingBottom: '1rem'
        }}>
          <h4 style={{ 
            margin: 0,
            opacity: isCategoryVisible ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
            fontSize: 'var(--cds-heading-03)',
            color: 'var(--cds-text-primary)',
            fontWeight: 400
          }}>
            {card.Category}
          </h4>
          <Tag type={getTypeColor(card.Type)} size="sm">
            {card.Type}
          </Tag>
        </div>
        <p style={{ 
          margin: 0, 
          fontSize: 'var(--cds-body-long-01)',
          color: 'var(--cds-text-secondary)',
          lineHeight: 'var(--cds-body-long-01-line-height)',
          fontWeight: 300
        }}>
          {card.Description}
        </p>
      </Tile>
    </div>
  );
};

export default Card;