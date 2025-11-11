import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { fetchActiveBrands, createBrand, clearError, clearSuccess } from '@/store/admin/brands-slice';
import { Plus, Building2 } from 'lucide-react';

const BrandSelect = ({ value, onChange, label, required = false }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { activeBrands, loading, error, success } = useSelector(state => state.adminBrands);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBrandData, setNewBrandData] = useState({
    name: '',
    nameEn: '',
    description: '',
    logo: ''
  });

  useEffect(() => {
    dispatch(fetchActiveBrands());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: error,
        variant: "destructive"
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  useEffect(() => {
    if (success) {
      toast({
        title: "نجح",
        description: success,
      });
      dispatch(clearSuccess());
      setIsAddDialogOpen(false);
      setNewBrandData({
        name: '',
        nameEn: '',
        description: '',
        logo: ''
      });
    }
  }, [success, toast, dispatch]);

  const handleAddBrand = () => {
    if (!newBrandData.name || !newBrandData.nameEn) {
      toast({
        title: "خطأ",
        description: "اسم العلامة التجارية بالعربية والإنجليزية مطلوب",
        variant: "destructive"
      });
      return;
    }

    dispatch(createBrand(newBrandData));
  };

  return (
    <div className="space-y-2">
      <label className="text-white font-bold text-sm sm:text-base lg:text-lg">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="flex gap-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-luxury-navy border border-luxury-gold/30 rounded-xl px-4 py-3 text-white focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/20 transition-all [&>option]:bg-luxury-navy [&>option]:text-white"
          style={{ backgroundColor: '#0a1628', color: '#ffffff', colorScheme: 'dark' }}
          required={required}
        >
          <option value="" className="bg-luxury-navy text-white">اختر العلامة التجارية</option>
          {activeBrands && activeBrands.length > 0 ? activeBrands.map((brand) => (
            <option key={brand._id} value={brand._id} className="bg-luxury-navy text-white">
              {brand.name} ({brand.nameEn})
            </option>
          )) : (
            <option value="" disabled className="bg-luxury-navy text-white">لا توجد علامات تجارية متاحة</option>
          )}
        </select>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-navy px-3"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-luxury-navy/95 backdrop-blur-sm border-luxury-gold/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-luxury-gold flex items-center gap-2">
                <Building2 className="w-6 h-6" />
                إضافة علامة تجارية جديدة
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-white font-semibold mb-2 block">اسم العلامة التجارية (عربي) *</label>
                <Input
                  value={newBrandData.name}
                  onChange={(e) => setNewBrandData({...newBrandData, name: e.target.value})}
                  placeholder="أدخل اسم العلامة التجارية بالعربية"
                  className="bg-luxury-navy border-luxury-gold/30 text-white placeholder-white/50"
                  style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                />
              </div>
              <div>
                <label className="text-white font-semibold mb-2 block">اسم العلامة التجارية (إنجليزي) *</label>
                <Input
                  value={newBrandData.nameEn}
                  onChange={(e) => setNewBrandData({...newBrandData, nameEn: e.target.value})}
                  placeholder="أدخل اسم العلامة التجارية بالإنجليزية"
                  className="bg-luxury-navy border-luxury-gold/30 text-white placeholder-white/50"
                  style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                />
              </div>
              <div>
                <label className="text-white font-semibold mb-2 block">الوصف (اختياري)</label>
                <Input
                  value={newBrandData.description}
                  onChange={(e) => setNewBrandData({...newBrandData, description: e.target.value})}
                  placeholder="أدخل وصف العلامة التجارية"
                  className="bg-luxury-navy border-luxury-gold/30 text-white placeholder-white/50"
                  style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                />
              </div>
              <div>
                <label className="text-white font-semibold mb-2 block">رابط الشعار (اختياري)</label>
                <Input
                  value={newBrandData.logo}
                  onChange={(e) => setNewBrandData({...newBrandData, logo: e.target.value})}
                  placeholder="أدخل رابط شعار العلامة التجارية"
                  className="bg-luxury-navy border-luxury-gold/30 text-white placeholder-white/50"
                  style={{ backgroundColor: '#0a1628', color: '#ffffff' }}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddBrand}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-luxury-gold to-luxury-gold-light hover:from-luxury-gold-light hover:to-luxury-gold text-luxury-navy font-bold"
                >
                  {loading ? 'جاري الإضافة...' : 'إضافة العلامة التجارية'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-luxury-gold/30 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-navy"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BrandSelect;
