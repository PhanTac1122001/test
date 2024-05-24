
const btnAdd = document.getElementById("btn-add")
const form = document.getElementById("form-scope")
const userName = document.getElementById('name')
const email = document.getElementById('email')
const password = document.getElementById('password')
const gender = document.getElementById('gender')
const errorName = document.getElementById("error-name")
const btnCancel = document.getElementById("btn-cancel")
const btnSubmit = document.getElementById("btn-submit")
const btnSearch = document.getElementById("btn-search")
const btnStatus = document.getElementById("btn-status")
const tableUser = document.getElementById("tbody");

const pageList = document.getElementById('page-list');

let idUpdate = null;
const USER_LOCAL = "userList";

let sortBy = "All"
let pageSize = 5;
let totalPage = 1;
let currentPage = 1;

let textSearch = "";
let userFilter = "All";


btnSearch.addEventListener("click", function () {
    const textSearch = document.getElementById("text-search").value.toLowerCase();

    const userList = JSON.parse(localStorage.getItem(USER_LOCAL))

    const userFilter = userList.filter(item => item.name.toLowerCase().includes(textSearch))

    render(userFilter);
})

btnAdd.addEventListener('click', function () {
    form.classList.remove('hidden')
})

btnCancel.addEventListener("click", function () {
    userName.value = '';
    email.value = '';
    password.value = '';
    errorName.innerHTML = '';
    btnSubmit.innerText = "Đăng ký";
    idUpdate = null;
    form.classList.add("hidden");
})
function submitForm(event) {
    event.preventDefault();
    if (idUpdate) {
        const userList = JSON.parse(localStorage.getItem(USER_LOCAL)) || [];
        if (userName.value.length < 2) {
            errorName.innerText = `Lỗi`;
            return;
        } else {
            errorName.innerText = ``;
        }

        const index = userList.findIndex(item => item.name === userName.value)
        if (index !== -1) {
            errorName.innerText = "Name bị trùng";
            return
        }
        else {
            errorName.innerText = "";
        }
        const indexUpdate = userList.findIndex(item => item.id === idUpdate)
        userList[indexUpdate].name = userName.value;
        localStorage.setItem(USER_LOCAL, JSON.stringify(userList))
        btnCancel.click()
        idUpdate = null;
        render()
        return
    }
    else {
        errorName.innerText = "";
    }

    let id = 1;
    const userList = JSON.parse(localStorage.getItem(USER_LOCAL)) || [];
    if (userList.length > 0) {
        id = userList[userList.length - 1].id + 1
    }
    if (userName.value.length < 2) {
        errorName.innerText = `Lỗi`;
        return;
    } else {
        errorName.innerText = ``;
    }

    const index = userList.findIndex(item => item.name === userName.value)
    if (index !== -1) {
        errorName.innerText = "Name bị trùng";
        return
    }
    else {
        errorName.innerText = "";
    }
    const user = {
        id,
        name: userName.value,
        email: email.value,
        password: password.value,
        gender: gender.value,
        status: true,
        role: true,
    }

    userList.push(user)

    localStorage.setItem(USER_LOCAL, JSON.stringify(userList))


    userName.value = "";

    form.classList.add("hidden")

    render();

}
function renderPaginations(users) {

    totalPage = Math.ceil(users.length / pageSize); //làm trên lên 
    let stringHTML = ""
    for (let i = 1; i <= totalPage; i++) {
        if (currentPage === i) {
            stringHTML += `
            <span class="page-item page-active" onclick="clickPage(${i})">${i}</span>
            `
        }
        else {
            stringHTML += `
            <span class="page-item " onclick="clickPage(${i})">${i}</span>
            `
        }
    }
    pageList.innerHTML = stringHTML;
}

function render(data) {
    let userList = JSON.parse(localStorage.getItem(USER_LOCAL));

    if (Array.isArray(data)) {
        userList = data
    }

    if (sortBy == "aToZ") {
        userList = userList.sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        })
    }
    else if (sortBy == "zToA") {
        userList = userList.sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return x > y ? -1 : x < y ? 0 : 1;
        })
    }
    else if (sortBy == "STTAscending") {
        userList = userList.sort();
    }
    else if (sortBy == "STTDescending") {
        userList = userList.reverse();
    }

    else if (sortBy !== "All") {
        userList = userList.filter(
            (user) => user.name === sortBy
        );
    }
    // if (userFilter !== 'All') {
    //     userList = userList.filter(user => user.category === categoryFilter);
    // }



    renderPaginations(userList);
    renderUser(userList);
}
function renderUser(users) {
    let stringHTML = ""
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize
    if (end > users.length) {
        end = users.length
    }
    for (let i = start; i < end; i++) {

        if (users[i].email === "admin@gmail.com") {
            stringHTML += `<tr>
        <td>${users[i].id}</td>
         <td>${users[i].name}</td>
        <td>${users[i].email}</td>
        <td>${users[i].password}</td>
         <td>${users[i].status ? "Active" : "Block"}</td>
        <td>${users[i].role ? "User" : "Admin"}</td>
        </tr>`
        }
        else {
            stringHTML += `<tr>
        <td>${users[i].id}</td>
        <td>${users[i].name}</td>
        <td>${users[i].email}</td>
        <td>${users[i].password}</td>
        <td>${users[i].status ? "Active" : "Block"}</td>
        <td>${users[i].role ? "User" : "Admin"}</td>
        <td>
        <button class="btn-status" onclick="changeStatus(${users[i].id})">${users[i].status ? "<div  class= 'btn-block' >Block</div>" : "<div  class= 'btn-active' >Active</div>"}</button>
        
        </td>
        </tr>
        `}
    }
    tableUser.innerHTML = stringHTML;


}

render();


function deleteCategorys(id) {

    const result = confirm(`Are you sure delete id:${id}`)
    if (!result) {
        return;
    }
    const userList = JSON.parse(localStorage.getItem(USER_LOCAL))

    const index = userList.findIndex(item => item.id === id);

    userList.splice(index, 1)
    localStorage.setItem(USER_LOCAL, JSON.stringify(userList));

    render();
}


function initUpdate(id) {
    idUpdate = id;
    const userList = JSON.parse(localStorage.getItem(USER_LOCAL))

    const index = userList.findIndex(item => item.id === id)

    userName.value = userList[index].name;
    form.classList.remove("hidden")
    btnSubmit.innerText = "Update";
}

function changeStatus(id) {
    const userList = JSON.parse(localStorage.getItem(USER_LOCAL))

    const index = userList.findIndex(item => item.id === id)

    userList[index].status = !userList[index].status

    localStorage.setItem(USER_LOCAL, JSON.stringify(userList))

    render();
}
function logOut() {

    localStorage.removeItem("user_login")
    return Swal.fire({
        position: "center",
        icon: "success",
        title: "Đăng xuất thành công",
        showConfirmButton: false,
        timer: 1500,
    }).then(() => (window.location.href = "../pages/home.html"));

}

function clickPage(i) {
    currentPage = i;
    render();
}
function changePage(status) {
    if (status === -1 && currentPage > 1) {
        currentPage -= 1;
    }
    if (status === 1 && currentPage < totalPage) {
        currentPage += 1;
    }
    render();
}
function changePageSize(e) {
    pageSize = e.target.value;
    currentPage = 1;
    render();
}

function changeUser(e) {

    sortBy = e.target.value;
    currentPage = 1;
    render();
}

