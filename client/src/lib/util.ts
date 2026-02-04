export function currencyFormat(amount: number) {
  return "£" + (amount / 100).toFixed(2);
}
