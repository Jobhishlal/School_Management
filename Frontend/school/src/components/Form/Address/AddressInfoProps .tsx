
import { TextInput } from "../TextInput";




interface AddressInfoProps {
  street: string;
  setStreet: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
  isDark?:boolean
}

export const AddressInfo: React.FC<AddressInfoProps> = ({
  street,
  setStreet,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  isDark
}) => (
  <>
    <h3 className="font-semibold text-lg pt-4">Address Info</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput label="Street" value={street} onChange={setStreet}  isDark={isDark}/>
      <TextInput label="City" value={city} onChange={setCity} isDark={isDark} />
      <TextInput label="State" value={state} onChange={setState}  isDark={isDark}/>
      <TextInput label="Pincode" value={pincode} onChange={setPincode} isDark={isDark}  />
    </div>
  </>
);
