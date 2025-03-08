import { promises as fs } from 'fs';
import path from 'path';
import prisma from './prisma';
import { Item } from './types';

const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json');

export async function syncPrismaToJson() {
  try {
    // Récupérer toutes les données de Prisma
    const prismaData = await prisma.item.findMany({
      orderBy: { id: 'asc' }
    });

    // Écrire dans le fichier JSON
    await fs.writeFile(
      inventoryPath,
      JSON.stringify(prismaData, null, 2)
    );

    return prismaData;
  } catch (error) {
    console.error('Erreur de synchronisation:', error);
    throw error;
  }
}
