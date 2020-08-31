const TuringMachine = require("./TuringMachine");

const ends = (n) => n + wordLength - 1;
const f_approx = (n) => (Math.pow(1.62, n) - Math.pow(1.62, -n)) / Math.sqrt(5);
const wordLength = Math.ceil(Math.log2(f_approx(process.argv[2])));

let registerABegins = 0;
let registerAEnds = ends(num1Begins);

let registerBBegins = num1Ends + 1;
let registerBEnds = ends(num2Begins);

let sumRegisterBegins = num2Ends + 2;
let sumRegisterEnds = ends(tempNumBegins);

class TuringMachineWrapper {
  constructor() {
    this.machine = new TuringMachine(tempNumEnds);
    this.display("INI");
  }

  /**
   * A function that adds two values from two registers and adds their contents bitwise.
   * @param {A|B|SUM} register1     A register that stores one number
   * @param {A|B|SUM} register2     A register that stores one number
   * @param {A|B|SUM} registerStore The register to store the num of the numbers kept in @param register1 and @param register2. This could be the same register as @param register1 or @param register2.
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

    this.display("ADD");
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
        return sumRegisterBegins;
      case "A":
        return registerABegins;
      case "B":
        return registerBBegins;
    }
  }

  determineIndexEnds(REGISTER) {
    switch (REGISTER) {
      case "SUM":
        return sumRegisterEnds;
      case "A":
        return registerAEnds;
      case "B":
        return registerBEnds;
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

    if (shouldDisplay) this.display("CPY");
  }

  load(register, number) {
    let registerBegins = this.determineIndexBegins(register);

    this.loadAt(number, registerBegins);
    this.display("LD" + register[0]);
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

  display(command) {
    let stringified = JSON.stringify(
      this.machine.tape.map((entry) => entry.toString())
    );
    return `${command}: ${stringified.split('"').join("")}`;
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
