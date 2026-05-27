import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CollectibleShopScreen } from "@/components/empowered/CollectibleShopScreen";

export const Route = createFileRoute("/_authenticated/shop")({
  component: ShopPage,
});

function ShopPage() {
  const navigate = useNavigate();
  return <CollectibleShopScreen onClose={() => navigate({ to: "/home" })} />;
}
