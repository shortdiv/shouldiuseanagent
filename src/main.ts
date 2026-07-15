import "./style.css";
import { getVerdict } from "./counter.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="content">
    <div class="content-body">
      <h1>Should I use an agent?</h1>
      <span class="verdict"></span>
      <span class="verdict-description"></span>
      <button class="gimme-verdict">Find out</button>
    </div>
  </div>
`;

const verdictButton: HTMLButtonElement =
  document.querySelector(".gimme-verdict")!;
const verdictResult = document.querySelector(".verdict")!;
const verdictDesc = document.querySelector(".verdict-description")!;
verdictButton.addEventListener("click", (event: MouseEvent) => {
  event.preventDefault();
  const verdict = getVerdict();
  verdictResult.textContent = `${verdict.verdict.toUpperCase()}`;
  verdictDesc.textContent = `${verdict.text}.`;
  verdictButton.textContent = "Ask again";
});
