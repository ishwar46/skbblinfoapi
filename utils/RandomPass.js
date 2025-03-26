function generateStrongPassword(length) {
  const characters = [
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "@#!^%*",
  ];
  console.log(characters.join(""));

  let password = "";

  characters.map((value, i) => {
    password += value.charAt(Math.floor(Math.random() * value.length));
  });

  for (let i = 4; i < length; i++) {
    password += characters
      .join("")
      .charAt(Math.floor(Math.random() * characters.join("").length));
  }
  console.log(password);

  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
}
module.exports = generateStrongPassword;
