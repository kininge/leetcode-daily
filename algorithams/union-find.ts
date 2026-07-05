/**
 * Disjoint Set Union (Union Find)
 *
 * Features
 * --------
 * ✅ Path Compression
 * ✅ Union by Size
 *
 * Complexity
 * ----------
 * find()          : O(α(n))
 * union()         : O(α(n))
 * connected()     : O(α(n))
 * componentSize() : O(α(n))
 *
 * α(n) = Inverse Ackermann Function
 * (Practically constant time.)
 */
class MyUnionFind {
    private _size: number[];
    private _root: number[];
    private _components: number;

    constructor(nodesInGraph: number){
        // initially assume each node are seprate component
        this._components = nodesInGraph;
        // initially assume each node are seprate and equal
        this._size = new Array(nodesInGraph).fill(1);
        // initially each node is separate so there is nounion root node
        this._root = [];
        for(let i=0; i<nodesInGraph; i++) this._root.push(i);
    }

    // find root of any node (and update if any missmatch)
    find(node: number): number {
        // if any nooe represent same node as root
        if(node === this._root[node]) return node;

        const root = this.find(this._root[node]);
        this._root[node] = root; // update for next time fast searching

        return root;
    }

    // connect two nodes and make single component
    // if already component and no need to union return false
    union(node1: number, node2: number): boolean {
        const rootNode1 = this.find(node1);
        const rootNode2 = this.find(node2);
        const unionSize1 = this._size[rootNode1];
        const unionSize2 = this._size[rootNode2];

        // -> already union
        if(rootNode1 === rootNode2) return false
        
        // -> making union
        if(unionSize1 >= unionSize2){
            this._size[rootNode1] += unionSize2;
            this._root[rootNode2] = rootNode1;
        }else {
            this._size[rootNode2] += unionSize1;
            this._root[rootNode1] = rootNode2;
        }
        this._components--;
        return true;
    }

    // check is given nodes are part of single union
    connected(node1: number, node2: number): boolean {
        const rootNode1 = this.find(node1);
        const rootNode2 = this.find(node2);

        return (rootNode1===rootNode2);
    }

    // return any union's size (how many nodes in that union)
    componentSize(node: number): number {
        const root = this.find(node);
        return this._size[root];
    }

    // return number of unions in graph
    components(): number {
        return this._components;
    }
}
