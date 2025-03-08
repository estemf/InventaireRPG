import React, { useState } from 'react';
import { Item } from '@/lib/types';

// Interface définissant les propriétés du composant ItemCard
interface ItemCardProps {
  item: Item;
  onDelete: (id: number) => void;  // Fonction de rappel pour la suppression
}

// Composant qui affiche une carte d'item dans l'inventaire
const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete }) => {
  const [isEquipped, setIsEquipped] = useState(false);

  // Gestion de la suppression
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/inventoryDELETE?id=${item.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(item.id); // Appeler onDelete uniquement si la suppression a réussi
      } else {
        const data = await response.json();
        console.error('Erreur lors de la suppression:', data.error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Gestion de l'équipement
  const handleEquip = () => {
    setIsEquipped(!isEquipped);
  };

  // Structure du composant
  return (
    <div className={`border rounded-lg p-4 transition-all hover:shadow-lg ${
      isEquipped 
        ? 'bg-blue-900/50 border-blue-500 hover:shadow-blue-500/50' 
        : 'bg-zinc-800 border-zinc-700 hover:shadow-zinc-800'
    }`}>
      <div className="flex flex-col gap-2">
        {/* Première ligne : Type et Rareté */}
        <div className="flex justify-between items-center">
          <span className="bg-zinc-700 text-zinc-100 text-xs font-medium uppercase px-2 py-1 rounded-full">
            {item.type}
          </span>
          <span className="text-xs font-medium capitalize text-zinc-300">
            {item.rarity}
          </span>
        </div>

        {/* Deuxième ligne : Nom de l'item */}
        <h3 className="text-lg font-semibold text-zinc-100">
          {item.name}
        </h3>

        {/* Troisième ligne : Description */}
        <p className="text-sm text-zinc-400 min-h-[40px]">
          {item.description || 'Aucune description disponible.'}
        </p>

        {/* Quatrième ligne : Quantité */}
        <div className="flex justify-between items-center pt-2 border-t border-zinc-700">
          <span className="text-sm font-medium text-zinc-300">
            Quantité: {item.quantity}
          </span>
          <div className="flex gap-4">
          {/* Bouton d'équipement d'objet */}
          <button
              onClick={handleEquip}
              className={`text-sm ${
                isEquipped ? 'text-blue-400' : 'text-blue-500 hover:text-blue-400'
              }`}
            >
              {isEquipped ? 'Déséquiper' : 'Équiper'}
            </button>
            {/* Bouton de suppresion d'objet */}
            <button
              onClick={handleDelete}
              className="text-sm text-red-500 hover:text-red-400"
            >
              Supprimer
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;