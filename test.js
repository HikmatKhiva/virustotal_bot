const a = [
  {
    value: "banker",
    count: 11,
  },
  {
    value: "trojan",
    count: 8,
  },
];

console.log(a);
const msg = a.map((item) => {
    return item.value
});
console.log(msg);
