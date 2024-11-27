import { useEffect, useState, useRef, useCallback } from "react";
import { InsightCard } from "@/lib/types";
import Card from "@/components/Card";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [visibleCards, setVisibleCards] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("/bites_supa.json");
        const data = await response.json();
        
        // Group cards by category
        const categories = Array.from(new Set(data.map((card: InsightCard) => card.Category)));
        const firstCategoryCards = data.filter((card: InsightCard) => card.Category === categories[0]);
        
        setCards(data);
        // Show only the first card of the first category
        setVisibleCards([firstCategoryCards[0]]);
        setCurrentCategoryIndex(0);
        setCurrentCardIndex(1);
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

  const loadMoreCards = useCallback(() => {
    const categories = Array.from(new Set(cards.map(card => card.Category)));
    const currentCategory = categories[currentCategoryIndex];
    const categoryCards = cards.filter(card => card.Category === currentCategory);

    if (currentCardIndex < categoryCards.length) {
      // Add only one card at a time
      setVisibleCards(prev => [...prev, categoryCards[currentCardIndex]]);
      setCurrentCardIndex(prev => prev + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      // Move to next category
      const nextCategory = categories[currentCategoryIndex + 1];
      const nextCategoryCards = cards.filter(card => card.Category === nextCategory);
      setVisibleCards(prev => [...prev, nextCategoryCards[0]]);
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentCardIndex(1);
    }
  }, [currentCategoryIndex, currentCardIndex, cards]);

  useEffect(() => {
    if (loading) return;

    observer.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreCards();
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
  }, [loading, loadMoreCards]);

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
          {(currentCategoryIndex < Array.from(new Set(cards.map(card => card.Category))).length - 1 || 
           currentCardIndex < cards.filter(card => card.Category === Array.from(new Set(cards.map(card => card.Category)))[currentCategoryIndex]).length) && (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;