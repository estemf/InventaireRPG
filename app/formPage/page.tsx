'use client';
import React, { useState } from 'react';
import { ItemFormInput, itemTypes, rarities } from '@/lib/types';

interface FormProps {
  onSubmit: (item: ItemFormInput) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ItemFormInput>({
    name: '',
    type: itemTypes[0],
    rarity: rarities[0],
    description: '',
    quantity: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      type: itemTypes[0],
      rarity: rarities[0],
      description: '',
      quantity: 1
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded-lg shadow-xl">
      <div className="space-y-4">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
            Nom de l'objet
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-zinc-300">
            Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Rareté */}
        <div>
          <label htmlFor="rarity" className="block text-sm font-medium text-zinc-300">
            Rareté
          </label>
          <select
            id="rarity"
            value={formData.rarity}
            onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
            className="mt-1 block w-full rounded-md bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-300">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quantité */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-zinc-300">
            Quantité
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Bouton de soumission */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ajouter l'objet
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
