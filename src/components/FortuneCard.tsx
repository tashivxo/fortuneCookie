import { Card } from "@/components/ui/card";

interface FortuneCardProps {
  fortune: string;
  luckyNumbers: number[];
}

const FortuneCard = ({ fortune, luckyNumbers }: FortuneCardProps) => {
  return (
    <Card className="p-8 max-w-2xl w-full bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.3)] animate-scale-in">
      <div className="space-y-6">
        <div className="text-center">
          <p className="fortune-text text-2xl md:text-3xl leading-relaxed text-foreground">
            "{fortune}"
          </p>
        </div>
        
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Lucky Numbers:</span>
            {luckyNumbers.map((num, index) => (
              <span
                key={index}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm"
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FortuneCard;
