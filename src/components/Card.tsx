import { InsightCard } from "@/lib/types";
import { useEffect, useState } from "react";
import { Card as MuiCard, CardContent, Typography, Chip, Box } from '@mui/material';

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

  const getTypeColor = (type: string): "success" | "error" | "info" | "secondary" | "default" => {
    switch (type.toLowerCase()) {
      case "propuesta":
        return "success";
      case "observación":
        return "error";
      case "reflexión":
        return "info";
      case "nuestra sugerencia":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Box
      id={`card-${index}`}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : '20px'})`,
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        mb: 2
      }}
    >
      <MuiCard elevation={2}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: 2,
            pb: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                m: 0,
                opacity: isCategoryVisible ? 1 : 0,
                transition: 'opacity 0.5s ease-out',
                fontWeight: 400
              }}
            >
              {card.Category}
            </Typography>
            <Chip
              label={card.Type}
              color={getTypeColor(card.Type)}
              size="small"
              sx={{ ml: 2 }}
            />
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              m: 0,
              color: 'text.secondary',
              lineHeight: 1.6
            }}
          >
            {card.Description}
          </Typography>
        </CardContent>
      </MuiCard>
    </Box>
  );
};

export default Card;