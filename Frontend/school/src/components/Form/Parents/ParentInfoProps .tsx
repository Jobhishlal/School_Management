import { TextInput } from "../TextInput";
import { SelectInput } from "../SelectInput";

interface ParentInfoProps {
  parentName: string;
  setParentName: (val: string) => void;
  whatsappNumber: string;
  setWhatsappNumber: (val: string) => void;
  parentEmail: string;
  setParentEmail: (val: string) => void;
  parentRelationship: "Son" | "Daughter";
  setParentRelationship: (val: "Son" | "Daughter") => void;
  isDark?: boolean
}

export const ParentInfo: React.FC<ParentInfoProps> = ({
  parentName,
  setParentName,
  whatsappNumber,
  setWhatsappNumber,
  parentEmail,
  setParentEmail,
  parentRelationship,
  setParentRelationship,
  isDark
}) => (
  <>
    <h3 className="font-semibold text-lg pt-4">Parent Info</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInput label="Parent Name" value={parentName} onChange={setParentName} isDark={isDark} />
      <TextInput label="WhatsApp Number" value={whatsappNumber} onChange={setWhatsappNumber} isDark={isDark} />
      <TextInput label="Parent Email" value={parentEmail} onChange={setParentEmail} type="email" isDark={isDark} />
      <SelectInput<"Son" | "Daughter">
        label="Relationship"
        value={parentRelationship}
        onChange={(val) => setParentRelationship(val as "Son" | "Daughter")}
        options={["Son", "Daughter"]}
        isDark={isDark}
      />
    </div>
  </>
);
