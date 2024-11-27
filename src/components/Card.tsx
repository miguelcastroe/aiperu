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
        return '#ec5030'; // bright orange-red
      case "reflexión":
        return '#a4d4dd'; // light blue
      case "sugerencia":
        return '#50787e'; // teal
      default:
        return '#1b1d1a';
    }
  };

  const getCategoryStyle = (category: string) => {
    return {
      backgroundColor: '#1b1d1a',
      color: '#ececec',
      padding: '4px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: '"Roboto Mono", monospace',
      fontWeight: 400,
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
          bgcolor: '#ececec',
          color: '#1b1d1a',
          boxShadow: 'none',
          borderRadius: 0,
          borderBottom: '1px solid rgba(27, 29, 26, 0.1)'
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
                color: '#ececec',
                fontWeight: 400,
                fontSize: '12px',
                height: '24px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                fontFamily: '"Roboto Mono", monospace',
                letterSpacing: '0.05em'
              }}
            />
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              m: 0,
              color: '#1b1d1a',
              lineHeight: 1.7,
              letterSpacing: '0.05em',
              fontSize: '12px',
              fontWeight: 400,
              fontFamily: '"Roboto Mono", monospace',
              textTransform: 'uppercase'
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