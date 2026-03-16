export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
  })
    .format(mileage)
    .replace(/\u00A0/g, " ");
};
