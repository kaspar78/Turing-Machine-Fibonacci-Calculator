const fib = (n) => {
  n = parseInt(n);

  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    let temp = b;
    b = a + b;
    a = temp;
  }

  return a;
};

console.log(fib(process.argv[2]));
