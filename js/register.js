
const formRegiter = document.getElementById("form-regiter")

const username = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const cfPassword = document.querySelector("#confirmpassword");

const USER_LOCAL = "userList";

function showSuccess(input) {
    let parent = input.parentElement;
    let small = parent.querySelector("small");
    parent.classList.remove("error");
    small.textContent = "";
}

function showError(input, message) {
    let parent = input.parentElement;
    let small = parent.querySelector("small");
    parent.classList.add("error");
    small.textContent = message;
}

function checkEmptyError(listInput) {
    let checkEmpty = false;

    for (let i = 0; i < listInput.length; i++) {
        let input = listInput[i];
        input.value = input.value.trim(); // không được để khoảng trống
        if (!input.value) {
            checkEmpty = true;
            showError(input, "Không được để trống");
        } else {
            showSuccess(input);
        }
    }
    return checkEmpty;
}
function checkEmailError(input) {
    let regexEmail =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    input.value = input.value.trim();
    let checkEmail = regexEmail.test(input.value);
    if (checkEmail) {
        showSuccess(input);
        return false;
    } else if (input.value == "") {
        showError(input, "Không được để trống");
        return true;
    } else {
        showError(input, "Email sai định dạng");
        return true;
    }
}
// Check độ dài username và password
function checkLengthError(input, name, min, max) {
    input.value = input.value.trim();

    if (input.value.length == 0) {
        showError(input, "Không được để trống");
        return true;
    } else if (input.value.length < min) {
        showError(input, `${name} không được nhỏ hơn ${min} ký tự`);
        return true;
    } else if (input.value.length > max) {
        showError(input, `${name} không được lớn hơn ${max} ký tự`);
        return true;
    } else {
        showSuccess(input);
        return false;
    }
}

// check confirm Password
function checkCfPassword(password, cfPassword) {
    if (cfPassword.value == "") {
        showError(cfPassword, "Không được để trống");
    } else if (password.value !== cfPassword.value) {
        showError(cfPassword, "Mật khẩu không trùng khớp");
        return true;
    } else {
        showSuccess(cfPassword);
        return false;
    }
}

function submitForm(event) {
    event.preventDefault();
    let userList = JSON.parse(localStorage.getItem(USER_LOCAL)) || [];
    let id = 1;
    let status = true;
    let role = true;
    if (userList.length > 0) {
        id = userList[userList.length - 1].id + 1;
    }
    let newUser = {
        id,
        name: formRegiter.name.value,
        
        email: formRegiter.email.value,
        password: formRegiter.password.value,
        status: status,
        role: role,
    };

    let checkEmplty = checkEmptyError([username, email, password, cfPassword]);
    let checkEmail = checkEmailError(email);
    let checkLengthUser = checkLengthError(username, "name", 6, 20);
    let checkLengthPass = checkLengthError(password, "password", 6, 20);
    let checkcfPass = checkCfPassword(password, cfPassword);
    if (!checkEmplty && !checkEmail && !checkLengthUser && !checkLengthPass && !checkcfPass) {

        let index = userList.findIndex((el) => el.email === formRegiter.email.value);
        console.log(index);
        if (index !== -1) {
            Swal.fire({
                title: "Error!",
                text: "Email bạn đăng kí đã tồn tại !!!",
                icon: "error",
                confirmButtonText: "Cancel",
            });
            return;
        }
        userList.push(newUser);
        localStorage.setItem(USER_LOCAL, JSON.stringify(userList));
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Đăng ký thành công",
            showConfirmButton: false,
            timer: 1500,
        }).then(() => (window.location.href = "../pages/login.html"));
    }
    else {
        Swal.fire({
            title: "Error!",
            text: "Đăng ký thất bại !!!",
            icon: "error",
            confirmButtonText: "Cancel",
        });
    }

}

// function find() {
//     let userList = JSON.parse(localStorage.getItem("userList")) || [];
//     //Khởi tạo account admin có các trường...
//     let admin = {
//         id: 1,
//         name: "admin",
//         email: "admin@gmail.com",
//         password: "admin",
//         role: false,
//         status: true,
//     };
//     //tạo mảng chứa account
//     let admins = [];
//     //push account vào mảng
//     admins.push(admin);
//     // console.log(userList.findIndex(item=>item.email === email.value));
//     //tìm vị trí account trong mảng
//     let userIdIndex = userList.findIndex((item) => item.email === admin.email);
//     if (userIdIndex < 0) {
//         //trường hợp không có account trong database thì push account admin lên database
//         localStorage.setItem("userList", JSON.stringify(admins));
//     } else {
//         //không làm j vì đã có tài khoản
//     }
// }
// find();