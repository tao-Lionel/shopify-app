import db from "../db.server";

export async function getPopup(id: number, graphql: any) {
  const popup = await db.popup.findFirst({ where: { id } });

  if (!popup) {
    return null;
  }
  return popup;
}

export async function getPopups(shop: string, graphql: any) {
  const popups = await db.popup.findMany({
    where: { shop: shop },
    orderBy: { id: "desc" },
  });

  if (popups.length === 0) {
    return [];
  }

  return popups;
}
