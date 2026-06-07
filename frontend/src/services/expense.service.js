import api from "@/api/axios";

export const getGroupExpenses =
  async (
    groupId,
    token
  ) => {

    const response =
      await api.get(
        `/group/${groupId}/expenses`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };


  export const createExpense =
  async (
    groupId,
    expenseData,
    token
  ) => {

    const response =
      await api.post(
        `/group/${groupId}/expenses`,
        expenseData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };
// Add these two functions to your existing expense.service.js file
export const deleteExpense =
  async (
    expenseId,
    token
  ) => {
 
    const response =
      await api.delete(
        `/expense/${expenseId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
 
    return response.data;
  };
 
export const updateExpense =
  async (
    expenseId,
    payload,
    token
  ) => {
 
    const response =
      await api.put(
        `/expense/${expenseId}`,
        payload,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
 
    return response.data;
  };