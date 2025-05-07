import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit2, Trash2, Bike, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, supabaseUrl } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

export interface Bike {
  id: string;
  name: string;
  type: string;
  description: string;
  price_per_day: number;
  image_url: string;
  availability_status: 'available' | 'maintenance';
  created_at: string;
}

const bikeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price_per_day: z.number().min(0, { message: "Price must be positive" }),
  image_url: z.union([
    z.string().min(1, { message: "Image URL is required" }),
    z.instanceof(File)
  ]).refine(
    (value) => value !== undefined && value !== null,
    { message: "Image URL or file is required" }
  ),
  availability_status: z.enum(['available', 'maintenance'], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either 'available' or 'maintenance'"
  })
});

type BikeFormData = z.infer<typeof bikeSchema>;

const BikesManagement = () => {
  const { toast } = useToast();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState<Bike | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || bike.type === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || bike.availability_status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [bikes, searchTerm, selectedCategory, selectedStatus]);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<BikeFormData>({
    resolver: zodResolver(bikeSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
      price_per_day: 0,
      image_url: ''
    }
  });

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('bikes')
          .select('*')
          .order('name');

        if (error) throw error;
        setBikes(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    try {
      // Generate filename with original extension
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
      const filePath = `bikes/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage.from('bikes').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage.from('bikes').getPublicUrl(filePath);
      
      // Ensure URL is properly formatted
      const fullUrl = publicUrl.replace('http://', 'https://'); // Ensure HTTPS
      
      return fullUrl;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };
  

  const handleAdd = async (formData: BikeFormData) => {
    try {
      // 1. Upload image if a file is selected
      let imageUrl = formData.image_url;
  
      // If image_url is a File (user uploaded an image)
      if (imageUrl instanceof File) {
        const uploadedUrl = await handleFileUpload(imageUrl);
        if (!uploadedUrl) throw new Error("Image upload failed");
        imageUrl = uploadedUrl;
      }
  
      // 2. Insert into Supabase
      const { data, error } = await supabase
        .from('bikes')
        .insert([{
          name: formData.name,
          type: formData.type,
          description: formData.description,
          price_per_day: Number(formData.price_per_day),
          image_url: imageUrl,
          availability_status: 'available' // default status
        }])
        .select()
        .single();
  
      if (error) throw error;
  
      // 3. Update UI
      setBikes(prev => [...prev, data]);
      setIsAddModalOpen(false);
      reset();
  
      toast({
        title: "Bike added",
        description: "Bike has been added successfully",
      });
  
    } catch (error) {
      toast({
        title: "Failed to add bike",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bikes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Bike deleted",
        description: "Bike has been removed from the inventory",
      });

      setBikes(bikes.filter(bike => bike.id !== id));
    } catch (error) {
      toast({
        title: "Failed to delete bike",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (bike: Bike) => {
    setOpen(true);
    setInitialData(bike);
  };

  const handleStatusChange = async (id: string, newStatus: 'available' | 'maintenance') => {
    try {
      const { error } = await supabase
        .from('bikes')
        .update({ availability_status: newStatus })
        .eq('id', id);
  
      if (error) throw error;
  
      toast({
        title: "Status updated",
        description: `Bike status has been updated to ${newStatus}`,
      });
  
      // Correctly typed update
      setBikes(prev =>
        prev.map(bike =>
          bike.id === id ? { ...bike, availability_status: newStatus } : bike
        )
      );
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };
  

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('bikes')
          .select('*')
          .order('name');

        if (error) throw error;
        setBikes(data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bikes Management</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Bike
          </button>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="scooter">Scooter</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="bicycle">Bicycle</option>
              <option value="bicycle">Electric Scooter</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search bikes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="space-y-4">
          {filteredBikes.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No bikes found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBikes.map((bike) => (
                <motion.div
                  key={bike.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="relative w-20 h-20">
                        <img
                          src={bike.image_url}
                          alt={bike.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            const originalPath = bike.image_url;
                            
                            // Try different variations of the URL
                            // 1. Try local path format
                            const localPath = originalPath.replace('/images/bikes/', '/public/images/bikes/').replace('.jpg', '.avif');
                            
                            // 2. Try Supabase path format
                            const supabasePath = originalPath.replace('/public/images/bikes/', '/images/bikes/').replace('.avif', '.jpg');
                            
                            // 3. Try with Supabase storage URL
                            const storageUrl = `${supabaseUrl}/storage/v1/object/public${supabasePath}`;
                            
                            // Try local path first
                            img.src = localPath;
                            
                            // If that fails, try Supabase path
                            setTimeout(() => {
                              if (img.src === localPath) {
                                img.src = storageUrl;
                              }
                            }, 500);
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                          <span className="absolute bottom-2 left-2 text-white text-xs">{bike.type}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{bike.name}</h3>
                        <p className="text-gray-600">{bike.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {bike.availability_status === 'available' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`text-sm ${
                        bike.availability_status === 'available' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {bike.availability_status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-600">{bike.description}</p>
                    <p className="mt-2 text-blue-500 font-semibold">
                      ${bike.price_per_day}/day
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => handleStatusChange(bike.id, bike.availability_status === 'available' ? 'maintenance' : 'available')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {bike.availability_status === 'available' ? 'Send to Maintenance' : 'Mark as Available'}
                    </button>
                    <button
                      onClick={() => handleDelete(bike.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Bike Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isAddModalOpen ? 1 : 0 }}
        className={`fixed inset-0 bg-black/50 z-50 ${isAddModalOpen ? 'flex' : 'hidden'}`}
        onClick={() => setIsAddModalOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-6 m-auto w-full max-w-md shadow-xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">Add New Bike</h2>
          
          <form onSubmit={handleSubmit(handleAdd)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scooter">Scooter</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="bicycle">Bicycle</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per day</label>
              <input
                {...register('price_per_day', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.price_per_day && (
                <p className="text-red-500 text-sm mt-1">{errors.price_per_day.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bike Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const imageUrl = await handleFileUpload(e.target.files[0]);
                    if (imageUrl) {
                      setValue('image_url', imageUrl);
                    }
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.image_url && (
                <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Add Bike'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BikesManagement; 