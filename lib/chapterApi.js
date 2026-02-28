// ✅ GET ALL CHAPTERS
export async function getAllChapters() {
  const res = await fetch("/api/chapters");

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch chapters");
  }

  return data;
}

// ✅ GET ONE CHAPTER
export async function getChapterById(id) {
  const res = await fetch(`/api/chapters/${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch chapter");
  }

  return data;
}

// ✅ CREATE CHAPTER
export async function createChapter(payload) {
  const res = await fetch("/api/chapters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create chapter");
  }

  return data;
}

// ✅ UPDATE CHAPTER
export async function updateChapter(id, payload) {
  const res = await fetch(`/api/chapters/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update chapter");
  }

  return data;
}

// ✅ DELETE CHAPTER
export async function deleteChapter(id) {
  const res = await fetch(`/api/chapters/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete chapter");
  }

  return data;
}
