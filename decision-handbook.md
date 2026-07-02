# [⬅️](../README.md) 📚 Decision Handbook

| Pattern                        | 🔍 Trigger Keywords                                   | ✅ When to Use                                    | ❌ When NOT to Use                       | ⏱ Complexity          | 📝 Notes                                                  |
| ------------------------------ | ----------------------------------------------------- | ------------------------------------------------ | --------------------------------------- | --------------------- | --------------------------------------------------------- |
| **Two Pointers**               | Pair, Sorted Array, Palindrome, Remove Duplicates     | Process two ends or two moving indices           | Random access / non-contiguous problems | O(n)                  | Usually reduces nested loops to one pass.                 |
| **Sliding Window**             | Subarray, Substring, Contiguous, At Most, At Least    | Contiguous range with expanding/shrinking window | Non-contiguous selections               | O(n)                  | Maintain a valid window while moving pointers.            |
| **Prefix Sum**                 | Range Sum, Running Sum, Subarray Sum                  | Frequent range sum queries                       | Dynamic updates                         | O(n) preprocessing    | Convert repeated range calculations into O(1).            |
| **Hash Map / Frequency Count** | Count, Frequency, Duplicate, Lookup                   | Fast counting or existence checks                | Ordered traversal required              | O(n)                  | One of the most common interview tools.                   |
| **Stack**                      | Next Greater, Parentheses, Undo, Monotonic            | LIFO processing                                  | FIFO problems                           | O(n)                  | Often used for monotonic stack problems.                  |
| **Queue / BFS**                | Minimum Steps, Shortest Path, Level Order, Spread     | Unweighted graph or level-by-level traversal     | Weighted shortest path                  | O(V+E)                | First visit gives shortest distance in unweighted graphs. |
| **Multi-Source BFS**           | Nearest Source, Distance to Nearest, Spread from Many | Multiple starting points                         | Single-source weighted graph            | O(V+E)                | Start BFS from every source simultaneously.               |
| **DFS**                        | Explore All Paths, Islands, Components, Backtracking  | Exhaustive traversal                             | Minimum weighted path                   | O(V+E)                | Great for recursion and connected components.             |
| **Binary Search**              | Sorted, Answer Range, Minimize, Maximize              | Sorted data or monotonic answer                  | Unordered search space                  | O(log n)              | Can also binary search on the answer.                     |
| **Greedy**                     | Maximum, Minimum, Earliest, Local Choice              | Local optimum guarantees global optimum          | When future choices affect correctness  | Usually O(n log n)    | Often combined with sorting.                              |
| **Sorting**                    | Order, Interval, Closest, Greedy                      | Sorting simplifies relationships                 | Order is irrelevant                     | O(n log n)            | Frequently the first optimization step.                   |
| **Heap / Priority Queue**      | K Largest, Merge, Priority, Top K                     | Repeatedly need smallest/largest element         | Need complete ordering                  | O(n log n)            | Supports efficient insert/remove-max/min.                 |
| **Dijkstra**                   | Minimum Cost, Positive Weights, Cheapest Path         | Positive weighted graph                          | Negative edge weights                   | O((V+E) log V)        | Priority Queue + Relaxation.                              |
| **0-1 BFS**                    | Edge Weight = 0 or 1                                  | Graph with only 0/1 edge weights                 | Arbitrary weights                       | O(V+E)                | Uses Deque instead of Heap.                               |
| **Bellman-Ford / SPFA**        | Better State Found, Relaxation                        | Revisit nodes when a better state is found       | Simple BFS problems                     | O(VE) worst case      | Your solution for **3286** is SPFA-style relaxation.      |
| **Trie**                       | Prefix, Dictionary, StartsWith, Many Words            | Prefix searching and dictionary problems         | Single string search                    | O(total characters)   | Foundation for Aho-Corasick.                              |
| **Union Find (DSU)**           | Connectivity, Merge Groups, Components, Cycle         | Dynamic connectivity                             | Path finding                            | Almost O(1) amortized | Uses Path Compression + Union by Rank.                    |
| **Topological Sort**           | Dependency, Course Schedule, DAG                      | Ordering tasks with prerequisites                | Cyclic graphs                           | O(V+E)                | Kahn's Algorithm or DFS.                                  |
| **Backtracking**               | Generate All, Combination, Permutation                | Need every possible solution                     | Optimization only                       | Exponential           | Prune invalid branches early.                             |
| **Dynamic Programming**        | Overlapping Subproblems, Optimal Substructure         | State depends on previous states                 | Greedy already proves optimal           | Varies                | Always define State → Transition → Base Case.             |
| **Matrix Traversal**           | Grid, Four Directions, Eight Directions               | Grid-based problems                              | General graphs                          | O(mn)                 | Frequently combined with BFS/DFS.                         |

---

## 🧭 Decision Tree (Work in Progress)

```txt
Graph?
│
├── Connectivity?
│      └── Union Find
│
├── Shortest Path?
│      │
│      ├── Unweighted
│      │      └── BFS
│      │
│      ├── 0 / 1 Weight
│      │      └── 0-1 BFS
│      │
│      ├── Positive Weight
│      │      └── Dijkstra
│      │
│      └── Negative Weight
│             └── Bellman-Ford
│
└── Explore Everything?
       └── DFS
```
