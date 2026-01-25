"use-client";

import {
  CreateEstoqueMovimentacaoPayload,
  createEstoqueMovimentacaoSchema,
  useCreateEstoqueMovimentacao,
} from "@/hooks/use-estoque-movimentacoes";
import { Estoque } from "@/hooks/use-estoques";
import { toast } from "sonner";
import { BaseModal } from "../custom/base-modal";
import { DynamicForm } from "../custom/dynamic-form";

export function AddEstoqueMovimentacaoModal({
  isOpen,
  onClose,
  estoque,
}: {
  isOpen: boolean;
  onClose: () => void;
  estoque: Estoque | null;
}) {
  const createEstoqueMovimentacaoMutation = useCreateEstoqueMovimentacao();

  const formFields = [
    {
      name: "produto_id" as const,
      label: "Produto",
      placeholder: "ID do produto",
      component: "input" as const,
      disabled: true,
    },
    {
      name: "quantidade" as const,
      label: "Quantidade",
      placeholder: "Quantidade movimentada",
      component: "input" as const,
    },
    {
      name: "tipo_movimentacao" as const,
      label: "Tipo Movimentação",
      placeholder: "Tipo da Movimentação",
      component: "select" as const,
      options: [
        { label: "Entrada", value: "entrada" },
        { label: "Saída", value: "saida" },
      ],
    },
  ];

  const handleSubmit = (data: CreateEstoqueMovimentacaoPayload) => {
    createEstoqueMovimentacaoMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Movimentação de estoque criada com sucesso!");
        onClose();
      },
      onError: (error) => {
        toast.error(`Erro ao criar movimentação de estoque: ${error.message}`);
      },
    });
  };

  return (
    <BaseModal
      title="Nova Movimentação de Estoque"
      description="Preencha os dados para criar uma movimentação de estoque."
      isOpen={isOpen}
      onClose={onClose}
    >
      <DynamicForm
        schema={createEstoqueMovimentacaoSchema}
        onSubmit={handleSubmit}
        fields={formFields}
        defaultValues={{
          produto_id: estoque?.produto_id,
          quantidade: "",
          tipo_movimentacao: "entrada",
        }}
        submitButtonText="Criar Movimentação Estoque"
        isSubmitting={createEstoqueMovimentacaoMutation.isPending}
      />
    </BaseModal>
  );
}
