// I am using public API https://bible-api.com

const books: string[] = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalm",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];
const avgChapters: number = 10;
const avgVerse: number = 10;

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max + 1);
}

function getRandomBook(array: string[]): string {
  return array[getRandomInt(array.length - 1)];
}

function constructURL(
  book: string,
  chapter: string | number,
  verse: string | number
): string {
  const url = `https://bible-api.com/${book} ${chapter}:${verse}`;
  console.log({ url });
  return url;
}

async function getRandomVerse(): Promise<any> {
  const book: string = getRandomBook(books);
  const chapter: number = getRandomInt(avgChapters);
  const verse: number = getRandomInt(avgVerse);
  localStorage.clear();
  localStorage.setItem("starting-book", book);
  localStorage.setItem("starting-chapter", chapter.toString());
  localStorage.setItem("starting-verse", verse.toString());
  const url = constructURL(book, chapter, verse);
  let response = await fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something Went Wrong");
      }
    })
    .catch((error) => {
      console.error(error);
      setNewVerse();
    });

  return response;
}

async function nextVerse() {}

// Grab DOM elements
const verseContainer: HTMLDivElement | null =
  document.querySelector("div.verse");
const chapterContainer: HTMLHeadingElement | null =
  document.querySelector("h2.chapter");
const newVerseButton: HTMLButtonElement | null = document.querySelector(".new");
const prevVerseButton: HTMLButtonElement | null =
  document.querySelector("button.previous");
const nextVerseButton: HTMLButtonElement | null =
  document.querySelector(".next");

//Create Event Listeners
if (newVerseButton === null) {
  console.error("where's the button");
} else {
  newVerseButton.addEventListener("click", setNewVerse);
}
if (nextVerseButton === null) {
  console.error("where's the next button");
} else {
  nextVerseButton.addEventListener("click", setNextVerse);
}
if (prevVerseButton === null) {
  console.error("where's the prev button");
} else {
  prevVerseButton.addEventListener("click", setPreviousVerse);
}

async function setNewVerse(): Promise<void> {
  // fetch the verse
  let response = await getRandomVerse();

  //set DOM nodes if they exist
  if (chapterContainer === null) {
    console.error("where's the chapter");
  } else {
    chapterContainer.innerHTML = response.reference;
  }
  `1`;
  if (verseContainer === null) {
    console.error("where's the verse");
  } else {
    //verseContainer.innerHTML = response.text;
    let p = document.createElement("p");
    p.innerText = response.text;
    verseContainer.innerHTML = "";
    verseContainer.append(p);
  }
}

async function setPreviousVerse(): Promise<void> {
  // fetch the verse
  let response = await getPreviousVerse();
  //set DOM nodes if they exist
  if (chapterContainer === null) {
    console.error("where's the chapter");
  } else {
    chapterContainer.innerHTML = response.reference;
  }
  if (verseContainer === null) {
    console.error("where's the verse");
  } else {
    let p = document.createElement("p");
    p.innerText = response.text;
    verseContainer.prepend(p);
  }
}

async function setNextVerse(): Promise<void> {
  // fetch the verse
  let response = await getNextVerse();
  //set DOM nodes if they exist

  if (verseContainer === null) {
    console.error("where's the verse");
  } else {
    let p = document.createElement("p");
    p.innerText = response.text;
    verseContainer.append(p);
  }
}

async function getPreviousVerse() {
  const book: string | null = localStorage.getItem("starting-book");
  let chapter: number;
  let verse: number | null;
  //if we've already started going backwards, get the current position
  // otherwise, use the starting point of the original random entry
  if (localStorage.getItem("prev-chapter")) {
    chapter = parseInt(localStorage.getItem("prev-chapter"));
    verse = parseInt(localStorage.getItem("prev-verse")) - 1;
  } else {
    chapter = parseInt(localStorage.getItem("starting-chapter"));
    verse = parseInt(localStorage.getItem("starting-verse")) - 1;
  }
  //make sure we aren't already at the beginning
  if (verse === 0) {
    console.error("already at the beginning");
    // add some kind of alert for user
  } else {
    localStorage.setItem("prev-chapter", chapter.toString());
    localStorage.setItem("prev-verse", verse.toString());
    const url = constructURL(book, chapter, verse);
    let response = await fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something Went Wrong");
        }
      })
      .catch((error) => {
        console.error(error);
        let fallback = {
          reference: "John 3:16",
          text: "For God so loved...",
        };
        console.log({ fallback });
        return fallback;
      });
    return response;
  }
}

async function getNextVerse() {
  const book: string | null = localStorage.getItem("starting-book");
  let chapter: number;
  let verse: number;
  //if we've already started going backwards, get the current position
  // otherwise, use the starting point of the original random entry
  if (localStorage.getItem("next-chapter")) {
    chapter = parseInt(localStorage.getItem("next-chapter"));
    verse = parseInt(localStorage.getItem("next-verse")) + 1;
  } else {
    chapter = parseInt(localStorage.getItem("starting-chapter"));
    verse = parseInt(localStorage.getItem("starting-verse")) + 1;
  }

  localStorage.setItem("next-chapter", chapter.toString());
  localStorage.setItem("next-verse", verse.toString());
  const url = constructURL(book, chapter, verse);
  let response = await fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Something Went Wrong");
      }
    })
    .catch((error) => {
      console.error(error);
      let fallback = {
        reference: "End of Chapter",
        text: "End of Chapter...",
      };
      console.log({ fallback });
      return fallback;
    });
  return response;
}

setNewVerse();
