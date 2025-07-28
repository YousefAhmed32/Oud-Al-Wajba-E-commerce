import { filterOptions } from "@/config";
import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@radix-ui/react-label";
import { Fragment } from "react";
import { Separator } from "@/components/ui/separator";

function ProductFiler({ filters, handleFilters }) {
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold capitalize">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={`${keyItem}-${option.id}`}
                    className="flex items-center gap-2 font-medium"
                  >
                    {/* <Checkbox 
                    checked={
                      filters && Object.keys(filters).length > 0 &&
                      filters[keyItem] && filters[keyItem].indexOf(option.id) > -1
                    }
                    
                    onCheckedChange={()=>handleFilters(keyItem,option.id)}  /> */}

                    <Checkbox
                      checked={
                        filters &&
                        Object.keys(filters).length > 0 &&
                        filters[keyItem] &&
                        filters[keyItem].indexOf(option.id) > -1
                      }
                      onCheckedChange={() => handleFilters(keyItem, option.id)}
                    />

                    {/* <Checkbox
                      checked={
                        !!(
                          filters[keyItem] &&
                          filters[keyItem].includes(option.id)
                        )
                      }
                      onCheckedChange={() => handleFilters(keyItem, option.id)}
                    /> */}


                    
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFiler;
