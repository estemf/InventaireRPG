import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { syncPrismaToJson } from '@/lib/syncData';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const numericId = parseInt(id);

    // Supprimer de la base de données
    const deletedItem = await prisma.item.delete({
      where: { id: numericId }
    });

    // Synchroniser avec le fichier JSON
    await syncPrismaToJson();

    return NextResponse.json(deletedItem);
  } catch (error) {
    console.error('Erreur dans la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' }, 
      { status: 500 }
    );
  }
}