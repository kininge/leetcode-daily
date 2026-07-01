type NODE<T> = {
    next: NODE<T> | null;
    prev: NODE<T> | null;
    val: T;
}
class MyQueue<T> {
    head: NODE<T>;
    tail: NODE<T>;

    constructor(){
        this.head = null;
        this.tail = null;
    }

    // add at end
    append(val: T): void {
        const newNode: NODE<T> = { next: null, prev: null, val };
        // first node case 
        if(this.head === null){
            this.head = newNode;
            this.tail = newNode;
        } 
        // single node 
        else if(this.head.next === null){
            newNode.prev = this.head;
            this.head.next = newNode;

            this.tail = newNode;
        }
        // add after tail
        else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            
            this.tail = newNode;
        }
    }

    // remove first
    pop(): T|null {
        let headNodeVal: T|null = null;

        if(this.head){
            headNodeVal = this.head.val;
            this.head = this.head.next; // head change
            
            // if we just have 1 node
            if(this.head === null){
                this.tail = null;
            } else {
                this.head.prev = null;
            }
        }

        return headNodeVal;
    }

    // check head
    peak(){
        return this.head;
    }
}
