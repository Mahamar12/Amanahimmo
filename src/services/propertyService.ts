import type { Property } from '../types/property';
import { INITIAL_PROPERTIES } from '../data/initialProperties';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'amanahimmo_properties_v1';

// Helper to get local state
const getLocalProperties = (): Property[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse local properties', e);
    return INITIAL_PROPERTIES;
  }
};

const saveLocalProperties = (properties: Property[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch (e: any) {
    console.warn('LocalStorage quota exceeded, performing automatic image cleanup fallback', e);
    try {
      // Strip oversized Base64 data URLs from older items if storage limit is reached
      const cleanedProps = properties.map((p, idx) => {
        if (idx > 1) {
          const cleanMain = p.main_image.startsWith('data:') 
            ? 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' 
            : p.main_image;
          const cleanImages = (p.images || []).map(img => 
            img.startsWith('data:') ? cleanMain : img
          );
          return { ...p, main_image: cleanMain, images: cleanImages };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedProps));
    } catch (err) {
      console.error('Critical LocalStorage fallback', err);
    }
  }
};

// Image Compression Helper (Max 1200px dimension, 0.75 JPEG quality)
const compressImageFile = (file: File, maxDimension = 1200, quality = 0.75): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return resolve('');

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
    };
    reader.onerror = () => resolve('');
  });
};

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data as Property[];
        }
      } catch (err) {
        console.warn('Supabase query failed, using local storage fallback', err);
      }
    }
    return getLocalProperties();
  },

  async getPropertyBySlug(slug: string): Promise<Property | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          return data as Property;
        }
      } catch (err) {
        console.warn('Supabase slug fetch failed', err);
      }
    }
    const properties = getLocalProperties();
    return properties.find(p => p.slug === slug) || null;
  },

  async getPropertyById(id: string): Promise<Property | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data as Property;
        }
      } catch (err) {
        console.warn('Supabase id fetch failed', err);
      }
    }
    const properties = getLocalProperties();
    return properties.find(p => p.id === id) || null;
  },

  async generateNextReference(): Promise<string> {
    const properties = await this.getProperties();
    let maxNum = 0;
    
    properties.forEach(p => {
      if (p.reference && p.reference.startsWith('AM-')) {
        const numPart = parseInt(p.reference.replace('AM-', ''), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });

    const nextNum = maxNum + 1;
    return `AM-${nextNum.toString().padStart(4, '0')}`;
  },

  async createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const now = new Date().toISOString();
    const newId = `prop-${Date.now()}`;
    
    const newProperty: Property = {
      ...propertyData,
      id: newId,
      created_at: now,
      updated_at: now
    };

    // Always save to local storage first so property is never lost
    const properties = getLocalProperties();
    const updatedLocal = [newProperty, ...properties.filter(p => p.reference !== newProperty.reference)];
    saveLocalProperties(updatedLocal);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .insert([propertyData])
          .select()
          .single();

        if (!error && data) {
          return data as Property;
        } else if (error) {
          console.warn('Supabase insert notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert failed, local copy kept', err);
      }
    }

    return newProperty;
  },

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property | null> {
    const now = new Date().toISOString();

    const properties = getLocalProperties();
    const index = properties.findIndex(p => p.id === id);
    let updatedProperty: Property;

    if (index !== -1) {
      updatedProperty = {
        ...properties[index],
        ...propertyData,
        updated_at: now
      };
      properties[index] = updatedProperty;
      saveLocalProperties(properties);
    } else {
      updatedProperty = {
        id,
        title: propertyData.title || 'Annonce',
        slug: propertyData.slug || 'annonce',
        reference: propertyData.reference || 'AM-0000',
        description: propertyData.description || '',
        transaction_type: propertyData.transaction_type || 'rent',
        property_type: propertyData.property_type || 'apartment',
        price: propertyData.price || 0,
        price_period: propertyData.price_period || 'month',
        location: propertyData.location || 'Dakar',
        city: propertyData.city || 'Dakar',
        neighborhood: propertyData.neighborhood || '',
        area: propertyData.area || 0,
        bedrooms: propertyData.bedrooms || 0,
        bathrooms: propertyData.bathrooms || 0,
        rooms: propertyData.rooms || 0,
        features: propertyData.features || [],
        main_image: propertyData.main_image || '',
        images: propertyData.images || [],
        featured: propertyData.featured || false,
        status: propertyData.status || 'available',
        created_at: now,
        updated_at: now
      };
      saveLocalProperties([updatedProperty, ...properties]);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .update({ ...propertyData, updated_at: now })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return data as Property;
        }
      } catch (err) {
        console.warn('Supabase update failed, local copy updated', err);
      }
    }

    return updatedProperty;
  },

  async deleteProperty(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('properties')
          .delete()
          .eq('id', id);

        if (!error) {
          return true;
        }
      } catch (err) {
        console.warn('Supabase delete failed', err);
      }
    }

    const properties = getLocalProperties();
    const filtered = properties.filter(p => p.id !== id);
    saveLocalProperties(filtered);
    return true;
  },

  async uploadImage(file: File): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage
            .from('property-photos')
            .getPublicUrl(filePath);
          
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase Storage upload failed, fallback to compressed Data URL', err);
      }
    }

    // Fallback: Compress photo to lightweight ~100KB Data URL so local storage quota is never exceeded
    return compressImageFile(file);
  },

  resetDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  },

  async syncToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, count: 0, error: 'Supabase n\'est pas configuré.' };
    }

    try {
      const localProps = getLocalProperties();
      
      // Clean properties payload for database insertion
      const payload = localProps.map(p => ({
        title: p.title,
        slug: p.slug,
        reference: p.reference,
        description: p.description,
        transaction_type: p.transaction_type,
        property_type: p.property_type,
        price: p.price,
        price_period: p.price_period || 'month',
        location: p.location,
        city: p.city || 'Dakar',
        neighborhood: p.neighborhood || '',
        area: p.area || 0,
        bedrooms: p.bedrooms || 0,
        bathrooms: p.bathrooms || 0,
        rooms: p.rooms || 0,
        features: p.features || [],
        main_image: p.main_image,
        images: p.images || [p.main_image],
        featured: p.featured || false,
        status: p.status || 'available'
      }));

      const { data, error } = await supabase
        .from('properties')
        .upsert(payload, { onConflict: 'reference' })
        .select();

      if (error) {
        return { success: false, count: 0, error: error.message };
      }

      return { success: true, count: data ? data.length : payload.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Erreur lors de la synchronisation.' };
    }
  }
};
