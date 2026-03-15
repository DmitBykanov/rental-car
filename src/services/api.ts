import axios from "axios";

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

export const fetchBrands = async (): Promise<string[]> => {
  const { data } = await instance.get<string[]>("/brands");
  return data;
};

export const fetchCars = async ({
  page = 1,
  limit = 12,
  brand,
  rentalPrice,
  minMileage,
  maxMileage,
}: FetchCarsParams) => {
  const { data } = await instance.get("/cars", {
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

export const fetchCarById = async (id: string) => {
  const { data } = await instance.get(`/cars/${id}`);
  return data;
};
