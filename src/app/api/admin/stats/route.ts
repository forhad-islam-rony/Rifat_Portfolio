import { NextResponse } from "next/server";
import { pingDb } from "@/lib/server/mongodb";
import { adminRoute } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = adminRoute(async () => NextResponse.json(await pingDb()));
