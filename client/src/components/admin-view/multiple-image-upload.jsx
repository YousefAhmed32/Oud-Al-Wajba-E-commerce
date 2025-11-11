import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Star,
  Plus,
  Trash2,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MultipleImageUpload = ({ 
  images = [], 
  setImages, 
  maxImages = 5,
  mainImageIndex = 0,
  setMainImageIndex 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "تجاوز الحد الأقصى",
        description: `يمكنك رفع ${maxImages} صور كحد أقصى`
      });
      return;
    }

    setIsUploading(true);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file,
            name: file.name
          };
          
          setImages(prev => [...prev, newImage]);
          
          // إذا كانت هذه أول صورة، اجعلها الصورة الرئيسية
          if (images.length === 0) {
            setMainImageIndex(0);
          }
        };
        reader.readAsDataURL(file);
      }
    });
    
    setIsUploading(false);
    event.target.value = '';
  };

  const handleRemoveImage = (imageId) => {
    const imageIndex = images.findIndex(img => img.id === imageId);
    
    setImages(prev => prev.filter(img => img.id !== imageId));
    
    // إذا كانت الصورة المحذوفة هي الرئيسية، اجعل الصورة الأولى الجديدة هي الرئيسية
    if (imageIndex === mainImageIndex) {
      setMainImageIndex(0);
    } else if (imageIndex < mainImageIndex) {
      setMainImageIndex(prev => prev - 1);
    }
  };

  const handleSetMainImage = (index) => {
    setMainImageIndex(index);
    toast({
      title: "تم تعيين الصورة الرئيسية",
      description: "تم تعيين هذه الصورة كصورة رئيسية للمنتج"
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-luxury-navy/20 border-luxury-gold/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-luxury-gold/20">
              <ImageIcon className="w-6 h-6 text-luxury-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">صور المنتج</h3>
              <p className="text-luxury-gold/70 text-sm">
                ارفع {maxImages} صور كحد أقصى (الصورة الأولى ستكون الرئيسية)
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-luxury-gold/30 rounded-xl p-8 text-center hover:border-luxury-gold/50 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="multiple-image-upload"
              disabled={images.length >= maxImages}
            />
            
            <label 
              htmlFor="multiple-image-upload"
              className="cursor-pointer"
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold"></div>
                  ) : (
                    <Upload className="w-8 h-8 text-luxury-gold" />
                  )}
                </div>
                
                <div>
                  <p className="text-white font-semibold">
                    {images.length >= maxImages ? 'تم الوصول للحد الأقصى' : 'اضغط لرفع الصور'}
                  </p>
                  <p className="text-luxury-gold/70 text-sm">
                    {images.length} / {maxImages} صور
                  </p>
                </div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length > 0 && (
        <Card className="bg-luxury-navy/20 border-luxury-gold/20">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">الصور المرفوعة</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                    index === mainImageIndex 
                      ? 'border-luxury-gold shadow-[0_0_20px_rgba(210,176,101,0.3)]' 
                      : 'border-luxury-gold/30 hover:border-luxury-gold/60'
                  }`}
                >
                  <div className="aspect-square">
                    <img
                      src={image.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Main Image Badge */}
                  {index === mainImageIndex && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-luxury-gold text-luxury-navy border-0">
                        <Star className="w-3 h-3 mr-1" />
                        رئيسية
                      </Badge>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleSetMainImage(index)}
                        className="bg-luxury-navy/90 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-navy w-8 h-8"
                        title="تعيين كصورة رئيسية"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleRemoveImage(image.id)}
                        className="bg-red-500/90 border-red-500 text-white hover:bg-red-600 w-8 h-8"
                        title="حذف الصورة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Image Number */}
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-luxury-navy/80 text-luxury-gold border-luxury-gold/30">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Instructions */}
            <div className="mt-6 p-4 bg-luxury-navy/30 rounded-lg border border-luxury-gold/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-luxury-gold/20">
                  <Eye className="w-5 h-5 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">نصائح مهمة:</h4>
                  <ul className="text-luxury-gold/70 text-sm space-y-1">
                    <li>• الصورة الأولى ستظهر كصورة رئيسية في قائمة المنتجات</li>
                    <li>• يمكنك تغيير الصورة الرئيسية بالنقر على أيقونة النجمة</li>
                    <li>• الصور الإضافية ستظهر في معرض صور المنتج</li>
                    <li>• تأكد من جودة الصور ووضوحها</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultipleImageUpload;
