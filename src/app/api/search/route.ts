import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";

    if (!query) {
      return NextResponse.json({
        query,
        groups: [],
      });
    }

    if (userId) {
      const [products, sales] = await Promise.all([
        prisma.product.findMany({
          where: {
            userId,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { sku: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name: true,
            sku: true,
            stockQuantity: true,
          },
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.sale.findMany({
          where: {
            userId,
            product: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { sku: { contains: query, mode: "insensitive" } },
              ],
            },
          },
          select: {
            id: true,
            quantity: true,
            totalAmount: true,
            soldAt: true,
            product: {
              select: {
                name: true,
                sku: true,
              },
            },
          },
          take: 5,
          orderBy: {
            soldAt: "desc",
          },
        }),
      ]);

      const groups = [
        {
          label: "Products",
          items: products.map((product) => ({
            id: product.id,
            title: product.name,
            subtitle: `SKU: ${product.sku ?? "N/A"} • Stock: ${product.stockQuantity}`,
            href: `/products?q=${encodeURIComponent(product.name)}`,
          })),
        },
        {
          label: "Sales",
          items: sales.map((sale) => ({
            id: sale.id,
            title: sale.product.name,
            subtitle: `Sold ${sale.quantity} • $${Number(sale.totalAmount).toFixed(2)}`,
            href: `/sales?q=${encodeURIComponent(sale.product.name)}`,
          })),
        },
      ].filter((group) => group.items.length > 0);

      return NextResponse.json({
        query,
        groups,
      });
    }

    const [products, sales] = await Promise.all([
      prisma.demoProduct.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          sku: true,
          stockQuantity: true,
        },
        take: 5,
      }),
      prisma.demoSale.findMany({
        where: {
          product: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { sku: { contains: query, mode: "insensitive" } },
            ],
          },
        },
        select: {
          id: true,
          quantity: true,
          totalAmount: true,
          soldAt: true,
          product: {
            select: {
              name: true,
              sku: true,
            },
          },
        },
        take: 5,
        orderBy: {
          soldAt: "desc",
        },
      }),
    ]);

    const groups = [
      {
        label: "Products",
        items: products.map((product) => ({
          id: product.id,
          title: product.name,
          subtitle: `SKU: ${product.sku ?? "N/A"} • Stock: ${product.stockQuantity}`,
          href: `/products?q=${encodeURIComponent(product.name)}`,
        })),
      },
      {
        label: "Sales",
        items: sales.map((sale) => ({
          id: sale.id,
          title: sale.product.name,
          subtitle: `Sold ${sale.quantity} • $${Number(sale.totalAmount).toFixed(2)}`,
          href: `/sales?q=${encodeURIComponent(sale.product.name)}`,
        })),
      },
    ].filter((group) => group.items.length > 0);

    return NextResponse.json({
      query,
      groups,
    });
  } catch (error) {
    console.error("Search route failed:", error);

    return NextResponse.json(
      {
        query: "",
        groups: [],
        error: error instanceof Error ? error.message : "Search route failed",
      },
      { status: 500 },
    );
  }
}
