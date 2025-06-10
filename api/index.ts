const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const login = async (registration_number: string, password: string) => {
  try {
    const req = await fetch(`${API_URL}/auth/login/mobile`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registration_number, password }),
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getStoreBySalePerson = async (
  page: number,
  token: string | null,
) => {
  try {
    const req = await fetch(
      `${API_URL}/stores/sale/list-store-created?page=${page}&per_page=10`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await req.json();
    return {
      data: data?.data,
      nextCursor: data?.next_page_url
        ? Number(data?.next_page_url?.split("?page=")[1])
        : undefined,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllStoreByPerson = async (token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/stores/without/pagination`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const uploadFile = async (data: any, token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/stores/add-picture`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    const response = await req.json();
    return response?.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateUserProfile = async (
  data: any,
  userId: number,
  token: string | null,
) => {
  try {
    const req = await fetch(`${API_URL}/users/${userId}/update`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data }),
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addStore = async (data: any, token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/stores/add`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data }),
    });
    const response = await req.json();
    return {
      status: req.status,
      response,
    };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getZoneById = async (zoneId: number, token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/zones/${zoneId}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCommunes = async (token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/zones/select/list`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getQuartier = async (token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/quartier/select/list`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getVisitByDateAndStoreId = async (
  date: string,
  storeId: string,
  token: string | null,
) => {
  try {
    const req = await fetch(
      `${API_URL}/visits/historyByCommercialInDateAndStoreId/${date}/${storeId}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getVisibilityList = async (token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/visibilities`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getTypeVisitList = async (token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/type-visits`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const addVisit = async (data: any, token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/visits/add`, {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data }),
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getAllVisitByDate = async (
  date: string | undefined,
  token: string | null,
  page: number,
) => {
  try {
    const req = await fetch(
      `${API_URL}/visits/historyByCommercialInDate/${date}?page=${page}&per_page=20`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await req.json();
    return data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getStoreById = async (storeId: string, token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/stores/${storeId}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCoworkers = async (teamId: string, token: string | null) => {
  try {
    const req = await fetch(`${API_URL}/teams-users-role/${teamId}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getDistanceMatrix = async (origin: any, dest: any) => {
  try {
    const req = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?mode=driving&destinations=${dest.lat},${dest.long}&origins=${origin.lat},${origin.long}&key=${process.env.EXPO_PUBLIC_MAPS_API}`,
    );
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const uploadCldFile = async (data: any, cloudName: string) => {
  const req = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `${process.env.EXPO_PUBLIC_CLOUD_SECRET}`,
      },
      body: data,
    },
  );
  const response = await req.json();
  return {
    code: req.status,
    file: response?.secure_url,
  };
};

export const editPassword = async (data: any, token: string | null) => {
  try {
    const req = await fetch(
      `${API_URL}/auth/reset-password/WithTheOldPassword`,
      {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data }),
      },
    );
    const response = await req.json();
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};
