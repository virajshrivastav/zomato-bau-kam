import { Medal } from "lucide-react";
import winnerAvatar from "@/assets/avatar-winner.png";
import determinedAvatar from "@/assets/avatar-determined.png";
import runningAvatar from "@/assets/avatar-running.png";
import tiredAvatar from "@/assets/avatar-tired.png";

interface LeaderboardBarProps {
  name: string;
  zone: string;
  achievement: number;
  rank: number;
  totalRanks: number;
}

const LeaderboardBar = ({ name, zone, achievement, rank, totalRanks }: LeaderboardBarProps) => {
  const getBarColor = () => {
    switch (rank) {
      case 1:
        return "from-gold to-yellow-400";
      case 2:
        return "from-silver to-gray-300";
      case 3:
        return "from-bronze to-orange-400";
      default:
        return "from-race-blue to-blue-400";
    }
  };

  const getAvatar = () => {
    if (rank === 1) return winnerAvatar;
    if (rank === 2 || rank === 3) return determinedAvatar;
    if (rank === totalRanks) return tiredAvatar;
    return runningAvatar;
  };

  const getMedalColor = () => {
    switch (rank) {
      case 1:
        return "text-gold";
      case 2:
        return "text-silver";
      case 3:
        return "text-bronze";
      default:
        return "text-muted-foreground";
    }
  };

  const getPodiumHeight = () => {
    if (rank === 1) return "h-16";
    if (rank === 2) return "h-12";
    if (rank === 3) return "h-8";
    return "h-0";
  };

  return (
    <div
      className="flex flex-col items-center group"
      style={{
        animation: `fadeIn 0.5s ease-out ${rank * 0.1}s both`,
      }}
    >
      {/* Avatar at top */}
      <div className="relative mb-2">
        <img
          src={getAvatar()}
          alt={name}
          className="w-16 h-16 rounded-full border-4 border-card shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
        {rank <= 3 && (
          <div className="absolute -top-2 -right-2 bg-card rounded-full p-1 shadow-md">
            <Medal className={`w-5 h-5 ${getMedalColor()}`} fill="currentColor" />
          </div>
        )}
      </div>

      {/* Achievement percentage above bar */}
      <div className="mb-1 font-bold text-foreground text-lg">{achievement}%</div>

      {/* Vertical Bar */}
      <div className="relative w-20 h-64 bg-muted/50 rounded-t-xl overflow-hidden border-2 border-border shadow-inner">
        <div
          className={`absolute bottom-0 w-full bg-gradient-to-t ${getBarColor()} transition-all duration-1000 ease-out rounded-t-xl shadow-lg`}
          style={{
            height: `${achievement}%`,
            animation: `slideUp 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${rank * 0.15}s both`,
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
        </div>
      </div>

      {/* Podium for top 3 */}
      {rank <= 3 && (
        <div
          className={`w-24 ${getPodiumHeight()} bg-gradient-to-b ${getBarColor()} rounded-b-lg border-2 border-border shadow-md transition-all duration-500`}
        />
      )}

      {/* Name and Zone */}
      <div className="mt-3 text-center">
        <div className="font-semibold text-foreground text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{zone}</div>
      </div>

      {/* Rank badge */}
      <div
        className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
          rank === 1
            ? "bg-gold/20 text-gold"
            : rank === 2
              ? "bg-silver/20 text-gray-700"
              : rank === 3
                ? "bg-bronze/20 text-orange-700"
                : "bg-muted text-muted-foreground"
        }`}
      >
        #{rank}
      </div>
    </div>
  );
};

export default LeaderboardBar;
