const TuringMachine = require("./TuringMachine");

const ends = (n) => n + wordLength - 1;
const f_approx = (n) => (Math.pow(1.62, n) - Math.pow(1.62, -n)) / Math.sqrt(5);
const wordLength = Math.ceil(Math.log2(f_approx(process.argv[2])));

let num1Begins = 0;
let num1Ends = ends(num1Begins);

let num2Begins = num1Ends + 1;
let num2Ends = ends(num2Begins);

let tempNumBegins = num2Ends + 2;
let tempNumEnds = ends(tempNumBegins);

class TuringMachineWrapper {
  constructor() {
    this.machine = new TuringMachine(tempNumEnds);
    console.log("INI: ", this.displayTape());
  }

  /**
   * Adds the two values at num1Begins and num2Begins and writes them to num1Begins, using sum and minus methods for swapping
   */
  add(register1, register2, registerStore) {
    let register1Ends = this.determineIndexEnds(register1);
    let registerStoreEnds = this.determineIndexEnds(registerStore);

    // PROCESS:
    // Loop index i from 0 to wordLength - 1, inclusive
    // Go to num2Ends and store the bit in state.
    // Go to tempNumEnds and write that bit on the tape
    // Go to num1Ends and store the bit in state
    // Go to tempNumEnds and execute:
    //  If the number stored there is a 0, write state bit
    //  If the number stored there is a 1, and state bit is a 0, do nothing
    //  If the number stored there is a 1, and state bit is a 1, move left, write 1, move right, write 0
    // Continue loop until index = wordLength

    this.copy(register2, registerStore, false);

    for (let i = 0; i < wordLength; i++) {
      this.moveTo(register1Ends - i);
      this.machine.store();

      this.carryFrom(registerStoreEnds - i);
    }

    console.log("ADD: ", this.displayTape());
  }

  carryFrom(index) {
    // console.log(this.machine.tape);
    this.moveTo(index);

    if (this.machine.read() === 1 && this.machine.state === 1) {
      this.machine.write(0);
      this.carryFrom(index - 1);
    } else {
      this.machine.write(this.machine.state ^ this.machine.read());
    }
  }

  determineIndexBegins(REGISTER) {
    switch (REGISTER) {
      case "SUM":
        return tempNumBegins;
      case "A":
        return num1Begins;
      case "B":
        return num2Begins;
    }
  }

  determineIndexEnds(REGISTER) {
    switch (REGISTER) {
      case "SUM":
        return tempNumEnds;
      case "A":
        return num1Ends;
      case "B":
        return num2Ends;
    }
  }

  copy(registerFrom, registerTo, shouldDisplay = true) {
    let registerFromEnds = this.determineIndexEnds(registerFrom);
    let registerToEnds = this.determineIndexEnds(registerTo);

    for (let i = 0; i < wordLength; i++) {
      this.moveTo(registerFromEnds - i);
      this.machine.store();

      this.moveTo(registerToEnds - i);
      this.machine.write();
    }

    if (shouldDisplay) console.log("CPY: ", this.displayTape());
  }

  loadA(number) {
    this.loadAt(number, num1Begins);
    console.log("LDA: ", this.displayTape());
  }

  loadB(number) {
    this.loadAt(number, num2Begins);
    console.log("LDB: ", this.displayTape());
  }

  load(register, number) {
    let registerBegins = this.determineIndexBegins(register);

    this.loadAt(number, registerBegins);
    console.log("LD" + register[0] + ": ", this.displayTape());
  }

  loadAt(number, beginIndex) {
    // Convert from hex to binary
    let binary = number.toString(2);
    binary = "0".repeat(wordLength - binary.length) + binary;

    // Loop through backwards because least significant digit is at the back
    for (let i = 0; i < wordLength; i++) {
      this.moveTo(beginIndex + wordLength - 1 - i);

      this.machine.write(binary[wordLength - i - 1]);
    }
  }

  displayTape() {
    let stringified = JSON.stringify(
      this.machine.tape.map((entry) => entry.toString())
    );
    return stringified.split('"').join("");
  }

  moveTo(tapeIndex) {
    let currentIndex = this.machine.index;
    let diff = tapeIndex - currentIndex;
    if (diff >= 0) {
      for (let i = 0; i < diff; i++) {
        this.machine.moveHead(1);
      }
    } else {
      for (let i = 0; i < -diff; i++) {
        this.machine.moveHead(-1);
      }
    }
  }
}

module.exports = TuringMachineWrapper;
