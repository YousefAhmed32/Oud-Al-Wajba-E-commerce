import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import DynamicSelect from "../admin-view/dynamic-select";
import BrandSelect from "../admin-view/brand-select";
import { Calendar } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  labelClassName = "text-muted-foreground",
  inputClassName = "bg-background border-border text-foreground placeholder:text-muted-foreground"
}) {
  function renderInputByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";
    const customInputClassName = getControlItem.inputClassName || inputClassName;

    switch (getControlItem.componentType) {
      case "input":
        // Special handling for date input with custom calendar icon
        if (getControlItem.type === "date") {
          element = (
            <div className="relative">
              <Input
                name={getControlItem.name}
                placeholder={getControlItem.placeholder}
                id={getControlItem.name}
                type={getControlItem.type}
                value={value}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [getControlItem.name]: e.target.value,
                  })
                }
                className={`${customInputClassName} pr-10`}
                min={getControlItem.min}
                max={getControlItem.max}
                required={getControlItem.required}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const input = document.getElementById(getControlItem.name);
                  if (input && typeof input.showPicker === 'function') {
                    input.showPicker();
                  } else {
                    input?.focus();
                    input?.click();
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors z-10 p-1 rounded hover:bg-muted/50"
                tabIndex={-1}
                title="اختر التاريخ"
              >
                <Calendar className="h-5 w-5" />
              </button>
            </div>
          );
        } else {
          element = (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: e.target.value,
                })
              }
              className={customInputClassName}
              min={getControlItem.min}
              max={getControlItem.max}
              required={getControlItem.required}
            />
          );
        }
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className={customInputClassName}>
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {Array.isArray(getControlItem.options) &&
                getControlItem.options.map((option) => (
                  <SelectItem 
                    key={option.id} 
                    value={option.id}
                    className="text-foreground hover:bg-muted focus:bg-muted"
                  >
                    {option.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            className={customInputClassName}
            required={getControlItem.required}
          />
        );
        break;

      case "dynamic-select":
        element = (
          <DynamicSelect
            label={getControlItem.label}
            name={getControlItem.name}
            value={value}
            onChange={(newValue) =>
              setFormData({
                ...formData,
                [getControlItem.name]: newValue,
              })
            }
            options={getControlItem.options || []}
            placeholder={getControlItem.placeholder}
            required={getControlItem.required}
          />
        );
        break;

      case "brand-select":
        element = (
          <BrandSelect
            label={getControlItem.label}
            value={value}
            onChange={(newValue) =>
              setFormData({
                ...formData,
                [getControlItem.name]: newValue,
              })
            }
            required={getControlItem.required}
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
            className={customInputClassName}
            min={getControlItem.min}
            max={getControlItem.max}
            required={getControlItem.required}
          />
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {Array.isArray(formControls) &&
          formControls.map((controlItem) => (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              <label
                htmlFor={controlItem.name}
                className={`mb-1 text-sm font-medium ${labelClassName} ${controlItem.labelClassName || ''}`}
              >
                {controlItem.label}
                {controlItem.required && <span className="text-destructive mr-1">*</span>}
              </label>
              {renderInputByComponentType(controlItem)}
            </div>
          ))}
      </div>
      <Button
        disabled={isBtnDisabled}
        type="submit"
        className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300"
      >
        {buttonText || "إرسال"}
      </Button>
    </form>
  );
}



export default CommonForm;
