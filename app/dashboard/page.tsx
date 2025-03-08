'use client';
import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import Form from '../formPage/page';
import { Item, ItemFormInput, itemTypes, rarities } from '../../lib/types';

// Composant principal de la page d'inventaire
const Home: React.FC = () => {
  // Déclaration des états pour gérer les données et l'interface
  const [items, setItems] = useState<Item[]>([]); // Liste des objets
  const [isLoading, setIsLoading] = useState<boolean>(false); // État du chargement
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs
  const [isFormOpen, setIsFormOpen] = useState(false);// État du formulaire
  const [typeFilter, setTypeFilter] = useState<string>('');// Filtre par type
  const [rarityFilter, setRarityFilter] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Chargement initial des données
  useEffect(() => {
    fetchItems();
  }, []);

  // Récupération des objets depuis l'API
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching items...');
      
      const response = await fetch('/api/inventoryGET');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch inventory items: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        throw new Error('Invalid data format');
      }
      
      setItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load inventory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ajouter un item
  const handleAddItem = async (newItem: ItemFormInput) => {
    try {
      const response = await fetch('/api/formPOST', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout de l\'item');
      }

      setIsFormOpen(false);
      setSuccessMessage('Objet ajouté avec succès !');
      await fetchItems();
      
      // Faire disparaître le message après 3 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error adding item:', err);
      setError(err.message || 'Erreur lors de l\'ajout de l\'item');
      // Garder le formulaire ouvert en cas d'erreur
    }
  };

  // Gestion de la suppression d'un objet
  const handleDelete = (deletedId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== deletedId));
  };

  // Filtrage des objets selon les critères
  const filteredItems = items.filter(item => {
    const matchesType = typeFilter ? item.type === typeFilter : true;
    const matchesRarity = rarityFilter ? item.rarity === rarityFilter : true;
    return matchesType && matchesRarity;
  });

  // Rendu de l'interface
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <main className="container max-w-7xl mx-auto py-8 px-4 relative">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Inventaire RPG
        </h1>

        {/* Message de succès */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-500 text-green-100 px-4 py-3 rounded relative mb-6 animate-fade-out">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Barre de filtres et bouton d'ajout */}
        <div className="flex justify-between items-center mb-6">
          <div className="p-4 bg-zinc-900 rounded-lg w-fit">
            <div className="flex gap-4 flex-wrap">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 min-w-[150px]"
              >
                <option value="">Tous les types</option>
                {itemTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 min-w-[150px]"
              >
                <option value="">Toutes les raretés</option>
                {rarities.map((rarity) => (
                  <option key={rarity} value={rarity}>
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Bouton de redirection vers formPage*/}
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-700 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter un objet
          </button>
        </div>

        {/* Model du formulaire */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-2xl">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-2 right-2 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
              <Form onSubmit={handleAddItem} />
            </div>
          </div>
        )}

        {/* Affichage des erreurs si présentes */}
        {error && (
          <div className="bg-red-900 border border-red-800 text-red-100 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Section d'affichage de l'inventaire */}
          <div className="col-span-1">
            <div className="bg-zinc-900 p-6 rounded-lg shadow-2xl">         

              {/* Grille d'affichage des items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-3 text-center py-4 text-gray-300">Loading...</div>
                ) : filteredItems.length === 0 ? (
                  <div className="col-span-3 text-center py-4 text-gray-300">
                    {error ? error : "Aucun objet trouvé avec ces filtres"}
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <ItemCard 
                      key={item.id}
                      item={item}
                      onDelete={() => handleDelete(item.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
