// const getButton = document.querySelector("#get-button");
const createButton = document.querySelector("#create-button");
const titleInput = document.querySelector("#title-input");
const contentInput = document.querySelector("#content-input");
const memoTemplate = document.querySelector("#memo-template");
const memoList = document.querySelector("#memo-list");

// getButton.addEventListener("click", async (event) => {
//   event.preventDefault();

//   const res = await axios.get("/api/memos");
//   console.log(res);
// });

// 作成
createButton.addEventListener("click", async (event) => {
  const title = titleInput.value;
  const content = contentInput.value;
  const createdMemo = await axios.post("/api/memos", { title, content });
  console.log(createdMemo.data);
  updateMemoList(createdMemo.data);
  titleInput.value = "";
  contentInput.value = "";
});

// 編集
memoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("bi-pencil-square")) {
    const memoItem = event.target.closest(".memo-item");
    memoItem.remove();
  }
});

// 削除
memoList.addEventListener("click", async (event) => {
  if (event.target.classList.contains("bi-trash")) {
    const memoItem = event.target.closest(".memo-item");
    await axios.delete(`/api/memos/${memoItem.dataset.id}`);
    memoItem.remove();
  }
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
