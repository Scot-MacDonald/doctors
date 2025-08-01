"use client";

import type { StaticImageData } from "next/image";
import { cn } from "src/utilities/cn";
import NextImage from "next/image";
import React from "react";
import type { Props as MediaProps } from "../types";
import cssVariables from "@/cssVariables";

const { breakpoints } = cssVariables;

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    onClick,
    onLoad: onLoadFromProps,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
  } = props;

  const [isLoading, setIsLoading] = React.useState(true);

  let width: number | undefined;
  let height: number | undefined;
  let alt = altFromProps;
  let src: StaticImageData | string = srcFromProps || "";
  let unoptimized = false;

  if (!src && resource && typeof resource === "object") {
    const {
      alt: altFromResource,
      filename: fullFilename,
      height: fullHeight,
      url,
      width: fullWidth,
      id,
    } = resource;

    width = fullWidth!;
    height = fullHeight!;
    alt = altFromResource;

    src = url || `/api/media/file/${id}`;
    unoptimized = !!url; // disable optimization for external URLs
  }

  const sizes = sizeFromProps
    ? sizeFromProps
    : Object.entries(breakpoints)
        .map(([, value]) => `(max-width: ${value}px) ${value}px`)
        .join(", ");

  return (
    <NextImage
      alt={alt || ""}
      className={cn(imgClassName)}
      fill={fill}
      height={!fill ? height : undefined}
      onClick={onClick}
      onLoad={() => {
        setIsLoading(false);
        if (typeof onLoadFromProps === "function") {
          onLoadFromProps();
        }
      }}
      priority={priority}
      quality={60}
      sizes={sizes}
      src={src}
      width={!fill ? width : undefined}
      unoptimized={unoptimized}
    />
  );
};
