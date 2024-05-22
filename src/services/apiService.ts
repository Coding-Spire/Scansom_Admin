import axios, { AxiosResponse, Method } from 'axios';

interface ApiConfig {
  method: Method;
  url: string;
  data?: any;
  params?: any;
}

export const apiService = async ({ method, url, data, params }: ApiConfig): Promise<AxiosResponse<any>> => {
  try {
    const response = await axios({
      method,
      url,
      data,
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};