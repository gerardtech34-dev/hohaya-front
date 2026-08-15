import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

export function handleApiError<T extends FieldValues>(error: unknown, setError?: UseFormSetError<T>) {
  if (error instanceof ApiError) {
    if (error.errors && setError) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        setError(field as Path<T>, { message: messages[0] });
      });
    }
    toast.error(error.message);
    return;
  }
  toast.error("Une erreur inattendue est survenue.");
}
