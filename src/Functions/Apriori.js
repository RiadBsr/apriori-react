const Apriori = (transactions, settings, history, setHistory) => {
  const start = Date.now();

  // Find unique items in transactions
  let uniqueItems = new Set();
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    for (let j = 0; j < transaction.length; j++) {
      let item = transaction[j];
      uniqueItems.add(item);
    }
  }

  // Convert unique items to an array for faster access
  let frequentItems = Array.from(uniqueItems);
  let itemCounts = {};

  // Count occurrences of each item in transactions
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    for (let j = 0; j < transaction.length; j++) {
      let item = transaction[j];
      if (!itemCounts[item]) {
        itemCounts[item] = 0;
      }
      itemCounts[item] += 1 / transactions.length;
    }
  }

  // Prune infrequent items
  for (let i = 0; i < frequentItems.length; i++) {
    let item = frequentItems[i];
    if (itemCounts[item] < settings.minSupport) {
      frequentItems.splice(i, 1);
      i--;
    }
  }

  // Initialize L1 set
  let L = frequentItems;
  let k = 2;

  // Initialize progress variables
  let progress = [];
  let frequentItemCounts = [frequentItems.length];

  // Generate candidate itemsets and prune them until no more frequent itemsets are found
  while (L.length > 0) {
    // Generate candidate itemsets
    let candidates = generateCandidates(L, k);

    // Count the occurrences of each candidate itemset in the transactions
    let itemCounts = countItems(transactions, candidates);

    // Prune infrequent itemsets
    L = pruneItemsets(Object.keys(itemCounts), settings.minSupport, itemCounts);

    // Add frequent itemsets to the result
    frequentItems = frequentItems.concat(L);

    // Update progress variables
    progress.push(k - 1);
    frequentItemCounts.push(L.length);

    k++;
  }

  const end = Date.now();
  var startDate = new Date(start);
  setHistory([
    ...history,
    {
      id: history.length === 0 ? 0 : history[history.length - 1].id + 1,
      date:
        startDate.getDate() +
        "/" +
        (startDate.getMonth() + 1) +
        "/" +
        startDate.getFullYear() +
        " @ " +
        startDate.getHours() +
        ":" +
        startDate.getMinutes() +
        ":" +
        startDate.getSeconds(),
      dataName: settings.dataName,
      execTime: `${end - start} ms`,
      nbItemsets: frequentItems.length,
      progressData: { iteration: progress, nbItemset: frequentItemCounts },
    },
  ]);
  return frequentItems;
};

function generateCandidates(L, k) {
  // Generate candidate itemsets of size k from frequent itemsets L
  let candidates = [];
  for (let i = 0; i < L.length; i++) {
    for (let j = i + 1; j < L.length; j++) {
      let union = L[i].concat(L[j]).sort();
      if (union.length === k && !candidates.includes(union)) {
        candidates.push(union);
      }
    }
  }
  return candidates;
}

function pruneItemsets(itemsets, minSupport, itemCounts) {
  // Prune infrequent itemsets
  let prunedItemsets = [];
  for (let i = 0; i < itemsets.length; i++) {
    let itemset = itemsets[i].split(",");
    let support = itemCounts[itemsets[i]];
    if (support >= minSupport) {
      prunedItemsets.push(itemset);
    }
  }
  return prunedItemsets;
}

function countItems(transactions, itemsets) {
  // Count the occurrences of each itemset in the transactions
  let itemCounts = {};
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    for (let j = 0; j < itemsets.length; j++) {
      let itemset = itemsets[j];
      if (itemset.every((item) => transaction.includes(item))) {
        // Increment the count for this itemset
        if (itemCounts[itemset]) {
          itemCounts[itemset] += 1 / transactions.length;
        } else {
          itemCounts[itemset] = 1 / transactions.length;
        }
      }
    }
  }
  return itemCounts;
}

export default Apriori;
