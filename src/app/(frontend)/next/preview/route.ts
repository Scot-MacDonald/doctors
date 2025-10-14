import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { CollectionSlug, TypedLocale } from "payload";

const payloadToken = "payload-token";

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise });
  const token = req.cookies.get(payloadToken)?.value;
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const collection = searchParams.get("collection") as CollectionSlug;
  const slug = searchParams.get("slug");
  const previewSecret = searchParams.get("previewSecret");

  if (previewSecret) {
    return NextResponse.json("You are not allowed to preview this page", {
      status: 403,
    });
  }

  if (!path || !collection || !slug) {
    return NextResponse.json("Missing required parameters", { status: 400 });
  }

  if (!token) {
    return NextResponse.json("You are not allowed to preview this page", {
      status: 403,
    });
  }

  if (!path.startsWith("/")) {
    return NextResponse.json(
      "This endpoint can only be used for internal previews",
      { status: 500 }
    );
  }

  let user;
  try {
    user = jwt.verify(token, payload.secret);
  } catch (error) {
    payload.logger.error("Error verifying token for live preview:", error);
  }

  const draft = await draftMode();

  if (!user) {
    draft.disable();
    return NextResponse.json("You are not allowed to preview this page", {
      status: 403,
    });
  }

  try {
    const docs = await payload.find({
      collection,
      draft: true,
      locale: path.split("/")[1] as TypedLocale,
      where: { slug: { equals: slug } },
    });

    if (!docs.docs.length) {
      return NextResponse.json("Document not found", { status: 404 });
    }
  } catch (error) {
    payload.logger.error("Error verifying document for live preview:", error);
  }

  draft.enable();
  redirect(path);
}
