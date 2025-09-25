interface FormLayoutProps {
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  children: React.ReactNode;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  onSubmit,
  children,
  isSubmitting = false,
  disabled = false,
}) => {
  return (
    <form
      className="flex flex-col gap-6"
     onSubmit={(e) => onSubmit(e)} 
    >
      {children}

    
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
