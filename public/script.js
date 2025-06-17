// const getButton = document.querySelector("#get-button");
const createButton = document.querySelector("#create-button");
const editSaveButton = document.querySelector("#edit-save-button");
const titleInput = document.querySelector("#title-input");
const editTitleInput = document.querySelector("#edit-title-input");
const contentInput = document.querySelector("#content-input");
const editContentInput = document.querySelector("#edit-content-input");
const memoTemplate = document.querySelector("#memo-template");
const memoList = document.querySelector("#memo-list");
const noMemoMessage = document.querySelector("#no-memo-message");

let editingMemoId = null;
let editingMemoItem = null;

// getButton.addEventListener("click", async (event) => {
//   event.preventDefault();

//   const res = await axios.get("/api/memos");
//   console.log(res);
// });

// 作成（POST）
createButton.addEventListener("click", async (event) => {
  const title = titleInput.value;
  const content = contentInput.value;
  const createdMemo = await axios.post("/api/memos", { title, content });
  console.log(createdMemo.data);
  updateMemoList(createdMemo.data);
  titleInput.value = "";
  contentInput.value = "";

  updateNoMemoMessage();
});

// 読み取り（GET）
memoList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("bi-pencil-square")) {
    const memoItem = event.target.closest(".memo-item");
    const selectedMemo = await axios.get(`/api/memos/${memoItem.dataset.id}`);

    // モーダルの内容の更新
    const { title, content, _id } = selectedMemo.data;
    editTitleInput.value = title;
    editContentInput.value = content;
    memoItem.dataset.id = _id;

    editingMemoId = _id;
    editingMemoItem = memoItem;
    console.log("editingMemoId: ", editingMemoId);

    // モーダルの表示
    const myModal = new bootstrap.Modal(document.getElementById("memoModal"));
    myModal.show();
  }
});

// 編集（PUT）
editSaveButton.addEventListener("click", async (event) => {
  await axios.put(`/api/memos/${editingMemoId}`, {
    title: editTitleInput.value,
    content: editContentInput.value,
  });

  editingMemoItem.querySelector(".memo-list-title").textContent =
    editTitleInput.value;
  editingMemoItem.querySelector(".memo-list-content").textContent =
    editContentInput.value;

  // editSaveButton.blur();
  const memoModal = document.getElementById("memoModal");
  const bsModal = bootstrap.Modal.getInstance(memoModal);
  bsModal.hide();
});

// 削除（DELETE）
memoList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("bi-trash")) {
    const memoItem = event.target.closest(".memo-item");
    await axios.delete(`/api/memos/${memoItem.dataset.id}`);
    memoItem.remove();
  }

  updateNoMemoMessage();
});

const createMemo = function (data) {
  const { title, content, _id } = data;

  // テンプレートの取得
  const clone = memoTemplate.content.cloneNode(true);
  const memoTitle = clone.querySelector(".memo-list-title");
  const memoContent = clone.querySelector(".memo-list-content");

  // 内容の更新
  memoTitle.textContent = title;
  memoContent.textContent = content;

  const memoItem = clone.querySelector(".memo-item");
  memoItem.dataset.id = _id;

  return memoItem;
};

const updateMemoList = function (title, content) {
  const newMemo = createMemo(title, content);

  memoList.append(newMemo);
};

const displayModal = function (data) {
  const { _id } = data;

  // モーダルの表示
};

const updateNoMemoMessage = function () {
  const memoItems = document.querySelectorAll(".memo-item");
  if (memoItems.length > 0) {
    noMemoMessage.style.display = "none";
  } else {
    noMemoMessage.style.display = "block";
  }
};
