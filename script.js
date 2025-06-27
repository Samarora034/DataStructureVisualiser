let array = [];

function generateRandomArray() {
  const size = parseInt(document.getElementById("array-size").value);
  if (!size) return alert("Please enter array size");
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  renderArray();
}

function createArray() {
  const input = document.getElementById("array-elements").value;
  array = input.split(",").map(Number);
  renderArray();
}

function renderArray(
  highlightIndexes = [],
  sortedIndexes = [],
  splitRange = [],
  fadeIndexes = []
) {
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  array.forEach((val, i) => {
    const div = document.createElement("div");
    div.className = "array-bar";
    div.innerText = val;
    if (highlightIndexes.includes(i)) div.classList.add("highlight");
    if (sortedIndexes.includes(i)) div.classList.add("sorted");
    if (splitRange.length === 2) {
      if (i >= splitRange[0] && i <= splitRange[1]) {
        div.classList.add(
          i <= Math.floor((splitRange[0] + splitRange[1]) / 2)
            ? "split-left"
            : "split-right"
        );
      }
    }
    if (fadeIndexes.includes(i)) div.classList.add("fade-out");
    container.appendChild(div);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    renderArray([i]);
    await sleep(400);
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      renderArray([j + 1], [], [], []);
      await sleep(400);
      j--;
    }
    array[j + 1] = key;
    renderArray([j + 1]);
    await sleep(400);
  }
}

async function mergeSortStart() {
  await mergeSort(0, array.length - 1);
  renderArray(
    [],
    array.map((_, i) => i)
  );
}

async function mergeSort(start, end) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  renderArray([], [], [start, end]);
  await sleep(700);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  let left = array.slice(start, mid + 1);
  let right = array.slice(mid + 1, end + 1);
  let i = 0,
    j = 0,
    k = start;
  while (i < left.length && j < right.length) {
    array[k] = left[i] <= right[j] ? left[i++] : right[j++];
    renderArray([k], [], [start, end]);
    await sleep(400);
    k++;
  }
  while (i < left.length) {
    array[k++] = left[i++];
    renderArray([k - 1], [], [start, end]);
    await sleep(400);
  }
  while (j < right.length) {
    array[k++] = right[j++];
    renderArray([k - 1], [], [start, end]);
    await sleep(400);
  }
}

async function binarySearchPrompt() {
  const target = parseInt(prompt("Enter number to search:"));
  await binarySearch(target);
}

async function binarySearch(target) {
  let sorted = [...array].sort((a, b) => a - b);
  array = sorted;
  renderArray();
  let left = 0,
    right = array.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    const fade = [...Array(array.length).keys()].filter(
      (i) => i < left || i > right
    );
    renderArray([mid], [], [left, right], fade);
    await sleep(700);
    if (array[mid] === target) {
      renderArray([mid], [], [left, right], fade);
      alert(`Element found at index ${mid}`);
      return;
    } else if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  alert("Element not found");
}

async function linearSearchPrompt() {
  const target = parseInt(prompt("Enter number to search:"));
  await linearSearch(target);
}

async function linearSearch(target) {
  for (let i = 0; i < array.length; i++) {
    renderArray([i]);
    await sleep(500);
    if (array[i] === target) {
      renderArray([], [i]);
      alert(`Element found at index ${i}`);
      return;
    }
  }
  alert("Element not found");
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      renderArray([minIndex, j]);
      await sleep(300);
      if (array[j] < array[minIndex]) minIndex = j;
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    renderArray([i, minIndex]);
    await sleep(500);
  }
}

async function insertAtIndexPrompt() {
  const index = parseInt(prompt("Enter index to insert at:"));
  const value = parseInt(prompt("Enter value to insert:"));
  if (index < 0 || index > array.length) return alert("Invalid index");
  array.splice(index, 0, value);
  renderArray([index]);
}

async function deleteAtIndexPrompt() {
  const index = parseInt(prompt("Enter index to delete:"));
  if (index < 0 || index >= array.length) return alert("Invalid index");
  array.splice(index, 1);
  renderArray();
}

function reverseArray() {
  array.reverse();
  renderArray();
}

function rotateLeft() {
  array.push(array.shift());
  renderArray();
}

function rotateRight() {
  array.unshift(array.pop());
  renderArray();
}
