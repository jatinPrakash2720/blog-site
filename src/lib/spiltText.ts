export default function textSpilt(text: string) {
  const splittedText = text.split("");
  let result = "";
  splittedText.forEach((elem, index) => {
    result += `<span>${elem}</span>`;
  });
  return result;
}
