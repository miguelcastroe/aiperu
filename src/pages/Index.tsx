import { useEffect, useState, useRef, useCallback } from "react";
import { InsightCard } from "@/lib/types";
import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { Container, Typography, Box, Link } from '@mui/material';

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
    <Box sx={{ bgcolor: '#FBF8F0', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography 
          variant="h1" 
          sx={{ 
            textAlign: 'left', 
            mb: 4,
            fontWeight: 400,
            color: '#BB2233',
            fontSize: '2.5rem'
          }}
        >
          IA para el Gobierno Peruano
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'left',
            mb: 2,
            color: '#17222B',
            lineHeight: 1.7,
            letterSpacing: '0.01em'
          }}
        >
          Este website se basa en el reporte de la Presidencia del Consejo de Ministros sobre la Inteligencia Artificial en Perú, publicado el 21 de noviembre de 2024. A partir de esta base, lo analizamos de manera reflexiva y objetiva, integrando observaciones ciudadanas y esbozos de soluciones innovadoras.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'left',
            mb: 2,
            color: '#17222B',
            lineHeight: 1.7,
            letterSpacing: '0.01em'
          }}
        >
          Buscamos inspirar un futuro donde la IA promueva el bienestar social y económico de forma ética, inclusiva y sostenible, invitando a todos a asumir responsabilidades para lograrlo.
        </Typography>
        <Link
          href="https://www.gob.pe/iaperu"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            textAlign: 'left',
            mb: 6,
            color: '#86373E',
            textDecoration: 'underline',
            '&:hover': {
              color: '#44332D'
            }
          }}
        >
          Enlace al reporte de Presidencia de Consejo de Ministros
        </Link>
        <Box>
          {renderCards()}
        </Box>
        <Box ref={loadingRef} sx={{ mt: 4 }}>
          {currentIndex < cards.length && (
            <LoadingSpinner />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Index;