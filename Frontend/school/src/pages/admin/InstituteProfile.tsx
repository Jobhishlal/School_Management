import React, { useState } from "react";
import { InstituteProfile } from "../../components/Form/InstituteProfile/InstituteProfiletInfo";
import { AddressInfo } from "../../components/Form/Address/AddressInfoProps ";
import { CreateAddress, CreateInstituteProfile } from "../../services/authapi";
import { showToast } from "../../utils/toast";

export const CreateInstitutePage: React.FC = () => {

  const [instituteName, setInstituteName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [logo, setLogo] = useState<File[]>([]);


  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const handleSubmit = async () => {
  try {
    // 1️⃣ Create the address first
    const addressResponse = await CreateAddress({ street, city, state, pincode });
    console.log("address", addressResponse);

    const addressId = addressResponse.address._id;
    if (!addressId) {
      console.error("Invalid address ID");
      return;
    }

    // 2️⃣ Prepare FormData for institute creation
    const data = new FormData();
    data.append("instituteName", instituteName);
    data.append("contactInformation", contact);
    data.append("email", email);
    data.append("phone", phone);
    data.append("addressId", addressId);
    data.append("principalName", principalName);


    logo.forEach((file) => data.append("logo", file));

    // 3️⃣ Send request
    const res = await CreateInstituteProfile(
      instituteName,
      contact,
      email,
      phone,
      addressId,
      principalName,
      logo
    );

    console.log("Institute created:", res.logo);
    showToast("Institute created successfully!", "success");
  } catch (error: any) {
    console.error(error);
    showToast("Failed to create institute", "error");
  }
};

  return (
    <div className="p-4">
      <InstituteProfile
        institutename={instituteName}
        setinstitutename={setInstituteName}
        contact={contact}
        setcontact={setContact}
        email={email}
        setemail={setEmail}
        phone={phone}
        setphone={setPhone}
        principlename={principalName}
        setprinciplename={setPrincipalName}
        logo={logo}
        setlogo={setLogo}
        isDark={false}
      />

      <AddressInfo
        street={street}
        setStreet={setStreet}
        city={city}
        setCity={setCity}
        state={state}
        setState={setState}
        pincode={pincode}
        setPincode={setPincode}
        isDark={false}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Create Institute
      </button>
    </div>
  );
};

export default CreateInstitutePage;
