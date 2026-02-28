export async function getNiveauFullTree(id) {
  if (!id) throw new Error("Niveau ID is required");

  const res = await fetch(`/api/niveaux/${id}/full`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch full niveau");
  }

  return data;
}
