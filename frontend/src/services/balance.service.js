import api from "@/api/axios";

export const getGroupBalances =
  async (
    groupId,
    token
  ) => {

    const response =
      await api.get(
        `/group/${groupId}/balances`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };