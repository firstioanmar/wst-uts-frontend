const apiUrl = "http://localhost:3000/mahasiswa";  // URL API backend

// Check if user is authenticated
if (!sessionStorage.getItem("authenticated")) {
  window.location.href = "login.html";
}

// Logout function
function logout() {
  sessionStorage.removeItem("authenticated");
  window.location.href = "login.html";
}

// Fetch and display student data
async function fetchMahasiswa() {
  try {
    const response = await fetch(apiUrl);
    const mahasiswa = await response.json();
    const tableBody = document.getElementById("mahasiswaTableBody");
    tableBody.innerHTML = "";

    mahasiswa.forEach((mhs) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${mhs.id}</td>
        <td>${mhs.nama}</td>
        <td>${mhs.kelas}</td>
        <td>
          <button class="btn btn-warning btn-sm me-2" onclick="editMahasiswa('${mhs.id}', '${mhs.nama}', '${mhs.kelas}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn btn-danger btn-sm" onclick="confirmDelete('${mhs.id}')"><i class="fas fa-trash-alt"></i> Hapus</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching mahasiswa:", error);
  }
}

// Add or Edit Student Form Submission Handler
document.getElementById("addForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const npm = document.getElementById("npm").value;
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;

  if (currentNpm) {
    // Edit existing student
    try {
      await fetch(`${apiUrl}/${currentNpm}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, kelas })
      });
      fetchMahasiswa();
      resetForm();
    } catch (error) {
      console.error("Error updating mahasiswa:", error);
    }
  } else {
    // Add new student
    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ npm, nama, kelas })
      });
      fetchMahasiswa();
      resetForm();
    } catch (error) {
      console.error("Error adding mahasiswa:", error);
    }
  }
});

let currentNpm = null;

function editMahasiswa(npm, nama, kelas) {
  currentNpm = npm;
  document.getElementById("npm").value = npm;
  document.getElementById("nama").value = nama;
  document.getElementById("kelas").value = kelas;
  document.getElementById("npm").readOnly = true;

  // Change button text to "Edit"
  document.querySelector("#addForm button[type='submit']").textContent = "Edit";
}

// Confirm and delete student
let studentToDelete = null;

function confirmDelete(npm) {
  studentToDelete = npm;
  const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  deleteModal.show();
}

document.getElementById("confirmDelete").addEventListener("click", async () => {
  if (studentToDelete) {
    try {
      await fetch(`${apiUrl}/${studentToDelete}`, { method: "DELETE" });
      fetchMahasiswa();
      studentToDelete = null;

      // Close the modal
      const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
      deleteModal.hide();
    } catch (error) {
      console.error("Error deleting mahasiswa:", error);
    }
  }
});

// Reset form after adding or editing a student
function resetForm() {
  document.getElementById("npm").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("kelas").value = "";
  document.getElementById("npm").readOnly = false;
  document.querySelector("#addForm button[type='submit']").textContent = "Tambah";
  currentNpm = null;
}

// Initialize
fetchMahasiswa();
