let students = JSON.parse(localStorage.getItem("students")) || [];

let editIndex = null;

const form = document.getElementById("studentForm");

const studentList = document.getElementById("studentList");

const searchInput = document.getElementById("search");


function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}


function displayStudents(data = students) {

    studentList.innerHTML = "";

    if (data.length === 0) {

        studentList.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    No students found.
                </td>
            </tr>
        `;

    } else {

        data.forEach((student) => {

            let index = students.indexOf(student);

            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.matric)}</td>
                <td>${escapeHTML(student.department)}</td>
                <td>${escapeHTML(student.level)}</td>
                <td>${escapeHTML(student.email)}</td>
                <td>${escapeHTML(student.phone)}</td>

                <td>
                    <button class="edit-btn" onclick="editStudent(${index})">
                        Edit
                    </button>

                    <button class="delete-btn" onclick="deleteStudent(${index})">
                        Delete
                    </button>
                </td>
            `;

            studentList.appendChild(row);

        });

    }

    updateStatistics();

}


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);

}


function updateStatistics() {

    document.getElementById("totalStudents").textContent =
        students.length;

    let departments = [...new Set(
        students.map(student => student.department)
    )];

    document.getElementById("totalDepartments").textContent =
        departments.length;

    document.getElementById("totalRecords").textContent =
        students.length;

}


form.addEventListener("submit", function(e) {

    e.preventDefault();

    const student = {

        name: document.getElementById("name").value.trim(),

        matric: document.getElementById("matric").value.trim(),

        department: document.getElementById("department").value,

        level: document.getElementById("level").value,

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim()

    };


    const duplicate = students.some((item, index) => {

        return item.matric.toLowerCase() === student.matric.toLowerCase()
        && index !== editIndex;

    });


    if (duplicate) {

        alert("A student with this matric number already exists.");

        return;

    }


    if (editIndex === null) {

        students.push(student);

        alert("Student registered successfully!");

    } else {

        students[editIndex] = student;

        alert("Student information updated successfully!");

        editIndex = null;

        document.getElementById("formTitle").textContent =
            "Register New Student";

        document.getElementById("submitBtn").textContent =
            "Register Student";

    }


    saveStudents();

    displayStudents();

    form.reset();

});


function editStudent(index) {

    const student = students[index];

    document.getElementById("name").value = student.name;

    document.getElementById("matric").value = student.matric;

    document.getElementById("department").value = student.department;

    document.getElementById("level").value = student.level;

    document.getElementById("email").value = student.email;

    document.getElementById("phone").value = student.phone;


    editIndex = index;

    document.getElementById("formTitle").textContent =
        "Update Student Information";

    document.getElementById("submitBtn").textContent =
        "Update Student";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function deleteStudent(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {

        students.splice(index, 1);

        saveStudents();

        displayStudents();

        if (editIndex === index) {

            editIndex = null;

            form.reset();

            document.getElementById("formTitle").textContent =
                "Register New Student";

            document.getElementById("submitBtn").textContent =
                "Register Student";

        } else if (editIndex !== null && editIndex > index) {

            editIndex--;

        }

        alert("Student deleted successfully!");

    }

}


searchInput.addEventListener("input", function() {

    const searchValue = this.value.toLowerCase();

    const filteredStudents = students.filter(student => {

        return (

            student.name.toLowerCase().includes(searchValue) ||

            student.matric.toLowerCase().includes(searchValue) ||

            student.department.toLowerCase().includes(searchValue) ||

            student.email.toLowerCase().includes(searchValue) ||

            student.level.toLowerCase().includes(searchValue)

        );

    });

    displayStudents(filteredStudents);

});


displayStudents();
