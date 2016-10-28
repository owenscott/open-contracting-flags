const pricesExactlyDifferent = (price1, price2) => {
  const prices = [price1, price2];
  const percentDiff = (prices[1] - prices[0]) / prices[0];
  const reversePercentDiff = (prices[0] - prices[1]) / prices[1];
  return (percentDiff * 100) % 1 === 0 ||
    (reversePercentDiff * 100) % 1 === 0;
};

module.exports = pricesExactlyDifferent;
