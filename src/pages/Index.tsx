import { useState } from "react";
import { Button } from "@/components/ui/button";
import FortuneCard from "@/components/FortuneCard";
import { Sparkles } from "lucide-react";
import fortuneBg from "@/assets/fortune-bg.jpg";

const fortunes = [
  "A journey of a thousand miles begins with a single step",
  "Your creativity will lead you to success",
  "Good things come to those who wait, but better things come to those who work",
  "The best time to plant a tree was 20 years ago. The second best time is now",
  "Your kindness will be returned to you tenfold",
  "Adventure awaits you around the corner",
  "Wisdom comes from experience, and experience comes from mistakes",
  "Your smile will bring happiness to many today",
  "An opportunity you seek will arrive soon",
  "The stars align in your favor this week",
  "Patience and persistence will bring great rewards",
  "Your unique talents will shine brightly soon",
  "A pleasant surprise awaits you",
  "Trust your intuition, it knows the way",
  "Your generosity will open unexpected doors",
  "Dreams are the seeds of great achievements",
  "Today's small steps lead to tomorrow's big leaps",
  "The universe conspires in your favor",
  "Your positive energy attracts wonderful things",
  "A new friendship will bring joy to your life"
];

const generateLuckyNumbers = () => {
  const numbers = new Set<number>();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 99) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

const Index = () => {
  const [currentFortune, setCurrentFortune] = useState<string | null>(null);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateFortune = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setCurrentFortune(randomFortune);
      setLuckyNumbers(generateLuckyNumbers());
      setIsAnimating(false);
    }, 200);
  };

  return (
    <main 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${fortuneBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      
      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-4xl">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Fortune Cookie
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover your fortune and lucky numbers
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          {currentFortune && !isAnimating && (
            <FortuneCard fortune={currentFortune} luckyNumbers={luckyNumbers} />
          )}

          <Button
            onClick={generateFortune}
            variant="fortune"
            size="lg"
            disabled={isAnimating}
            className="text-lg px-8 py-6 h-auto"
          >
            <Sparkles className="mr-2" />
            {currentFortune ? "Get Another Fortune" : "Reveal Your Fortune"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Index;
