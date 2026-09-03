const Token = require("../models/Token");

const AVG_MINUTES_PER_ITEM = Number(process.env.AVG_SERVICE_MINUTES_PER_ITEM || 2);

/**
 * Estimates wait time for a new token at a given counter based on
 * how many people are already waiting there and how many items
 * each of their tokens has (more items = longer service time).
 */
async function estimateWaitMinutes(counterNumber, newItemCount) {
  const waitingTokens = await Token.find({
    counterNumber,
    status: { $in: ["waiting", "called", "serving"] },
  });

  const queuedItemCount = waitingTokens.reduce((sum, t) => sum + t.items.length, 0);
  const estimate = (queuedItemCount + newItemCount) * AVG_MINUTES_PER_ITEM;

  return {
    estimatedWaitMinutes: estimate,
    queuePosition: waitingTokens.length + 1,
  };
}

module.exports = { estimateWaitMinutes };
