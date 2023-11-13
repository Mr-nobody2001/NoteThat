// // Elements

const MAX_NOTE_ID = 10000;

const notesContainer = document.querySelector("#notes-container");

const addNoteButton = document.querySelector("#add-button-container");

const searchNoteInput = document.querySelector("#search-bar-container input");

// Functions

// initialize page when window end this load

const renderPage = () => {
  if (!renderNotes()) {
    createNote();
    saveNotes();
  }
};

// show notes when window end this load

const renderNotes = () => {
  const objectNoteList = getObjectNotes();

  objectToNote(objectNoteList);

  return objectNoteList.length > 0;
};

// transform javascript object to HTML note

const objectToNote = (objectNoteList) => {
  for (let objectNote of objectNoteList) {
    createNote(
      undefined,
      objectNote.id,
      objectNote.title,
      objectNote.text,
      objectNote.colorClass
    );
  }
};

// transform HTML note to javascript object

const noteToObject = (noteList) => {
  const objectNoteList = [];

  for (let nt of noteList) {
    const childrens = nt.children;

    const noteObject = {
      id: nt.id,
      title: childrens[0].innerText,
      text: childrens[1].innerText,
      colorClass: nt.colorClass,
    };

    objectNoteList.push(noteObject);
  }

  return objectNoteList;
};

// add a note in HTML body

const createNote = (
  e,
  noteId,
  titleContent = "Title",
  textContent = "Write something here",
  colorClass
) => {
  const note = document.createElement("div");
  const title = document.createElement("h1");
  const text = document.createElement("p");
  const deleteIcon = document.createElement("i");

  title.setAttribute("contenteditable", "true");
  text.setAttribute("contenteditable", "true");
  deleteIcon.classList.add(...["bi", "bi-trash3-fill", "delete-icon"]);

  title.innerText = titleContent;
  text.innerText = textContent;

  note.classList.add("note");

  randomColor(colorClass, note);

  note.id = noteId || randomNumber(MAX_NOTE_ID);

  note.appendChild(title);
  note.appendChild(text);
  note.append(deleteIcon);
  notesContainer.appendChild(note);

  generalFunctionAplicate(note);
};

// random number generator

const randomNumber = (limit) => {
  return Math.round(Math.random() * limit);
};

// choose a random note color

const randomColor = (colorClass, note) => {
  const number = colorClass || randomNumber(5);

  switch (number) {
    case 1:
      colorClass = "note-blue";
      break;
    case 2:
      colorClass = "note-pink";
      break;
    case 3:
      colorClass = "note-yellow";
      break;
    case 4:
      colorClass = "note-purple";
      break;
    case 5:
      colorClass = "note-green";
      break;
    default:
      colorClass = "note-blue";
      break;
  }

  note.colorClass = number;

  note.classList.add(colorClass);
};

// add de general functions to new notes

const generalFunctionAplicate = (note) => {
  const childrens = note.children;

  childrens[0].addEventListener("input", inputLimit);
  childrens[1].addEventListener("input", inputLimit);
  childrens[2].addEventListener("click", deleteNote);
  childrens[2].addEventListener("touch", deleteNote);

  childrens[0].addEventListener("blur", rewriteTextContent);
  childrens[1].addEventListener("blur", rewriteTextContent);
};

// rewrite note content if target is blank

const rewriteTextContent = (e) => {
  const content = e.target;

  if (!content.textContent.length) {
    let text;

    if (content.nodeName == "H1") {
      text = "Title";
    } else {
      text = "Write something here";
    }

    content.innerText = text;
  }
};

// save notes in the local storage

const saveNotes = (e, objectNoteList) => {
  if (!objectNoteList) {
    const noteList = document.querySelectorAll(".note");
    objectNoteList = noteToObject(noteList);
  }

  localStorage.setItem("notes", JSON.stringify(objectNoteList));
};

// get notes in the local storage

const getObjectNotes = () => {
  return JSON.parse(localStorage.getItem("notes") || "[]");
};

const inputLimit = (e) => {
  const content = e.target;

  if (content.innerText.length > 200) {
    content.innerText = content.innerText.substring(0, 200);
  }
};

// delete note

const deleteNote = (e) => {
  const targetNote = e.target.parentNode;
  let objectNoteList = getObjectNotes();

  objectNoteList = objectNoteList.filter((note) => note.id !== targetNote.id);

  saveNotes(undefined, objectNoteList);

  notesContainer.removeChild(targetNote);
};

const clearNotes = () => {
  notesContainer.replaceChildren([]);
};

// Events

window.onload = renderPage;

addNoteButton.addEventListener("click", createNote);

addNoteButton.addEventListener("touch", createNote);

document.addEventListener("mouseleave", saveNotes);