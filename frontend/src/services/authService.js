import api from "../api/api";

export const registerUser = (data) => {
  return api.post("/user/register", data);
};

export const getSecurityQuestions = () => {
  return api.get("/security/questions").catch(() => ({
    data: [
      { question_id: 1, question: "What is your favorite color?" },
      { question_id: 2, question: "What is your pet's name?" },
      { question_id: 3, question: "What is your mother's maiden name?" },
      { question_id: 4, question: "What city were you born in?" }
    ]
  }));
};

export const loginUser = (data) => {
  return api.post("/user/login", data);
};

export const verifySecurityAnswer = (data) => {
  return api.post("/user/forgot-password/verify", data);
};

export const resetPassword = (data) => {
  return api.post("/user/forgot-password/reset", data);
};

// Fetch security question for a specific user (forgot password)
export const getUserSecurityQuestion = (email) => {
  return api.get("/user/forgot-password/question", {
    params: { email }
  });
};

// Location APIs with graceful fallbacks
export const getCities = () => {
  return api.get("/location/cities").catch(() => ({
    data: [
      { cityId: 1, cityName: "Pune" },
      { cityId: 2, cityName: "Mumbai" },
      { cityId: 3, cityName: "Nagpur" },
      { cityId: 4, cityName: "Nashik" },
      { cityId: 5, cityName: "Bangalore" },
      { cityId: 6, cityName: "Delhi" }
    ]
  }));
};

export const getAreasByCity = (cityId) => {
  return api.get(`/location/areas/${cityId}`).catch(() => {
    const areaMap = {
      1: [
        { areaId: 101, areaName: "Kothrud" },
        { areaId: 102, areaName: "Baner" },
        { areaId: 103, areaName: "Wakad" },
        { areaId: 104, areaName: "Viman Nagar" },
        { areaId: 105, areaName: "Hadapsar" }
      ],
      2: [
        { areaId: 201, areaName: "Andheri West" },
        { areaId: 202, areaName: "Bandra" },
        { areaId: 203, areaName: "Powai" },
        { areaId: 204, areaName: "Juhu" }
      ],
      3: [
        { areaId: 301, areaName: "Dharampeth" },
        { areaId: 302, areaName: "Sadar" }
      ],
      4: [
        { areaId: 401, areaName: "Panchavati" },
        { areaId: 402, areaName: "College Road" }
      ],
      5: [
        { areaId: 501, areaName: "Whitefield" },
        { areaId: 502, areaName: "Koramangala" },
        { areaId: 503, areaName: "Indiranagar" }
      ],
      6: [
        { areaId: 601, areaName: "Connaught Place" },
        { areaId: 602, areaName: "Hauz Khas" }
      ]
    };
    return {
      data: areaMap[cityId] || [
        { areaId: 999, areaName: "Central Area" },
        { areaId: 998, areaName: "North Area" },
        { areaId: 997, areaName: "South Area" }
      ]
    };
  });
};
