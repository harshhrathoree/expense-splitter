import api from "@/api/axios";

export const getSettlements =
  async (
    groupId,
    token
  ) => {

    const response =
      await api.get(
        `/group/${groupId}/settlements`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const createSettlement =
  async (
    groupId,
    settlementData,
    token
  ) => {

    const response =
      await api.post(
        `/group/${groupId}/settlements`,
        settlementData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };



  // Add these two functions to your existing settlement.service.js file

export const deleteSettlement = async (settlementId, accessToken) => {
    const response = await fetch(
      `http://localhost:3000/api/settlement/${settlementId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to delete settlement");
    }
  
    return response.json();
  };
  
  export const updateSettlement = async (settlementId, payload, accessToken) => {
    const response = await fetch(
      `http://localhost:3000/api/settlement/${settlementId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        // payload shape:
        // {
        //   fromUser: userId string,
        //   toUser: userId string,
        //   amount: number
        // }
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to update settlement");
    }
  
    return response.json();
  };