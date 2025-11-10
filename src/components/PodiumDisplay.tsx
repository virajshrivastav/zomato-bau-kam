import { Trophy, Medal, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PodiumProps {
  first: { name: string; achievement: number; zone: string };
  second: { name: string; achievement: number; zone: string };
  third: { name: string; achievement: number; zone: string };
}

const PodiumDisplay = ({ first, second, third }: PodiumProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
        <Trophy className="w-8 h-8 text-gold" />
        Top Performers
        <Trophy className="w-8 h-8 text-gold" />
      </h2>

      <div className="flex items-end justify-center gap-4 max-w-4xl mx-auto">
        {/* Second Place */}
        <Card className="flex-1 p-6 bg-gradient-to-b from-silver/10 to-transparent border-silver/30 transform hover:scale-105 transition-transform">
          <div className="text-center">
            <Medal className="w-12 h-12 text-silver mx-auto mb-3" fill="currentColor" />
            <div className="text-6xl font-bold text-silver mb-2">2</div>
            <div className="text-xl font-bold text-foreground mb-1">{second.name}</div>
            <div className="text-sm text-muted-foreground mb-2">{second.zone}</div>
            <div className="text-3xl font-bold text-silver">{second.achievement}%</div>
          </div>
        </Card>

        {/* First Place */}
        <Card className="flex-1 p-8 bg-gradient-to-b from-gold/20 to-transparent border-gold/40 transform scale-110 hover:scale-115 transition-transform shadow-2xl">
          <div className="text-center">
            <Trophy
              className="w-16 h-16 text-gold mx-auto mb-4 animate-bounce"
              fill="currentColor"
            />
            <div className="text-7xl font-bold text-gold mb-2">1</div>
            <div className="text-2xl font-bold text-foreground mb-1">{first.name}</div>
            <div className="text-sm text-muted-foreground mb-3">{first.zone}</div>
            <div className="text-4xl font-bold text-gold">{first.achievement}%</div>
          </div>
        </Card>

        {/* Third Place */}
        <Card className="flex-1 p-6 bg-gradient-to-b from-bronze/10 to-transparent border-bronze/30 transform hover:scale-105 transition-transform">
          <div className="text-center">
            <Award className="w-12 h-12 text-bronze mx-auto mb-3" fill="currentColor" />
            <div className="text-6xl font-bold text-bronze mb-2">3</div>
            <div className="text-xl font-bold text-foreground mb-1">{third.name}</div>
            <div className="text-sm text-muted-foreground mb-2">{third.zone}</div>
            <div className="text-3xl font-bold text-bronze">{third.achievement}%</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PodiumDisplay;
