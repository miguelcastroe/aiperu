import { useEffect, useState, useRef, useCallback } from "react";
import { InsightCard } from "@/lib/types";
import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [visibleCards, setVisibleCards] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const loadNextCard = useCallback(() => {
    if (currentIndex < cards.length) {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, cards[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 300);
    }
  }, [currentIndex, cards]);

  useEffect(() => {
    if (loading) return;

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadNextCard();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, loadNextCard]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary text-center mb-8">
          IA para el Gobierno Peruano
        </h1>
        <div className="space-y-4">
          {visibleCards.map((card, index) => (
            <Card key={index} card={card} index={index} />
          ))}
        </div>
        <div ref={loadingRef} className="mt-4">
          {currentIndex < cards.length && (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;