export class CharReader{
    private input: string;
    private offset = 0;
    private line = 1;
    private column =1;
    constructor(input: string) {
    this.input = input;
}

peek(): string{
    return this.input[this.offset] ?? "";
}

isAtEnd(): boolean{
    return this.offset >= this.input.length;
}

next(): string{
    if(this.isAtEnd()){
        return "";
    }


const char = this.input[this.offset]!;

if(char === "\n"){
    this.line++;
    this.column =1;
}else{
    this.column++;
}
this.offset++;
return char;
}
getPosition(): {offset: number; line: number; column: number}{
    return {
        offset: this.offset,
        line: this.line,
        column: this.column,
    };
}
}