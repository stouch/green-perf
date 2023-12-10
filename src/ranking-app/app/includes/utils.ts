export const roundDecimal = (n: number, d: number = 3) => {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
};

// Delta en pourcents entre `from` et `to`
export const deltaBetweenInPercent = ({
  from,
  to,
}: {
  from: number;
  to: number;
}) => {
  return roundDecimal(-(1 - to / from) * 100, 2);
};
