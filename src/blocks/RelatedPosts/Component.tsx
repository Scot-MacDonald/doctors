import clsx from "clsx";
import React from "react";
import RichText from "@/components/RichText";

import type { Post } from "@/payload-types";

import { CardRelated } from "../../components/CardRelated";

export type RelatedPostsProps = {
  className?: string;
  docs?: Post[];
  introContent?: any;
};

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props;

  return (
    <div className={clsx("container", className)}>
      {introContent && <RichText content={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === "string") return null;

          return (
            <CardRelated
              key={index}
              doc={doc}
              relationTo="posts"
              showCategories
            />
          );
        })}
      </div>
    </div>
  );
};
