type Comparator<T> =
(
    child: T,
    parent: T
) => boolean;
class MyHeap<T>{
    // heap is complete-binery-tree - We can represent this as array
    private _heap: T[]; 
    // This function 'True' if argument1 more prior than argument2 node
    // comparator function => f(childNode, parentNode) -> boolean
    private _check: Comparator<T>; 

    // get comparator function as setter initially
    constructor(comparatorFunction: Comparator<T>){
        this._heap = [];
        this._check = comparatorFunction;
    }

    private _swap(index1: number, index2: number): void {
        const temp = this._heap[index1];
        this._heap[index1] = this._heap[index2];
        this._heap[index2] = temp;
    }

    private _parentIndex(i:number): number {
        return Math.floor((i-1)/2);
    }

    private _leftChildIndex(i:number): number {
        return i*2+1;
    }

    private _rightChildIndex(i:number): number {
        return i*2+2;
    }

    // upward heapification - low end added node push up to check it's right position
    private _upwardHeapification(_childNodeIndex: number): void{
        let childIndex = _childNodeIndex;

        while(childIndex > 0){ 
            const parentIndex = this._parentIndex(childIndex);

            const shouldChildNodeGoUp = this._check(this._heap[childIndex], this._heap[parentIndex]);
           if(shouldChildNodeGoUp) { 
                this._swap(childIndex, parentIndex);
                childIndex = parentIndex;
            } else break;

        }
    }

    // downward heapification - upper end node pushing down to check it's right position
    private _downwardHeapification(_parentNodeIndex: number): void{
        let parentIndex = _parentNodeIndex;
        // heap is representation of binery tree --> each parent will have 0, 1, 2 nodes as a child/children
        // childIndex1 = parentIndex*2+1;
        // childIndex2 = parentIndex*2+2;

        // there at least 1 child node should have to compare
        while(this._leftChildIndex(parentIndex) < this._heap.length){ 
            const childIndex1 = this._leftChildIndex(parentIndex);
            const childIndex2 = this._rightChildIndex(parentIndex);

            // now we need to check among 2 children - from which child parent should compare?
            // We will compare parent to most prior child among 2 children
            let mostPriorChildIndex = childIndex1;
            const child2Exist: boolean = (childIndex2 < this._heap.length);
            if(child2Exist && this._check(this._heap[childIndex2], this._heap[childIndex1])){
                mostPriorChildIndex = childIndex2;
            }

            const shouldChildNodeGoUp = this._check(this._heap[mostPriorChildIndex], this._heap[parentIndex]);
           if(shouldChildNodeGoUp) {
                this._swap(mostPriorChildIndex, parentIndex);
                parentIndex = mostPriorChildIndex;
            } else break;

        }
    }

    // add new node to heap
    push(node: T): void{
        this._heap.push(node);                          // new node added at leaf
        let childIndex: number = this._heap.length-1;   // new added node's current position
        this._upwardHeapification(childIndex);          // this will push this child node upward in heap to it's right position in O(LogN)
    }

    // remove root node from heap
    pop(): T|null {
        if(this._heap.length === 0) return null;
        if(this._heap.length === 1) { 
            const root = this._heap[0];
            this._heap = [];
            return root;
        }

        this._swap(0, this._heap.length-1); // replace root node with leaf node
        const rootNode = this._heap.pop(); // root node (which right now at leaf) pop and store
        this._downwardHeapification(0); // that leaf node (which right now at root) push downward in heap to it's right position in O(LogN)

        return rootNode;
    }

    // check root node
    peek(): T|null{
        if(this._heap.length === 0) return null;
        return this._heap[0];
    }

    // 
    isEmpty(): boolean{
        return this._heap.length === 0;
    }

    size(): number{
        return this._heap.length;
    }
}
