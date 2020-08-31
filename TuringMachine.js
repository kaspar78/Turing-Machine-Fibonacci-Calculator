class TuringMachine {
  constructor(tapeLength) {
    this.tape = [];

    // Initialize the tape
    for (let i = 0; i < tapeLength + 1; i++) {
      this.tape[i] = "-";
    }

    // Initialize the machine
    this.state = null;
    this.index = 0;
  }

  write(val = this.state) {
    this.tape[this.index] = parseInt(val);
  }

  // Can be -1, 0, or 1
  moveHead(dMove) {
    this.index += dMove;
  }

  // A 1 or 0
  store() {
    this.state = this.read();
  }

  read() {
    let val = this.tape[this.index];
    // console.log("TAPE: ", this.tape);
    // console.log("INDEX:", this.index);
    val = val === "-" ? 0 : parseInt(val);
    // console.log("VAL: ", val);
    return val;
  }
}

module.exports = TuringMachine;
