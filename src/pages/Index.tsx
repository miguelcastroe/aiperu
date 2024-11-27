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
                color: '#1b1d1a',
                textAlign: 'left',
                fontSize: '12px',
                fontFamily: '"Roboto Mono", monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
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
        bgcolor: '#ececec'
      }}>
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ececec', minHeight: '100vh', pt: 4, position: 'relative', pb: 20 }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          mb: 4
        }}>
          <img 
            src="/lovable-uploads/2eba5b3a-3cae-45eb-9c40-ef7fa9ce0ed1.png" 
            alt="Logo" 
            style={{ 
              height: '24px',
              width: 'auto',
              marginRight: '12px'
            }}
          />
          <Typography 
            variant="h1" 
            sx={{ 
              textAlign: 'left',
              fontWeight: 700,
              color: '#1b1d1a',
              fontSize: '12px',
              fontFamily: '"Roboto Mono", monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            IA para el Gobierno Peruano
          </Typography>
        </Box>
        
        <Typography
          variant="body1"
          sx={{
            textAlign: 'left',
            mb: 2,
            color: '#1b1d1a',
            lineHeight: 1.7,
            letterSpacing: '0.05em',
            fontSize: '12px',
            fontFamily: '"Roboto Mono", monospace',
            textTransform: 'uppercase'
          }}
        >
          Este sitio analiza reflexivamente el reporte de la Presidencia del Consejo de Ministros (PCM) sobre IA en Perú (21/11/2024), integrando observaciones ciudadanas y posibles soluciones, dentro de las limitaciones de las fuentes originales.
        </Typography>
        <Link
          href="https://www.gob.pe/iaperu"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'block',
            textAlign: 'left',
            mb: 6,
            color: '#1b1d1a',
            textDecoration: 'underline',
            fontFamily: '"Roboto Mono", monospace',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            '&:hover': {
              color: '#44332D'
            }
          }}
        >
          Enlace al reporte de PCM
        </Link>
        <Box sx={{ bgcolor: '#ececec', p: 0 }}>
          {renderCards()}
        </Box>
        <Box ref={loadingRef} sx={{ mt: 4 }}>
          {currentIndex < cards.length && (
            <LoadingSpinner />
          )}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          bgcolor: '#ececec',
          py: 4,
          borderTop: '1px solid #1b1d1a20',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#1b1d1a',
              fontSize: '10px',
              fontFamily: '"Roboto Mono", monospace',
              letterSpacing: '0.05em',
              lineHeight: 1.6,
              textTransform: 'uppercase'
            }}
          >
            Creamos proyectos con propósito, guiados por empatía, análisis y colaboración. Directores creativos enfocados en el impacto social. | Escríbenos: +51 936646947
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;