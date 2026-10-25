import { getCategories, getPopularFans, getFanSizes } from "@/lib/data";
import { HomeClient } from "./HomeClient";

export const revalidate = 3600; // 1 hour ISR

export default async function HomePage() {
  const [categories, popularFans, fanSizes] = await Promise.all([
    getCategories(),
    getPopularFans(),
    getFanSizes(),
  ]);

  return (
    <HomeClient
      categories={categories}
      popularFans={popularFans}
      fanSizes={fanSizes}
    />
  );
}
