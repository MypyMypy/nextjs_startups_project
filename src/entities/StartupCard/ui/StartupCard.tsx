import { Button } from "@/src/shared/ui/Button";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface StartupCardProps {
  _id: string;
  _createdAt: string;
  title?: string;
  views?: number;
  description?: string;
  image?: string;
  category?: string;
  author: {
    _id: string;
    name?: string;
    image?: string;
  };
}

export const StartupCard: React.FC<StartupCardProps> = ({
  _createdAt,
  _id,
  title,
  author,
  views,
  description,
  image,
  category,
}) => {
  return (
    <div className="flex-col">
      <div className="flex-between">
        <p className="startup_card_date">{_createdAt}</p>

        <div className="flex gap-1 5">
          <EyeIcon className="size-6 text-primary" />
          <span className="text-16-medium">{views}</span>
        </div>
      </div>

      <div className="flex-between mt-5 gap-5">
        <div className="flex-1">
          <Link href={`/user/${author?._id}`}>
            <p className="text-16-medium line-clamp-1">{author.name}</p>
          </Link>
          <Link href={`/startup/${_id}`}>
            <h3 className="text-26-semibold">{title}</h3>
          </Link>
        </div>
        {author && (
          <Link href={`/user/${author._id}`}>
            {author?.image && (
              <Image
                className="rounded-full"
                src={author.image}
                width={48}
                height={48}
                alt={author?.name ?? "Unnamed author"}
              />
            )}
          </Link>
        )}
      </div>

      <Link href={`/startup/${_id}`}>
        <p className="startup-card_desc">{description}</p>

        <img
          src={image}
          width={"100%"}
          alt="placeholder"
          className="startyp-card-img"
        />
      </Link>

      <div className="flex-between gap-3 mt-5">
        {category && (
          <Link href={`/?query=${category.toLowerCase()}`}>
            <p className="text-16-medium">{category}</p>
          </Link>
        )}
        <Button className="startyp-card_btn" asChild>
          <Link href={`/startup/${_id}`}>Details</Link>
        </Button>
      </div>
    </div>
  );
};
