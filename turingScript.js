let A = "A";
let B = "B";
let SUM = "SUM";

const n = process.argv[2];

const TuringMachineWrapper = require("./TuringMachineWrapper");

// Every computation is done with a turing machine, though there is a wrapper around it for abstraction purposes

// PROCESS:
// 1. Determine how many bits are needed to store the nth number
// 2. Load a 0x00 into register A
// 3. Load a 0x01 into register B
// 4. Compute their sum and load it into SUM register
// 5. Copy register B to register A, and SUM register to register B
// 6. Repeat up until n

// TEST: add 0 to 1 and store it in tape where 0 was
const machine = new TuringMachineWrapper();

// Write a 0 to register A
machine.load(A, 0x00);

// Write a 1 to register B
machine.load(B, 0x01);

// Then add them and return the result in the sum register
for (let i = 0; i < n - 1; i++) {
  machine.add(A, B, SUM);
  machine.copy(B, A, false);
  machine.copy(SUM, B, false);
}
