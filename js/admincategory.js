
const btnAdd = document.getElementById("btn-add")
const form = document.getElementById("form-scope")
const categoryName = document.getElementById('name')
const errorName = document.getElementById("error-name")
const btnCancel = document.getElementById("btn-cancel")
const btnSubmit = document.getElementById("btn-submit")
const btnSearch = document.getElementById("btn-search")
const tableCategory = document.getElementById("tbody")

let idUpdate = null;
const CATEGORY_LOCAL = "categorys";

btnSearch.addEventListener("click", function () {
    const textSearch = document.getElementById("text-search").value.toLowerCase();

    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL))

    const categoryFilter = categorys.filter(item => item.name.toLowerCase().includes(textSearch))

    render(categoryFilter);
})

btnAdd.addEventListener('click', function () {
    form.classList.remove('hidden')
})

btnCancel.addEventListener("click", function () {
    categoryName.value = '';
    errorName.innerHTML = '';
    btnSubmit.innerText = "Add";
    idUpdate = null;
    form.classList.add("hidden");
})
function submitForm(event) {
    event.preventDefault();
    if (idUpdate) {
        const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || [];
        if (categoryName.value.length < 2) {
            errorName.innerText = `Không để trống`;
            return;
        } else {
            errorName.innerText = ``;
        }

        const index = categorys.findIndex(item => item.name === categoryName.value)
        if (index !== -1) {
            errorName.innerText = "Name bị trùng";
            return
        }
        else {
            errorName.innerText = "";
        }
        const indexUpdate = categorys.findIndex(item => item.id === idUpdate)
        categorys[indexUpdate].name = categoryName.value;
        localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys))

        btnCancel.click()

        idUpdate = null;
        render()



        return
    }
    else {
        errorName.innerText = "";
    }

    let id = 1;
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL)) || [];
    if (categorys.length > 0) {
        id = categorys[categorys.length - 1].id + 1
    }
    if (categoryName.value.length < 2) {
        errorName.innerText = `Lỗi`;
        return;
    } else {
        errorName.innerText = ``;
    }

    const index = categorys.findIndex(item => item.name === categoryName.value)
    if (index !== -1) {
        errorName.innerText = "Name bị trùng";
        return
    }
    else {
        errorName.innerText = "";
    }
    const category = {
        id,
        name: categoryName.value,
        status: true,

    }

    categorys.push(category)

    localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys))


    categoryName.value = "";

    form.classList.add("hidden")

    render();

}

function render(data) {
    let categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL));

    if (Array.isArray(data)) {
        categorys = data
    }


    let stringHTML = ``;

    for (let i in categorys) {
        stringHTML += `<tr>
    <td>${categorys[i].id}</td>
    <td>${categorys[i].name}</td>
    <td>${categorys[i].status ? "Active" : "Block"}</td>
    <td>
    <button class="btn-update" onclick="initUpdate(${categorys[i].id})">Update</button>
    <button class="btn-status" onclick="changeStatus(${categorys[i].id})">${categorys[i].status ? "<div  class= 'btn-block' >Block</div>" : "<div  class= 'btn-active' >Active</div>"}</button>
    <button class="btn-delete" onclick="deleteProducts(${categorys[i].id})">Delete</button>
    </td>
    </tr>
    `}
    tableCategory.innerHTML = stringHTML;



}

render();


function deleteCategorys(id) {

    const result = confirm(`Are you sure delete id:${id}`)
    if (!result) {
        return;
    }
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL))

    const index = categorys.findIndex(item => item.id === id);

    categorys.splice(index, 1)
    localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys));

    render();
}


function initUpdate(id) {
    idUpdate = id;
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL))

    const index = categorys.findIndex(item => item.id === id)

    categoryName.value = categorys[index].name;
    form.classList.remove("hidden")
    btnSubmit.innerText = "Update";
}

function changeStatus(id) {
    const categorys = JSON.parse(localStorage.getItem(CATEGORY_LOCAL))

    const index = categorys.findIndex(item => item.id === id)

    categorys[index].status = !categorys[index].status

    localStorage.setItem(CATEGORY_LOCAL, JSON.stringify(categorys))

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
