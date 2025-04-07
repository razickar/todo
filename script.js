let notes = JSON.parse(localStorage.getItem("notes")) || [];

const userInput = document.getElementById("userinput");
const layer = document.getElementById("layer");
const contentDiv = document.getElementById("contentdiv");

function openLayer() {
    layer.style.visibility = "visible";
}

function closeLayer() {
    const text = userInput.value.trim();
    if (text === "") return; // Do not allow empty note

    notes.push(text);
    userInput.value = "";
    layer.style.visibility = "hidden";
    saveNotes();
    showNotes();
}

function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    showNotes();
}

function editNote(index) {
    const updatedText = prompt("Edit your note:", notes[index]);
    if (updatedText !== null && updatedText.trim() !== "") {
        notes[index] = updatedText.trim();
        saveNotes();
        showNotes();
    }
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function showNotes() {
    contentDiv.innerHTML = "";
    notes.forEach((note, i) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = "notes";

        const span = document.createElement("span");
        span.innerText = note;

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.innerText = "✏️";
        editBtn.onclick = () => editNote(i);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerText = "🗑️";
        deleteBtn.onclick = () => deleteNote(i);

        noteDiv.appendChild(span);
        noteDiv.appendChild(editBtn);
        noteDiv.appendChild(deleteBtn);

        contentDiv.appendChild(noteDiv);
    });
}

showNotes();
