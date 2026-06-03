import { http } from "@/shared/api";
import type {
  CreateUserTextDto,
  GetUserTextsParams,
  UpdateUserTextDto,
  UserText,
  UserTextsListResponse,
} from "./types";

export const userTextApi = {
  async create(dto: CreateUserTextDto): Promise<UserText> {
    const { data } = await http.post<UserText>("/user-texts", dto);
    return data;
  },

  async list(params?: GetUserTextsParams): Promise<UserTextsListResponse> {
    const { data } = await http.get<UserTextsListResponse>("/user-texts", { params });
    return data;
  },

  async getById(id: string): Promise<UserText> {
    const { data } = await http.get<UserText>(`/user-texts/${id}`);
    return data;
  },

  async update(id: string, dto: UpdateUserTextDto): Promise<UserText> {
    const { data } = await http.patch<UserText>(`/user-texts/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await http.delete(`/user-texts/${id}`);
  },
};
