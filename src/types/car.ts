export interface Car {
  id: string;
  year: number;
  brand: string;
  model: string;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engineSize: string;
  accessories: string[];
  functionalities: string[];
  rentalPrice: string; // В JSON це рядок "40"
  rentalCompany: string;
  address: string;
  rentalConditions: string[];
  mileage: number;
}
