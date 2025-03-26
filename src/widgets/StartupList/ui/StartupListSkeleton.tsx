import { cn } from "@/src/shared/lib";
import { Skeleton } from "@/src/shared/ui/Skeleton";

export const StartupListSkeleton: React.FC = () => {
  return (
    <ul className="mt-7 card_grid">
      {[0, 1, 2, 3, 4].map((index) => (
        <li key={cn("skeleton", index)}>
          <Skeleton className="startup-card_skeleton" />
        </li>
      ))}
    </ul>
  );
};
