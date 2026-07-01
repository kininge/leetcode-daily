type NODE<T> = {
    next: NODE<T> | null;
    prev: NODE<T> | null;
    val: T;
}
class MyQueue<T> {
    private _size:number;
    private _head: NODE<T> | null;
    private _tail: NODE<T> | null;

    constructor(){
        this._size = 0;
        this._head = null;
        this._tail = null;
    }

    // add at end
    enqueue(val: T): void {
        const newNode: NODE<T> = {
            next: null,
            prev: this._tail,
            val
        };

        if (this._tail) {
            this._tail.next = newNode;
        } else {
            this._head = newNode;
        }

        this._tail = newNode;
        this._size++;
    }

    // remove first
    dequeue(): T|null {
        let headNodeVal: T|null = null;

        if(this._head){
            headNodeVal = this._head.val;
            this._head = this._head.next; // head change
            
            // if we just have 1 node
            if(this._head === null){
                this._tail = null;
            } else {
                this._head.prev = null;
            }

            this._size--;
        }

        return headNodeVal;
    }

    // check head
    peek(): T | null {
        return this._head ? this._head.val : null;
    }

    isEmpty(): boolean{
        return this._head === null;
    }

    size(): number{
        return this._size;
    }
}
