import api from "@/api/axios";

export const searchUserByMobile =
  async (
    mobileNumber,
    token
  ) => {

    const response =
      await api.get(
        `/user/search?mobileNumber=${mobileNumber}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };