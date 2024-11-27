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

  const getTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "propuesta":
        return '#FF3B30'; // bright red for proposals
      case "reflexión":
        return '#5AC8FA'; // light blue for reflections
      case "sugerencia":
        return '#4A8B75'; // teal for suggestions
      default:
        return '#44332D';
    }
  };

  const getCategoryStyle = (category: string) => {
    return {
      backgroundColor: category.toLowerCase() === 'gobierno peruano' ? '#222222' : 
                      category.toLowerCase() === 'ciudadanía' ? '#222222' : 
                      '#222222',
      color: '#FFFFFF',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em'
    };
  };

  return (
    <Box
      id={`card-${index}`}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : '20px'})`,
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        mb: 3,
      }}
    >
      <MuiCard 
        sx={{ 
          bgcolor: 'background.paper', 
          color: '#17222B',
          boxShadow: 'none',
          borderRadius: 0,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Box
              component="span"
              sx={getCategoryStyle(card.Category)}
            >
              {card.Category}
            </Box>
            <Chip
              label={card.Type}
              size="small"
              sx={{ 
                bgcolor: getTypeColor(card.Type),
                color: '#FFFFFF',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: '24px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            />
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              m: 0,
              color: '#000000',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
              fontSize: '1rem',
              fontWeight: 400
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