"use server"

import { redirect } from "next/navigation";
import { getGuideLandingHref } from "./guide-pages";


export default async function GuideLandingPage({}) {
 return redirect(getGuideLandingHref("en"));
}
