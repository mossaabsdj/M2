// ✅ GET ALL COURSES
export async function getAllCourses() {
  const res = await fetch("/api/courses");

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch courses");
  }

  return data;
}

// ✅ GET ONE COURSE
export async function getCourseById(id) {
  const res = await fetch(`/api/courses/${id}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch course");
  }

  return data;
}

// ✅ CREATE COURSE
export async function createCourse(payload) {
  const res = await fetch("/api/courses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create course");
  }

  return data;
}

// ✅ UPDATE COURSE
export async function updateCourse(id, payload) {
  const res = await fetch(`/api/courses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update course");
  }

  return data;
}

// ✅ DELETE COURSE
export async function deleteCourse(id) {
  const res = await fetch(`/api/courses/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete course");
  }

  return data;
}
