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

function constructURL(): string {
  const book: string = getRandomBook(books);
  const chapter: number = getRandomInt(avgChapters);
  const verse: number = getRandomInt(avgVerse);
  const url = `https://bible-api.com/${book} ${chapter}:${verse}`;
  localStorage.setItem("book", book);
  localStorage.setItem("chapter", chapter);
  localStorage.setItem("verse", verse);
  console.log({ url });
  return url;
}

async function getVerse(): Promise<any> {
  const url = constructURL();
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

async function newVerse(): Promise<void> {
  let response = await getVerse();
  chapterContainer.innerHTML = response.reference;
  verseContainer.innerHTML = response.text;
}

const verseContainer = document.querySelector("p.verse");
const chapterContainer = document.querySelector("h2.chapter");
const newVerseButton = document.querySelector(".new");

newVerseButton.addEventListener("click", newVerse);
