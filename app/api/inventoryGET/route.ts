import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { syncPrismaToJson } from '@/lib/syncData';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    
    // Synchroniser avec le fichier JSON
    await syncPrismaToJson();
    
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des items' },
      { status: 500 }
    );
  }
}
