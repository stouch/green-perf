export const roundDecimal = (n: number, d: number = 3) => {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
};

// Delta en pourcents entre `from` et `to`
// If null, that means there were no data found before `from` (recent fund).
export const deltaBetweenInPercent = ({
  from,
  to,
}: {
  from: number | -1;
  to: number;
}): number | null => {
  return from > -1 ? roundDecimal(-(1 - to / from) * 100, 2) : null;
};
