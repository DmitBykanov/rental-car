export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat("uk-UA", {
    useGrouping: true,
  })
    .format(mileage)
    .replace(/\u00A0/g, " ");
};
