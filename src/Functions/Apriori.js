const Apriori = (transactions, minSupport, confidence) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log("Transations:", transactions);
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
        if (itemCounts[item] < minSupport) {
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
        L = pruneItemsets(Object.keys(itemCounts), minSupport, itemCounts);

        // Add frequent itemsets to the result
        frequentItems = frequentItems.concat(L);

        // Update progress variables
        progress.push(k - 1);
        L.length > 0 && frequentItemCounts.push(L.length);

        k++;
      }

      const associationRules = generateAssociationRules(
        frequentItems,
        confidence,
        transactions
      );

      resolve({
        progress,
        frequentItems,
        frequentItemCounts,
        associationRules,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const eqSet = (a, b) => {
  if (typeof a === "string" && typeof b === "string") {
    return a === b;
  } else if (a instanceof Set && b instanceof Set) {
    return a.size === b.size && [...a].every((x) => b.has(x));
  } else return false;
};

function generateCandidates(L, k) {
  /* Generate candidate itemsets of size k from frequent itemsets L. */
  let candidates = new Set();

  for (let i of L) {
    for (let j of L) {
      let union =
        Array.isArray(i) && Array.isArray(j)
          ? new Set([...i, ...j])
          : Array.isArray(i)
          ? new Set([...i, j])
          : Array.isArray(j)
          ? new Set([i, ...j])
          : new Set([i, j]);
      if (union.size === k && !eqSet(i, j)) {
        candidates.add(union);
        // console.log(union);
      }
    }
  }
  return Array.from(candidates);
}

function pruneItemsets(itemsets, minSupport, itemCounts) {
  // Prune infrequent itemsets
  let prunedItemsets = new Set();
  for (let itemset of itemsets) {
    let support = itemCounts[itemset];
    if (support >= minSupport) {
      prunedItemsets.add(itemset);
    }
  }
  return Array.from(prunedItemsets);
}

function countItems(transactions, itemsets) {
  // Count the occurrences of each itemset in the transactions
  let itemCounts = {};
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    for (let j = 0; j < itemsets.length; j++) {
      let itemset = Array.from(itemsets[j]);
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

function generateAssociationRules(
  mostFrequentItemsets,
  confidence,
  transactions
) {
  const associationRules = [];

  for (let i = 0; i < mostFrequentItemsets.length; i++) {
    const itemset = mostFrequentItemsets[i].split(",");

    // Generate all possible non-empty subsets of the itemset
    for (let j = 1; j < Math.pow(2, itemset.length) - 1; j++) {
      const antecedent = [];
      const consequent = [];

      // Partition the items into antecedent and consequent based on the binary representation of j
      for (let k = 0; k < itemset.length; k++) {
        if ((j >> k) & 1) {
          antecedent.push(itemset[k]);
        } else {
          consequent.push(itemset[k]);
        }
      }

      // Calculate the support and confidence of the rule
      const support = getSupport(itemset, transactions);
      const antecedentSupport = getSupport(antecedent, transactions);
      const confidenceValue = support / antecedentSupport;

      // If the confidence is greater than or equal to the threshold, add the rule to the list
      if (confidenceValue >= confidence) {
        associationRules.push({
          antecedent: antecedent,
          consequent: consequent,
          support: support,
          confidence: confidenceValue,
        });
      }
    }
  }

  return associationRules;
}

function getSupport(itemset, transactions) {
  let count = 0;

  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    let found = true;

    for (let j = 0; j < itemset.length; j++) {
      if (!transaction.includes(itemset[j])) {
        found = false;
        break;
      }
    }

    if (found) {
      count++;
    }
  }

  return count / transactions.length;
}

export default Apriori;
