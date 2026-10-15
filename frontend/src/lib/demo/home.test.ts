import { describe, expect, it } from "vitest";
import { homeTasks } from "@/lib/demo/home";
import { MAPPING_FILTERS } from "@/lib/demo/mapping";
import { ORDER_FILTERS } from "@/lib/demo/orders";
import { SUPPORT_FILTERS } from "@/lib/demo/support";

describe("tarefas do Início", () => {
  it("todo contador leva a uma lista que existe", () => {
    const valid = new Set([
      ...ORDER_FILTERS.map((f) => `/pedidos?filtro=${f.value}`),
      ...SUPPORT_FILTERS.map((f) => `/atendimento?filtro=${f.value}`),
      ...MAPPING_FILTERS.map((f) => `/produtos/mapeamento?filtro=${f.value}`),
      "/custos",
    ]);
    for (const task of homeTasks().flatMap((g) => g.tasks)) {
      expect(valid.has(task.href), task.label).toBe(true);
    }
  });
});
