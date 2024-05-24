

const btnAdd = document.getElementById("btn-add")
const form = document.getElementById("form-scope")
const productName = document.getElementById('name')
const image = document.getElementById("image")
const quantity = document.getElementById("quantity")
const color = document.getElementById("color")
const size = document.getElementById("size")
const price = document.getElementById("price")
const errorName = document.getElementById("error-name")
const btnCancel = document.getElementById("btn-cancel")
const btnSubmit = document.getElementById("btn-submit")
const btnSearch = document.getElementById("btn-search")
const selectCategoryId = document.getElementById("categoryId")
const tableProduct = document.getElementById("tbody")
const pageList = document.getElementById('page-list');
const imgProducthiddenHTML = document.getElementById("image-product")


let idUpdate = null;
const PRODUCT_LOCAL = "products";


let imageBase64 = null;
let sortBy = "All"
let pageSize = 5;
let totalPage = 1;
let currentPage = 1;

let textSearch = "";
let userFilter = "All";


function renderCategoryAdd() {
    const categorys = JSON.parse(localStorage.getItem("categorys")) || [];
    let stringHTML = ``;
    for (let i = 0; i < categorys.length; i++) {
        if (categorys[i].status) {
            stringHTML += ` 
        <option value="${categorys[i].name}">${categorys[i].name}</option>
        `
        }
    }
    selectCategoryId.innerHTML = stringHTML;
}
renderCategoryAdd();

btnSearch.addEventListener("click", function () {
    const textSearch = document.getElementById("text-search").value.toLowerCase();

    const products = JSON.parse(localStorage.getItem(PRODUCT_LOCAL))

    const productFilter = products.filter(item => item.name.toLowerCase().includes(textSearch))

    render(productFilter);
})

btnAdd.addEventListener('click', function () {
    form.classList.remove('hidden')
})

btnCancel.addEventListener("click", function () {
    productName.value = '';
    errorName.innerHTML = '';
    btnSubmit.innerText = "Add";
    idUpdate = null;
    form.classList.add("hidden");
})
function submitForm(event) {
    event.preventDefault();
    if (idUpdate) {
        const products = JSON.parse(localStorage.getItem(PRODUCT_LOCAL)) || [];
        if (productName.value.length < 2) {
            errorName.innerText = `Lỗi`;
            return;
        } else {
            errorName.innerText = ``;
        }

        const indexUpdate = products.findIndex(item => item.id === idUpdate)
        products[indexUpdate].name = productName.value;
        products[indexUpdate].categoryId = selectCategoryId.value;
        products[indexUpdate].quantity = quantity.value;
        products[indexUpdate].size = size.value;
        products[indexUpdate].color = color.value;
        products[indexUpdate].price = price.value;
        localStorage.setItem(PRODUCT_LOCAL, JSON.stringify(products))

        btnCancel.click()

        idUpdate = null;
        render()



        return
    }
    else {
        errorName.innerText = "";
    }

    let id = 1;
    const products = JSON.parse(localStorage.getItem(PRODUCT_LOCAL)) || [];
    if (products.length > 0) {
        id = products[products.length - 1].id + 1
    }
    if (productName.value.length < 2) {
        errorName.innerText = `Lỗi`;
        return;
    } else {
        errorName.innerText = ``;
    }

    const index = products.findIndex(item => item.name === productName.value)
    if (index !== -1) {
        errorName.innerText = "Name bị trùng";
        return
    }
    else {
        errorName.innerText = "";
    }
    const product = {
        id,
        image: imgProducthiddenHTML.src,
        name: productName.value,
        categoryId: selectCategoryId.value,
        quantity: quantity.value,
        size: size.value,
        color: color.value,
        price: price.value,
        status: true,

    }

    products.push(product)

    localStorage.setItem(PRODUCT_LOCAL, JSON.stringify(products))


    productName.value = "";

    form.classList.add("hidden")

    render();

}

function renderPaginations(products) {

    totalPage = Math.ceil(products.length / pageSize); //làm trên lên 
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
    let products = JSON.parse(localStorage.getItem(PRODUCT_LOCAL));

    if (Array.isArray(data)) {
        products = data
    }

    if (sortBy == "aToZ") {
        products = products.sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        })
    }
    else if (sortBy == "zToA") {
        products = products.sort(function (a, b) {
            var x = a.name.toLowerCase();
            var y = b.name.toLowerCase();
            return x > y ? -1 : x < y ? 0 : 1;
        })
    }
    else if (sortBy == "STTAscending") {
        products = products.sort();
    }
    else if (sortBy == "STTDescending") {
        products = products.reverse();
    }

    else if (sortBy !== "All") {
        products = products.filter(
            (user) => user.name === sortBy
        );
    }
    // if (userFilter !== 'All') {
    //     products = products.filter(user => user.category === categoryFilter);
    // }



    renderPaginations(products);
    renderProduct(products);
}

function renderProduct(products) {
    let stringHTML = ""
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize
    if (end > products.length) {
        end = products.length
    }
    for (let i = start; i < end; i++) {
        {
            stringHTML += `<tr>
    <td>${products[i].id}</td>
    <td>
    <img width="50px" src="${products[i].image}" alt="img">
    </td>
    <td>${products[i].name}</td>
    <td>${products[i].categoryId}</td>
    <td>${products[i].quantity}</td>
    <td>${products[i].size}</td>
    <td>${products[i].color}</td>    
    <td>${products[i].price}</td>
    <td>${products[i].status ? "Active" : "Block"}</td>
    <td>
    <button class="btn-update" onclick="initUpdate(${products[i].id})">Update</button>
    <button class="btn-status" onclick="changeStatus(${products[i].id})">${products[i].status ? "<div  class= 'btn-block' >Block</div>" : "<div  class= 'btn-active' >Active</div>"}</button>
    <button class="btn-delete" onclick="deleteProducts(${products[i].id})">Delete</button>
    </td>
    </tr>
    `}
        tableProduct.innerHTML = stringHTML;
    }
}
render();



function deleteProducts(id) {

    const result = confirm(`Bạn có muốn xóa id:${id}`)
    if (!result) {
        return;
    }
    const products = JSON.parse(localStorage.getItem(PRODUCT_LOCAL))

    const index = products.findIndex(item => item.id === id);

    products.splice(index, 1)
    localStorage.setItem(PRODUCT_LOCAL, JSON.stringify(products));

    render();
}


function initUpdate(id) {
    idUpdate = id;
    const products = JSON.parse(localStorage.getItem(PRODUCT_LOCAL))

    const index = products.findIndex(item => item.id === id)

    productName.value = products[index].name;
    form.classList.remove("hidden")
    btnSubmit.innerText = "Update";
}

function changeStatus(id) {
    const products = JSON.parse(localStorage.getItem(PRODUCT_LOCAL))

    const index = products.findIndex(item => item.id === id)

    products[index].status = !products[index].status

    localStorage.setItem(PRODUCT_LOCAL, JSON.stringify(products))

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

function convertToBase64() {
    //khởi tạo biến lấy id inputimage
    const fileInput = document.getElementById("image");
    //trường hợp có nhiều ảnh thì lấy ảnh đầu tiên
    //Muốn có chọn nhiều ảnh thì thêm multi ở bên input image
    const file = fileInput.files[0];

    //đọc file
    const reader = new FileReader();
    reader.onload = function (event) {
        const base64 = event.target.result;
        imageBase64 = base64;
        imgProducthiddenHTML.src = imageBase64;
    };

    reader.readAsDataURL(file);
    //kết thúc đọc file
    imgProducthiddenHTML.classList.remove("hidden");
}



