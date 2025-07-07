import axios from 'axios';

export const isReachable = async (url: string): Promise<boolean> => {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      validateStatus: (status) => status < 500 // accept 2xx–4xx as "reachable"
    });
    return true;
  } catch {
    return false;
  }
};