const createButton = document.querySelector("#create-button");
const editSaveButton = document.querySelector("#edit-save-button");
const titleInput = document.querySelector("#title-input");
const editTitleInput = document.querySelector("#edit-title-input");
const contentInput = document.querySelector("#content-input");
const editContentInput = document.querySelector("#edit-content-input");
const memoTemplate = document.querySelector("#memo-template");
const memoList = document.querySelector("#memo-list");
const noMemoMessage = document.querySelector("#no-memo-message");

// 編集中のメモを保存する変数
let editingMemoId = null;
let editingMemoItem = null;

// 初期読み込み
window.addEventListener("DOMContentLoaded", async () => {
  const response = await axios.get("/api/memos");
  const memos = response.data;
  for (let memo of memos) {
    updateMemoList(memo);
  }
  updateNoMemoMessage();
});

// 作成（POST）
createButton.addEventListener("click", async (event) => {
  // 「新しいメモを作成」欄からタイトルと内容を取得
  const title = titleInput.value;
  const content = contentInput.value;

  // メモを作成し、メモリストに追加
  const createdMemo = await axios.post("/api/memos", { title, content });
  updateMemoList(createdMemo.data);

  // 「新しいメモを作成」欄の初期化
  titleInput.value = "";
  contentInput.value = "";

  // メモリストの「メモがありません」メッセージの更新
  updateNoMemoMessage();
});

// 読み取り（GET）
memoList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("bi-pencil-square")) {
    // 選択されたメモの取得
    const memoItem = event.target.closest(".memo-item");
    const selectedMemo = await axios.get(`/api/memos/${memoItem.dataset.id}`);

    // モーダルの内容の更新
    const { title, content, _id } = selectedMemo.data;
    editTitleInput.value = title;
    editContentInput.value = content;
    memoItem.dataset.id = _id;

    // 編集中のメモの情報の更新
    editingMemoId = _id;
    editingMemoItem = memoItem;

    // モーダルの表示
    const myModal = new bootstrap.Modal(document.getElementById("memoModal"));
    myModal.show();
  }
});

// 編集（PUT）
editSaveButton.addEventListener("click", async (event) => {
  // メモを更新
  await axios.put(`/api/memos/${editingMemoId}`, {
    title: editTitleInput.value,
    content: editContentInput.value,
  });

  // メモリストに表示されているタイトルと内容の更新
  editingMemoItem.querySelector(".memo-list-title").textContent =
    editTitleInput.value;
  editingMemoItem.querySelector(".memo-list-content").textContent =
    editContentInput.value;

  // モーダルの非表示
  const memoModal = document.getElementById("memoModal");
  const bsModal = bootstrap.Modal.getInstance(memoModal);
  bsModal.hide();
});

// 削除（DELETE）
memoList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("bi-trash")) {
    const memoItem = event.target.closest(".memo-item");

    // データベース上で削除
    await axios.delete(`/api/memos/${memoItem.dataset.id}`);

    // HTMLファイル上で削除
    memoItem.remove();
  }

  // メモリストの「メモがありません」メッセージの更新
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

  // HTMLElementに変換し、idを付与
  const memoItem = clone.querySelector(".memo-item");
  memoItem.dataset.id = _id;

  return memoItem;
};

const updateMemoList = function (data) {
  const newMemo = createMemo(data);
  memoList.append(newMemo);
};

const updateNoMemoMessage = function () {
  const memoItems = document.querySelectorAll(".memo-item");
  if (memoItems.length > 0) {
    noMemoMessage.style.display = "none";
  } else {
    noMemoMessage.style.display = "block";
  }
};
