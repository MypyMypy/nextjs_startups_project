"use client";

import { Input } from "@/src/shared/ui/Input";
import { Textarea } from "@/src/shared/ui/Textarea";
import { useActionState, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/src/shared/ui/Button";
import { SendIcon } from "lucide-react";
import { formSchema } from "../lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { StartupFormDataI } from "./StartupForm.types";
import { createPitch } from "../api/actions";

export const StartupForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (
    state: StartupFormDataI,
    formData: FormData
  ) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(state, formData, pitch);

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Startup created",
        });
      }

      router.push(`/startup/${result._id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Please check your inputs",
        variant: "destructive",
      });

      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);

        return { ...state, error: "validation failed", status: "ERROR" };
      }

      return { ...state, error: "an unexpected error", status: "ERROR" };
    } finally {
    }

    return state;
  };

  const [state, formAction, isPending] = useActionState<
    StartupFormDataI,
    FormData
  >(handleFormSubmit, {
    values: {
      title: "",
      description: "",
      category: "",
      link: "",
      pitch: "",
    },
    error: "",
    status: "",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />
        {errors?.title && <p className="startup-form_error">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_input"
          required
          placeholder="Startup description"
        />
        {errors?.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup category"
        />
        {errors?.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup link"
        />
        {errors?.link && <p className="startup-form_error">{errors.link}</p>}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value ?? "")}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{ placeholder: "Describe your idea" }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors?.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="startup-form_btn text-white"
      >
        {isPending ? "Submitting..." : "Submit"}{" "}
        <SendIcon className="size-6 ml-2" />
      </Button>
    </form>
  );
};
