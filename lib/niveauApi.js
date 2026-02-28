// GET ALL
export async function getAllNiveaux() {
  const res = await fetch("/api/niveaux");

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch niveaux");
  }

  return data;
}

// GET ONE
export async function getNiveauById(id) {
  const res = await fetch(`/api/niveaux/${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch niveau");
  }

  return data;
}

// CREATE
export async function createNiveau(payload) {
  const res = await fetch("/api/niveaux", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create niveau");
  }

  return data;
}

// UPDATE
export async function updateNiveau(id, payload) {
  const res = await fetch(`/api/niveaux/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update niveau");
  }

  return data;
}

// DELETE
export async function deleteNiveau(id) {
  const res = await fetch(`/api/niveaux/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete niveau");
  }

  return data;
}
