import api from "@/api/axios";

export const getGroups =
  async (token) => {
    const response =
      await api.get("/group", {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });

    return response.data;
  };

  export const createGroup = async (
    groupData,
    token
  ) => {
    const response = await api.post(
      "/group",
      groupData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response.data;
  };


  export const getGroupById =
  async (
    groupId,
    token
  ) => {
    const response =
      await api.get(
        `/group/${groupId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };


  export const addMember = async (
    groupId,
    mobileNumber,
    token
  ) => {
    const response = await api.post(
      `/group/${groupId}/members`,
      {
        mobileNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response.data;
  };

  export const leaveGroup = async (groupId, token) => {
    const response = await api.post(
      `/group/${groupId}/leave`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  export const deleteGroup = async (
    groupId,
    accessToken
  ) => {
    const response = await api.delete(
      `/group/${groupId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    return response.data;
  };

  export const removeMember = async (groupId, memberId, token) => {
    const response = await api.delete(
      `/group/${groupId}/members/${memberId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };