import {
  Estoque,
  UpdateEstoquePayload,
  updateEstoqueSchema,
  useUpdateEstoque,
} from "@/hooks/use-estoques";
import { toast } from "sonner";
import { BaseModal } from "../custom/base-modal";
import { DynamicForm } from "../custom/dynamic-form";

export function AdjustStockModal({
  isOpen,
  onClose,
  estoque,
}: {
  isOpen: boolean;
  onClose: () => void;
  estoque: Estoque | null;
}) {
  const updateEstoqueMutation = useUpdateEstoque();

  const formFields = [
    {
      name: "quantidade" as const,
      label: "Quantidade",
      placeholder: "Quantidade no estoque",
      component: "input" as const,
    },
  ];

  const handleSubmit = (data: UpdateEstoquePayload) => {
    if (!estoque?.id) return;
    updateEstoqueMutation.mutate(
      { ...data, id: estoque.id },
      {
        onSuccess: () => {
          toast.success("Estoque atualizado com sucesso");
          onClose();
        },
        onError: (error) => {
          toast.error(`Erro ao atualizar o estoque: ${error.message}`);
        },
      },
    );
  };

  return (
    <BaseModal
      title="Ajustar Estoque"
      description="Ajuste o estoque real do produto"
      isOpen={isOpen}
      onClose={onClose}
    >
      {estoque && (
        <DynamicForm
          schema={updateEstoqueSchema}
          onSubmit={handleSubmit}
          defaultValues={{
            id: estoque.id,
            quantidade: estoque.quantidade,
          }}
          fields={formFields}
          submitButtonText="Ajustar Estoque"
          isSubmitting={updateEstoqueMutation.isPending}
        />
      )}
    </BaseModal>
  );
}
