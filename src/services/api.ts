import axios, { AxiosResponse } from "axios";
import { Car } from "../types/car";

const instance = axios.create({
  baseURL: "https://car-rental-api.goit.global",
});

interface FetchCarsParams {
  page?: number;
  limit?: number;
  brand?: string;
  rentalPrice?: string;
  minMileage?: string | number;
  maxMileage?: string | number;
}

export interface CarsResponse {
  cars: Car[];
  total: number;
}
export const fetchBrands = async (): Promise<string[]> => {
  const { data }: AxiosResponse<string[]> =
    await instance.get<string[]>("/brands");
  return data;
};

export const fetchCars = async ({
  page = 1,
  limit = 12,
  brand,
  rentalPrice,
  minMileage,
  maxMileage,
}: FetchCarsParams): Promise<CarsResponse> => {
  const { data }: AxiosResponse<CarsResponse> = await instance.get("/cars", {
    params: {
      page,
      limit,
      brand: brand || undefined,
      rentalPrice: rentalPrice || undefined,
      minMileage: minMileage || undefined,
      maxMileage: maxMileage || undefined,
    },
  });
  return data;
};

export const fetchCarById = async (id: string): Promise<Car> => {
  const { data }: AxiosResponse<Car> = await instance.get<Car>(`/cars/${id}`);
  return data;
};
