import { http } from "@/shared/api";
import type {
  AnalyzeWordResult,
  BulkMorphRulesDto,
  CreateMorphRuleDto,
  FetchMorphRulesQuery,
  ImportMorphRulesResult,
  MorphRule,
  MorphRuleListResponse,
  MorphRuleStats,
  UpdateMorphRuleDto,
} from "./types";

export const morphRuleApi = {
  stats: () =>
    http.get<MorphRuleStats>("/admin/morphology/rules/stats").then((r) => r.data),

  list: (query?: FetchMorphRulesQuery) =>
    http
      .get<MorphRuleListResponse>("/admin/morphology/rules", { params: query })
      .then((r) => r.data),

  create: (dto: CreateMorphRuleDto) =>
    http.post<MorphRule>("/admin/morphology/rules", dto).then((r) => r.data),

  update: (id: string, dto: UpdateMorphRuleDto) =>
    http.patch<MorphRule>(`/admin/morphology/rules/${id}`, dto).then((r) => r.data),

  remove: (id: string) =>
    http.delete(`/admin/morphology/rules/${id}`).then((r) => r.data),

  bulkActivate: (dto: BulkMorphRulesDto) =>
    http
      .post<{ updated: number }>("/admin/morphology/rules/bulk/activate", dto)
      .then((r) => r.data),

  bulkDeactivate: (dto: BulkMorphRulesDto) =>
    http
      .post<{ updated: number }>("/admin/morphology/rules/bulk/deactivate", dto)
      .then((r) => r.data),

  bulkDelete: (dto: BulkMorphRulesDto) =>
    http
      .delete<{ deleted: number }>("/admin/morphology/rules/bulk", { data: dto })
      .then((r) => r.data),

  importRules: (file: File, overwrite = false) => {
    const form = new FormData();
    form.append("file", file);
    return http
      .post<ImportMorphRulesResult>(
        `/admin/morphology/rules/import?overwrite=${overwrite}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      )
      .then((r) => r.data);
  },

  analyzeWord: (word: string) =>
    http
      .post<AnalyzeWordResult>("/admin/morphology/analyze", { word })
      .then((r) => r.data),
};
