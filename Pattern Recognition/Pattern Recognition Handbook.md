# 📚 Pattern Recognition Handbook

## 🌊 Breadth First Search (BFS)

### 🎯 When to Think of BFS
- Shortest path in unweighted graph
- Minimum number of moves
- Minimum steps
- Minimum jumps
- Level order
- Spread
- Infection
- Fire
- Rotten oranges
- Multi-source expansion

### Usually:
- Every move costs exactly the same.

### 🧠 How BFS Works
- BFS work level by level
```txt
Level 0
↓
Level 1
↓
Level 2
↓
...
```
- The first time we reach a node, it is already the shortest path.

### ❌ Don't Use BFS

- Different moves have different costs.
