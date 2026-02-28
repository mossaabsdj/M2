// ✅ GET ALL SERIES
export async function getAllSeries() {
  const res = await fetch("/api/series");

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch series");
  }

  return data;
}

// ✅ GET ONE SERIES
export async function getSeriesById(id) {
  const res = await fetch(`/api/series/${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch series");
  }

  return data;
}

// ✅ CREATE SERIES
export async function createSeries(payload) {
  const res = await fetch("/api/series", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create series");
  }

  return data;
}

// ✅ UPDATE SERIES
export async function updateSeries(id, payload) {
  const res = await fetch(`/api/series/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update series");
  }

  return data;
}

// ✅ DELETE SERIES
export async function deleteSeries(id) {
  const res = await fetch(`/api/series/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete series");
  }

  return data;
}
