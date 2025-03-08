import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

// Créer une instance de PrismaClient en respectant les meilleures pratiques pour Next.js
// Évite de créer plusieurs instances pendant le hot-reloading en développement
const globalForPrisma = global as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

async function main() {
  try {
    console.log('Début de la synchronisation...');
    
    // Lire le fichier inventory.json
    const inventoryPath = path.join(process.cwd(), 'data', 'inventory.json');
    
    // Vérifier si le fichier existe
    try {
      await fs.access(inventoryPath);
    } catch (error) {
      throw new Error(`Le fichier inventory.json n'existe pas à l'emplacement: ${inventoryPath}`);
    }

    console.log(`Lecture du fichier: ${inventoryPath}`);
    const fileContent = await fs.readFile(inventoryPath, 'utf8');
    
    // Vérifier si le fichier n'est pas vide
    if (!fileContent.trim()) {
      throw new Error('Le fichier inventory.json est vide');
    }

    // Parser le JSON avec gestion d'erreur
    let inventoryData;
    try {
      inventoryData = JSON.parse(fileContent);
    } catch (e) {
      throw new Error(`Erreur lors du parsing du JSON: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Vérifier que les données sont un tableau
    if (!Array.isArray(inventoryData)) {
      throw new Error('Le contenu du fichier doit être un tableau d\'objets');
    }

    // Supprimer les données existantes
    console.log('Suppression des données existantes...');
    await prisma.item.deleteMany();

    // Insérer les nouvelles données
    console.log('Insertion des nouvelles données...');
    
    // Utiliser une transaction pour assurer l'intégrité des données
    await prisma.$transaction(async (tx) => {
      for (const item of inventoryData) {
        // Valider les champs requis
        if (!item.name || !item.type || !item.rarity) {
          console.warn(`Item ignoré car incomplet: ${JSON.stringify(item)}`);
          continue;
        }

        await tx.item.create({
          data: {
            // Si l'ID est fourni comme nombre, l'utiliser; s'il est fourni comme chaîne, le convertir; sinon, undefined
            id: item.id ? (typeof item.id === 'number' ? item.id : parseInt(item.id)) : undefined,
            name: item.name.trim(),
            type: item.type.trim(),
            rarity: item.rarity.trim(),
            description: item.description?.trim() || '',
            quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)) // Assure un nombre entier positif et convertit explicitement en nombre
          }
        });
      }
    });
    
    console.log('Synchronisation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    // Ne pas déconnecter Prisma si on est en mode développement (pour Next.js)
    if (process.env.NODE_ENV === 'production') {
      await prisma.$disconnect();
    }
  }
}

// Exécution avec gestion d'erreur améliorée
if (require.main === module) {
  // Seulement exécuter directement si c'est le script principal (pas en cas d'import)
  main()
    .catch((e) => {
      console.error('Erreur fatale:', e instanceof Error ? e.message : String(e));
      process.exit(1);
    });
}

// Exporter les fonctions pour l'usage dans Next.js
export { main };