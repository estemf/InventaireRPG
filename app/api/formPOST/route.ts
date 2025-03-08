import { NextResponse } from 'next/server';
import { ItemFormInput, itemTypes, rarities } from '@/lib/types';
import prisma from '@/lib/prisma';
import { syncPrismaToJson } from '@/lib/syncData';

export async function POST(request: Request) {
  try {
    const newItem: ItemFormInput = await request.json();

    // Validation détaillée
    const errors = [];
    if (!newItem.name?.trim()) errors.push('Le nom est requis');
    if (!itemTypes.includes(newItem.type as any)) errors.push('Type invalide');
    if (!rarities.includes(newItem.rarity as any)) errors.push('Rareté invalide');
    if (newItem.quantity < 1) errors.push('La quantité doit être supérieure à 0');

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      );
    }

    // Récupérer le dernier ID
    const lastItem = await prisma.item.findFirst({
      orderBy: { id: 'desc' },
    });
    const nextId = (lastItem?.id ?? 0) + 1;

    // Création dans Prisma avec ID explicite
    const createdItem = await prisma.item.create({
      data: {
        id: nextId,
        name: newItem.name.trim(),
        type: newItem.type,
        rarity: newItem.rarity,
        description: newItem.description?.trim() ?? null,
        quantity: Math.max(1, Math.floor(Number(newItem.quantity)))
      }
    });

    // Synchronisation avec le fichier JSON
    await syncPrismaToJson();

    return NextResponse.json(createdItem, { status: 201 });
  } catch (error: any) {
    console.error('Error adding item:', error);
    const errorMessage = error?.message || 'Erreur lors de l\'ajout de l\'item';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
