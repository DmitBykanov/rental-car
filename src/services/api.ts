import axios, { AxiosResponse } from "axios";
import { Car } from "../types/car";

const instance = axios.create({
  baseURL: "https://car-rental-api.goit.global",
});

interface FetchCarsParams {
  page?: number;
  limit?: number;
  brand?: string;
  price?: string; 
  minMileage?: string | number;
  maxMileage?: string | number;
}

export interface CarsResponse {
  cars: Car[];
  total: number;
  page: number;
  totalPages: number;
}

export const fetchBrands = async (): Promise<string[]> => {
  const { data }: AxiosResponse<string[]> = await instance.get("/brands");
  return data;
};

export const fetchCars = async (params: FetchCarsParams): Promise<CarsResponse> => {
  const { data } = await instance.get<CarsResponse>("/cars", {
    params: {
      page: 1,
      limit: 12,

      ...params,
      brand: params.brand || undefined,
      rentalPrice: params.price || undefined,
      minMileage: params.minMileage || undefined,
      maxMileage: params.maxMileage || undefined,
    },
  });
  return data;
};

export const fetchCarById = async (id: string): Promise<Car> => {
  const { data }: AxiosResponse<Car> = await instance.get(`/cars/${id}`);
  return data;
};