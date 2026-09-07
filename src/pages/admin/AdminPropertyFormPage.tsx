import React, { useState, useEffect } from 'react';
import type { Property, PropertyType, TransactionType, PricePeriod, PropertyStatus } from '../../types/property';
import { AVAILABLE_FEATURES, PROPERTY_TYPE_LABELS } from '../../types/property';
import { propertyService } from '../../services/propertyService';
import { Building2, ArrowLeft, Upload, Trash2, CheckCircle2, Image as ImageIcon, AlertTriangle, X } from 'lucide-react';

interface AdminPropertyFormPageProps {
  propertyId?: string; // If defined, edit mode; if empty, create mode
  onNavigate: (path: string) => void;
}

export const AdminPropertyFormPage: React.FC<AdminPropertyFormPageProps> = ({ propertyId, onNavigate }) => {
  const isEditMode = Boolean(propertyId);

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    slug: '',
    reference: '',
    description: '',
    transaction_type: 'rent',
    property_type: 'apartment',
    price: 0,
    price_period: 'month',
    location: '',
    city: 'Dakar',
    neighborhood: '',
    area: 0,
    bedrooms: 0,
    bathrooms: 0,
    rooms: 0,
    features: [],
    main_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    images: [],
    featured: false,
    status: 'available'
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteProperty = async () => {
    if (!propertyId) return;
    setDeleting(true);
    await propertyService.deleteProperty(propertyId);
    setDeleting(false);
    onNavigate('/@dmin-amanahimmo/biens');
  };

  useEffect(() => {
    const initForm = async () => {
      setLoading(true);
      if (isEditMode && propertyId) {
        const existing = await propertyService.getPropertyById(propertyId);
        if (existing) {
          setFormData(existing);
        }
      } else {
        // Auto-generate reference AM-XXXX strictly as required by #25
        const autoRef = await propertyService.generateNextReference();
        setFormData(prev => ({
          ...prev,
          reference: autoRef
        }));
      }
      setLoading(false);
    };

    initForm();
  }, [propertyId, isEditMode]);

  // Slug generator
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: titleVal,
      slug: generateSlug(titleVal)
    }));
  };

  const handleFeatureToggle = (featureName: string) => {
    const currentFeatures = formData.features || [];
    if (currentFeatures.includes(featureName)) {
      setFormData(prev => ({
        ...prev,
        features: currentFeatures.filter(f => f !== featureName)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        features: [...currentFeatures, featureName]
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    
    try {
      const file = e.target.files[0];
      const uploadedUrl = await propertyService.uploadImage(file);
      
      setFormData(prev => {
        const existingImages = prev.images || [];
        const newImages = [...existingImages, uploadedUrl];
        return {
          ...prev,
          main_image: prev.main_image || uploadedUrl,
          images: newImages
        };
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData(prev => {
      const existingImages = prev.images || [];
      const newImages = [...existingImages, imageUrlInput.trim()];
      return {
        ...prev,
        main_image: prev.main_image || imageUrlInput.trim(),
        images: newImages
      };
    });
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => {
      const images = (prev.images || []).filter((_, idx) => idx !== indexToRemove);
      const newMain = images.length > 0 ? images[0] : prev.main_image;
      return {
        ...prev,
        images,
        main_image: newMain
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: formData.title || 'Annonce sans titre',
      slug: formData.slug || generateSlug(formData.title || 'annonce'),
      reference: formData.reference || 'AM-0000',
      description: formData.description || '',
      transaction_type: (formData.transaction_type || 'rent') as TransactionType,
      property_type: (formData.property_type || 'apartment') as PropertyType,
      price: Number(formData.price) || 0,
      price_period: (formData.price_period || 'month') as PricePeriod,
      location: formData.location || 'Dakar',
      city: formData.city || 'Dakar',
      neighborhood: formData.neighborhood || '',
      area: Number(formData.area) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      rooms: Number(formData.rooms) || 0,
      features: formData.features || [],
      main_image: formData.main_image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      images: formData.images && formData.images.length > 0 ? formData.images : [formData.main_image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'],
      featured: Boolean(formData.featured),
      status: (formData.status || 'available') as PropertyStatus
    };

    if (isEditMode && propertyId) {
      await propertyService.updateProperty(propertyId, payload);
    } else {
      await propertyService.createProperty(payload);
    }

    setSaving(false);
    onNavigate('/@dmin-amanahimmo/biens');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-gray-500">
        Chargement du formulaire...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <button
          onClick={() => onNavigate('/@dmin-amanahimmo/biens')}
          className="inline-flex items-center space-x-2 text-[#12372A] font-semibold text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la gestion des biens</span>
        </button>

        <div className="text-right">
          <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
            {isEditMode ? 'Modification' : 'Nouvelle Annonce'}
          </span>
          <h1 className="text-2xl font-extrabold text-[#12372A]">
            {isEditMode ? 'Modifier le bien' : 'Ajouter un bien'}
          </h1>
        </div>
      </div>

      {/* FORM STRICTLY REQUIRED BY REQUIREMENTS #22 & #23 */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl">
        
        {/* SECTION 1: Informations Générales */}
        <div className="space-y-4 pb-6 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-[#12372A] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#D4AF37]" />
            <span>Informations générales</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Titre */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Titre du bien *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Appartement moderne à Mermoz"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>

            {/* Référence */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Référence (Auto) *
              </label>
              <input
                type="text"
                required
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="w-full bg-gray-100 border border-gray-200 text-gray-900 font-mono font-bold rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Description complète *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Détaillez les atouts, pièces, luminosité, sécurité et commodités à proximité..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#12372A] outline-none resize-none"
            />
          </div>
        </div>

        {/* SECTION 2: Transaction & Type & Prix */}
        <div className="space-y-4 pb-6 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-[#12372A]">Transaction & Tarification</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Transaction Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Transaction *
              </label>
              <select
                value={formData.transaction_type}
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as TransactionType })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
              >
                <option value="rent">Location</option>
                <option value="sale">Vente</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Type de bien *
              </label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value as PropertyType })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
              >
                {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="Ex: 350000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>

            {/* Période du prix */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Période
              </label>
              <select
                value={formData.price_period}
                onChange={(e) => setFormData({ ...formData, price_period: e.target.value as PricePeriod })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
              >
                <option value="month">Par mois</option>
                <option value="year">Par an</option>
                <option value="total">Prix Total (Vente)</option>
              </select>
            </div>

          </div>
        </div>

        {/* SECTION 3: Localisation */}
        <div className="space-y-4 pb-6 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-[#12372A]">Localisation</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Ville *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Quartier
              </label>
              <input
                type="text"
                placeholder="Ex: Mermoz, Almadies, Ouakam..."
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Adresse d'affichage *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Mermoz, Dakar"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Caractéristiques */}
        <div className="space-y-4 pb-6 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-[#12372A]">Caractéristiques physiques</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Superficie (m²)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 120"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Chambres
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 3"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Salles de bain
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 2"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Total Pièces
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 4"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#12372A] outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Équipements Cases à Cocher */}
        <div className="space-y-4 pb-6 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-[#12372A]">Équipements & Commodités</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {AVAILABLE_FEATURES.map((featureName) => {
              const isChecked = (formData.features || []).includes(featureName);
              return (
                <label
                  key={featureName}
                  className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-emerald-50/80 border-[#12372A] text-[#12372A]'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleFeatureToggle(featureName)}
                    className="w-4 h-4 text-[#12372A] rounded focus:ring-0"
                  />
                  <span>{featureName}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: Photos */}
        <div className="space-y-4 pb-6 border-b border-gray-100">
          <h3 className="text-lg font-extrabold text-[#12372A] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
            <span>Gestion des photos</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* File Upload Button */}
            <label className="w-full sm:w-auto bg-[#12372A] hover:bg-[#0d281e] text-white font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow cursor-pointer flex items-center justify-center space-x-2">
              <Upload className="w-4 h-4 text-[#D4AF37]" />
              <span>{uploadingImage ? 'Téléchargement...' : 'Télécharger une photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>

            <span className="text-xs text-gray-400 font-semibold">ou ajouter via URL image :</span>

            {/* URL Input */}
            <div className="flex-1 flex gap-2 w-full sm:w-auto">
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#12372A] outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-xl text-xs"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              {formData.images.map((imgUrl, idx) => {
                const isMain = formData.main_image === imgUrl;
                return (
                  <div key={idx} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-200">
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    
                    {/* Main Image Badge */}
                    {isMain ? (
                      <span className="absolute top-2 left-2 bg-[#12372A] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Principale
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, main_image: imgUrl })}
                        className="absolute top-2 left-2 bg-black/60 hover:bg-[#12372A] text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Définir principale
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 7: Publication & Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-[#12372A]">Statut & Visibilité</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Statut du bien *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PropertyStatus })}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[#12372A] outline-none"
              >
                <option value="available">Disponible</option>
                <option value="rented">Loué</option>
                <option value="sold">Vendu</option>
                <option value="unavailable">Indisponible</option>
              </select>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-3 cursor-pointer bg-amber-50 border border-amber-200 p-3 rounded-xl w-full">
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 text-[#D4AF37] rounded focus:ring-0"
                />
                <span className="text-xs font-bold text-amber-900">
                  Mettre ce bien à la une (Affiché sur la page d'accueil)
                </span>
              </label>
            </div>

          </div>
        </div>

        {/* Submit and Delete Bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {isEditMode ? (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer cette publication</span>
            </button>
          ) : <div />}

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onNavigate('/@dmin-amanahimmo/biens')}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#12372A] hover:bg-[#0d281e] text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-xs uppercase tracking-wider"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isEditMode ? 'Enregistrer les modifications' : 'Publier le bien'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* CONFIRMATION DE SUPPRESSION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-scale-up border border-gray-100">
            
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900">
                Supprimer cette publication ?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Vous êtes sur le point de supprimer définitivement la publication <strong className="text-gray-900">"{formData.title}"</strong> (Réf: {formData.reference}). Elle ne sera plus affichée sur le site public.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteProperty}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow transition-colors flex items-center space-x-2"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmer la suppression</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
