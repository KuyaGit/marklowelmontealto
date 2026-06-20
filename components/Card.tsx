import Image from "next/image";
import { HeartIcon } from "@/components/icons";

interface CardProps {
  title: string;
  description: string;
  image?: string;
  isFeatured?: boolean;
}

export function Card({ title, description, image, isFeatured = false }: CardProps) {
  return (
    <article className="flex gap-5 p-4 sm:p-5 rounded-xl bg-surface border border-border hover:border-foreground/30 transition-colors duration-200">
      {/* Image / placeholder */}
      <div className="relative flex-shrink-0 w-36 sm:w-44 h-28 sm:h-32 rounded-lg bg-background border border-border overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 144px, 176px"
            className="object-cover"
          />
        ) : (
          /* Placeholder when no image is provided */
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs tracking-widest uppercase text-muted select-none">
              Preview
            </span>
          </div>
        )}

        {/* Heart / featured indicator */}
        <div className="absolute top-2 right-2">
          <HeartIcon
            size={16}
            filled={isFeatured}
            className={isFeatured ? "text-foreground/70" : "text-foreground/30"}
          />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
        <h3 className="font-bold text-base sm:text-lg leading-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted line-clamp-3">
          {description}
        </p>
      </div>
    </article>
  );
}
