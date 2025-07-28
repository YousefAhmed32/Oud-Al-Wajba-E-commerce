import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="w-full h-full object-cover object-center"
          alt="Account"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-8 text-white text-3xl font-semibold drop-shadow-lg">
          My Account
        </div>
      </div>

      <div className="container mx-auto py-10 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 md:px-8">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t-4 border-gray-700 rounded-2xl p-6 shadow-xl text-white">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="bg-gray-800 border border-gray-700 rounded-xl p-1 mb-6 flex gap-4 w-fit mx-auto">
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 
                           data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                🧾 Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 
                           data-[state=active]:text-white px-6 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                🏠 Address
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="animate-in fade-in duration-300">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="animate-in fade-in duration-300">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
