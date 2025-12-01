import { fetchAllCode } from "@/lib/fetchCode";
import HomeClient from "./HomeClient";

export default async function Home() {
  const allCode = await fetchAllCode();

  return <HomeClient allCode={allCode} />;
}
