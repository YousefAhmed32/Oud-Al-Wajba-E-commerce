import { addressFormControls } from "@/config";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "@/store/shop/address-slice.js";
import AddressCard from "@/Pages/shopping-view/address-cart";
import { useToast } from "@/hooks/use-toast";

function Address({ setCurrentSelectedAddress, selectedId }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const [currentEditId, setCurrentEditId] = useState(null);
  const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
  };
  const [formData, setFormData] = useState(initialAddressFormData);

  useEffect(() => {
    if (user?.id) dispatch(fetchAllAddress(user.id));
  }, [dispatch, user]);

  const handleMessageAddress = (e) => {
    e.preventDefault();

    if (addressList.length >= 3 && currentEditId === null) {
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });
      return;
    }

    const action = currentEditId
      ? editAddress({
          userId: user.id,
          addressId: currentEditId,
          formData,
        })
      : addNewAddress({
          ...formData,
          userId: user.id,
        });

    dispatch(action).then((res) => {
      if (res.payload.success) {
        dispatch(fetchAllAddress(user.id));
        setFormData(initialAddressFormData);
        setCurrentEditId(null);
        toast({
          title: currentEditId ? "Address updated successfully" : "Address added successfully",
        });
      }
    });
  };

  const handleDeleteAddress = (address) => {
    dispatch(deleteAddress({ userId: user.id, addressId: address._id })).then((res) => {
      if (res.payload.success) {
        dispatch(fetchAllAddress(user.id));
        setFormData(initialAddressFormData);
        toast({ title: "Address deleted successfully" });
      }
    });
  };

  const handleEditAddress = (address) => {
    setCurrentEditId(address?._id);
    setFormData({
      address: address?.address,
      city: address?.city,
      phone: address?.phone,
      pincode: address?.pincode,
      notes: address?.notes,
    });
  };

  const isFormValid = () => {
    return Object.values(formData).every((val) => val.trim() !== "");
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 via-black to-slate-800 border border-slate-700 text-white shadow-2xl rounded-2xl">
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-yellow-400 text-2xl font-bold tracking-wide">
          {currentEditId ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 p-6">
        {addressList?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Your Addresses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addressList.map((item) => (
                <AddressCard
                  key={item._id}
                  selectedId={selectedId}
                  handleDeleteAddress={handleDeleteAddress}
                  handleEditAddress={handleEditAddress}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                  addressInfo={item}
                />
              ))}
            </div>
          </section>
        )}

        <section className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-yellow-300 mb-4">
            {currentEditId ? "Update Address Info" : "Fill Address Form"}
          </h3>
          <CommonForm
          
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditId ? "Edit" : "Add"}
            onSubmit={handleMessageAddress}
            isBtnDisabled={!isFormValid()}
            labelClassName="text-white"
          />
        </section>
      </CardContent>
    </Card>
  );
}

export default Address;
