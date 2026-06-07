import api from "@/api/axios";

export const getGroupSummary =
  async (
    groupId,
    token
  ) => {

    const response =
      await api.get(
        `/group/${groupId}/summary`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };