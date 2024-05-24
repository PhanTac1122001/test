//B7 Khởi tạo các giá trị 
let pageSize = 5;
let totalPage = 1;
let currentPage = 1;

let textSearch = "";
let categoryFilter = "All";

const pageList = document.getElementById('page-list');
const tbodyHTML = document.getElementById('tbody');


//Hiển thị và bật tắt form add product
const formScopeHTML = document.getElementById('form-scope');
function openForm() {
    formScopeHTML.classList.remove('hidden');
}
function closeForm() {
    formScopeHTML.classList.add('hidden');
}
//end add product

//B6 : lưu lên local JSON
const PRODUCTS = "Product_04";

// B2: nhập dữ liệu vào input -> gửi phương thức submid
function submitForm(e) {
    e.preventDefault();
    //hàm sự kiện load lại trang
    const formData = new FormData(e.target);
    const values = {};
    for (let [name, value] of formData.entries()) {
        values[name] = value;
    }

    values.price = +values.price;
    values.quantity = +values.quantity;
    //add convertToBase64 vào image imageBase64
    values.image = imageBase64;

    let check = validateFileds(values);//B5 thêm trường kiểm tra check 

    //B6: lưu lên local JSON
    if (check) {
        const products = JSON.parse(localStorage.getItem(PRODUCTS)) || [];
        let id = 1;
        if (products.length > 0) {
            id = products[products.length - 1].id + 1;
        }
        values.id = id;
        values.status = true;
        products.push(values)
        localStorage.setItem(PRODUCTS, JSON.stringify(products))
        e.target.reset();
        imageProductHTML.src = "";
        imageBase64 = null;
        closeForm();
        render();
    }
}

render();

//Hàm render lọc qua các giá trị product
function render() {
    let realProducts = JSON.parse(localStorage.getItem(PRODUCTS)) || [];

    //lọc theo category
    if (categoryFilter !== 'All') {
        realProducts = realProducts.filter(product => product.category === categoryFilter);
    }
    //lọc theo search
    realProducts = realProducts.filter(product => product.name.toLowerCase().includes(textSearch));

    renderPaginations(realProducts);
    renderProducts(realProducts);
}

//B10 xem số page của trang quá page == 5
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








//B11 hiển thị sản phẩm sang trang
function renderProducts(products) {
    let stringHTML = ""
    let start = (currentPage - 1) * pageSize;
    let end = start + pageSize
    if (end > products.length) {
        end = products.length
    }
    for (let i = start; i < end; i++) {
        stringHTML +=
            `
                <tr>
                    <td>${products[i].id}</td>
                    <td>
                        <img width="52px" src="${products[i].image}" alt="img">
                    </td>
                    <td>${products[i].name}</td>
                    <td>${formatMoney(products[i].price)}</td>
                    <td>${products[i].quantity}</td>
                    <td>${products[i].description}</td>
                    <td>${products[i].category}</td>
                    <td>${products[i].status ? "Active" : "Block"}</td>
                    <td>
                        <button>Edit</button>
                        <button onClick="changeStatus(${i})">${products[i].status ? "Block" : "Active"}</button>
                    </td>
                </tr>
            `
    }
    tbodyHTML.innerHTML = stringHTML
}

//B12 nhảy trang khi click
function clickPage(i) {
    currentPage = i;
    render();
}

//B13 nhấn trái phải nút button
function changePage(status) {
    if (status === -1 && currentPage > 1) {
        currentPage -= 1;
    }
    if (status === 1 && currentPage < totalPage) {
        currentPage += 1;
    }
    render();
}
    
//B14 tăng số lượng product của 1 trang
function changePageSize(e) {
    pageSize = e.target.value;
    currentPage = 1;
    render();
}

//B15 : thay đổi bộ lọc category
function changeCategory(e) {
    categoryFilter = e.target.value;
    currentPage = 1;
    render();
}

//B16 ìm kiếm theo tên sản phẩm
function changeTextSearch() {
    textSearch = e.target.value.toLowerCase();
    currentPage = 1;
}

//B17 ẩn đi khỏi danh sách người dùng

function changeStatus(i) {
    const products = JSON.parse(localStorage.getItem(PRODUCTS));
    products[i].status = !products[i].status;
    localStorage.setItem(PRODUCTS, JSON.stringify(products));
    render();
} 