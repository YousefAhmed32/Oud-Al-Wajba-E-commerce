import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`transition-all duration-300 ease-in-out rounded-2xl cursor-pointer 
        border-[2.5px] backdrop-blur-md p-1 overflow-hidden 
        ${isSelected 
          ? 'border-yellow-400 bg-gradient-to-br from-yellow-950/80 to-black scale-[1.03] ring-2 ring-yellow-500' 
          : 'border-gray-800 bg-gradient-to-br from-gray-900/80 to-black hover:border-yellow-400 hover:scale-[1.01]'
        } text-yellow-100 shadow-xl hover:shadow-2xl`}
    >
      <CardContent className="space-y-3 px-6 py-5">
        <div className="text-sm">
          <span className="font-semibold text-yellow-400">📍 Address:</span> {addressInfo?.address}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-yellow-400">🏙 City:</span> {addressInfo?.city}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-yellow-400">📮 Pincode:</span> {addressInfo?.pincode}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-yellow-400">📞 Phone:</span> {addressInfo?.phone}
        </div>
        <div className="text-sm">
          <span className="font-semibold text-yellow-400">📝 Notes:</span> {addressInfo?.notes || '—'}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-5 pt-1 flex justify-end gap-3">
        <Button 
          onClick={() => handleEditAddress(addressInfo)} 
          className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        >
          Edit
        </Button>
        <Button 
          onClick={() => handleDeleteAddress(addressInfo)} 
          className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
