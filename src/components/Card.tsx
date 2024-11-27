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
        mb: 3,
        '&:hover': {
          '& .MuiCard-root': {
            transform: 'translateY(-4px)',
          }
        }
      }}
    >
      <MuiCard>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            mb: 2.5,
            pb: 2.5,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}>
            <Chip
              label={card.Type}
              color={getTypeColor(card.Type)}
              size="small"
              sx={{ 
                fontWeight: 500,
                letterSpacing: '0.02em'
              }}
            />
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              m: 0,
              color: 'text.secondary',
              lineHeight: 1.7,
              letterSpacing: '0.01em'
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