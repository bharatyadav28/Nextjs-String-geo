import axios from "axios";
import { jwtDecode } from 'jwt-decode';
// import { getError } from "./error";
// import toast from "react-hot-toast";

const BASE_URL = "https://string-geo.adaptable.app";

const api = axios.create({
  baseURL: BASE_URL,
});





export const isTokenExpired = (token) => {
  
    const expirationTimestamp = jwtDecode(token).exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);
  
    return expirationTimestamp < currentTimestamp;
  };
  

  
//  export const handleTokenRefresh = async ({dispatch,refreshToken,accessToken}) => {
//     try {
//       const response = await api.get('/api/user/get-new-access-token', {
//         headers: {
//           Authorization: `Bearer ${refreshToken}`
//         }
//       });
//       console.log("Refresh token:", response);
//       dispatch(setAccessToken(response.data.accessToken));
//       accessToken = response.data.accessToken;
  
//     } catch (error) {
//       console.error('Error refreshing access token:', error);
//       // Handle error (maybe redirect to login)
//     //   navigate('/login');
//     }
//   };
  

export default api;
