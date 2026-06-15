import { UserTextCardSkeleton } from "./user-text-card-skeleton";

export const UserTextListSkeleton = () => (
  <div className="flex flex-col gap-3 p-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <UserTextCardSkeleton key={i} />
    ))}
  </div>
);
