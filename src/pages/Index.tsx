import { useEffect, useState, useRef, useCallback } from "react";
import { InsightCard } from "@/lib/types";
import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { Container, Typography, Box } from '@mui/material';

const Index = () => {
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [visibleCards, setVisibleCards] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const loadNextCard = useCallback(() => {
    if (currentIndex < cards.length) {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, cards[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 1200);
    }
  }, [currentIndex, cards]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/bites_supa.json");
        const data = await response.json();
        setCards(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Por favor, intente nuevamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [toast]);

  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    observer.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading) {
        loadNextCard();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, loadNextCard]);

  const renderCards = () => {
    let currentTitle = '';
    return visibleCards.map((card, index) => (
      <div key={index}>
        {card.Title && card.Title !== currentTitle && (() => {
          currentTitle = card.Title;
          return (
            <Typography
              variant="h5"
              sx={{
                mt: 8,
                mb: 4,
                fontWeight: 500,
                color: '#BB2233',
                textAlign: 'left',
                fontSize: '1.25rem'
              }}
            >
              {card.Title}
            </Typography>
          );
        })()}
        <Card card={card} index={index} />
      </div>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#FBF8F0'
      }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#FBF8F0' }}>
      <Typography 
        variant="h1" 
        sx={{ 
          textAlign: 'center', 
          mb: 6,
          fontWeight: 300,
          color: '#86373E',
          fontSize: '2.5rem'
        }}
      >
        IA para el Gobierno Peruano
      </Typography>
      <Box>
        {renderCards()}
      </Box>
      <Box ref={loadingRef} sx={{ mt: 4 }}>
        {currentIndex < cards.length && (
          <LoadingSpinner />
        )}
      </Box>
    </Container>
  );
};

export default Index;