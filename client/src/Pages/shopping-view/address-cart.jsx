import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Building2, Hash, Phone, FileText, Edit2, Trash2, CheckCircle2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  const handleCardClick = (e) => {
    // Prevent card click when clicking buttons
    if (e.target.closest('button')) {
      return;
    }
    if (setCurrentSelectedAddress) {
      setCurrentSelectedAddress(addressInfo);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-2xl cursor-pointer
        transition-all duration-300 ease-out
        border-2 backdrop-blur-sm
        ${
          isSelected
            ? 'border-primary bg-gradient-to-br from-primary/20 via-primary/10 to-card scale-[1.02] shadow-2xl shadow-primary/20 ring-2 ring-primary/30'
            : 'border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/80 hover:border-primary/50 hover:scale-[1.01] hover:shadow-xl shadow-lg'
        }
        dark:from-card dark:via-card/90 dark:to-card
        hover:bg-gradient-to-br hover:from-card hover:via-card/90 hover:to-card
        `}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="p-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
        </div>
      )}

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Address Field */}
        <div className="flex items-start gap-3 group/item">
          <div className={`p-2 rounded-lg transition-colors duration-200 ${
            isSelected ? 'bg-primary/20' : 'bg-muted/30 group-hover/item:bg-primary/10'
          }`}>
            <MapPin className={`h-4 w-4 transition-colors duration-200 ${
              isSelected ? 'text-primary' : 'text-muted-foreground group-hover/item:text-primary'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Address
            </div>
            <div className="text-sm font-medium text-foreground break-words">
              {addressInfo?.address}
            </div>
          </div>
        </div>

        {/* City Field */}
        <div className="flex items-start gap-3 group/item">
          <div className={`p-2 rounded-lg transition-colors duration-200 ${
            isSelected ? 'bg-primary/20' : 'bg-muted/30 group-hover/item:bg-primary/10'
          }`}>
            <Building2 className={`h-4 w-4 transition-colors duration-200 ${
              isSelected ? 'text-primary' : 'text-muted-foreground group-hover/item:text-primary'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              City
            </div>
            <div className="text-sm font-medium text-foreground">
              {addressInfo?.city}
            </div>
          </div>
        </div>

        {/* Pincode Field */}
        <div className="flex items-start gap-3 group/item">
          <div className={`p-2 rounded-lg transition-colors duration-200 ${
            isSelected ? 'bg-primary/20' : 'bg-muted/30 group-hover/item:bg-primary/10'
          }`}>
            <Hash className={`h-4 w-4 transition-colors duration-200 ${
              isSelected ? 'text-primary' : 'text-muted-foreground group-hover/item:text-primary'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Pincode
            </div>
            <div className="text-sm font-medium text-foreground">
              {addressInfo?.pincode}
            </div>
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex items-start gap-3 group/item">
          <div className={`p-2 rounded-lg transition-colors duration-200 ${
            isSelected ? 'bg-primary/20' : 'bg-muted/30 group-hover/item:bg-primary/10'
          }`}>
            <Phone className={`h-4 w-4 transition-colors duration-200 ${
              isSelected ? 'text-primary' : 'text-muted-foreground group-hover/item:text-primary'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Phone
            </div>
            <div className="text-sm font-medium text-foreground">
              {addressInfo?.phone}
            </div>
          </div>
        </div>

        {/* Notes Field */}
        {addressInfo?.notes && (
          <div className="flex items-start gap-3 group/item pt-2 border-t border-border/30">
            <div className={`p-2 rounded-lg transition-colors duration-200 ${
              isSelected ? 'bg-primary/20' : 'bg-muted/30 group-hover/item:bg-primary/10'
            }`}>
              <FileText className={`h-4 w-4 transition-colors duration-200 ${
                isSelected ? 'text-primary' : 'text-muted-foreground group-hover/item:text-primary'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Notes
              </div>
              <div className="text-sm font-medium text-foreground break-words">
                {addressInfo?.notes}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="flex-1 sm:flex-none h-10 px-4 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-primary to-primary/90
            hover:from-primary/90 hover:to-primary
            text-primary-foreground
            shadow-md shadow-primary/20
            hover:shadow-lg hover:shadow-primary/30
            transition-all duration-300
            flex items-center justify-center gap-2
            group/btn"
        >
          <Edit2 className="h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-300" />
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          variant="outline"
          className="flex-1 sm:flex-none h-10 px-4 rounded-xl font-semibold text-sm
            border-2 border-destructive/30
            bg-destructive/10 hover:bg-destructive/20
            text-destructive hover:text-destructive
            hover:border-destructive/50
            transition-all duration-300
            flex items-center justify-center gap-2
            group/btn"
        >
          <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
