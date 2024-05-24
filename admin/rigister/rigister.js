const form = document.querySelector("form");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const cfPassword = document.querySelector("#cfPassword");

// Show Password

// Thông báo khi lỗi
function showError(input, message) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.add("error");
  small.textContent = message;
}

// Thông báo khi thành công
function showSuccess(input) {
  let parent = input.parentElement;
  let small = parent.querySelector("small");
  parent.classList.remove("error");
  small.textContent = "";
}

// Check rỗng
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

// Check Email
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

//khởi tạo từ form -> cfpass
let formRigister = document.getElementById("formRigister");

// console.log(formRigister.name);
// // tạo function onsubmit
function submitForm(event) {
  event.preventDefault();
  let userList = JSON.parse(localStorage.getItem(USER_LOCAL)) || [];

  let id = 1;
  //status thể hiện tài khoản có bị admin khóa hay ko
  let status = true;
  //role thể hiện cấp độ của user (có 2 cấp: admin và user)
  let role = "user";
  if (userList.length > 0) {
    id = userList[userList.length - 1].id + 1;
  }

  //tạo ra 1 biến để lưu dữ liệu user
  let newUser = {
    id,
    name: formRigister.name.value,
    email: formRigister.email.value,
    password: formRigister.password.value,
    status: status,
    role: role,
  };
  let checkEmplty = checkEmptyError([username, email, password, cfPassword]);
  let checkEmail = checkEmailError(email);
  let checkLengthUser = checkLengthError(username, "username", 6, 20);
  let checkLengthPass = checkLengthError(password, "password", 8, 20);
  let checkcfPass = checkCfPassword(password, cfPassword);
  if (
    !checkEmplty &&
    !checkEmail &&
    !checkLengthUser &&
    !checkLengthPass &&
    !checkcfPass
  ) {
    let index = userList.findIndex(
      (el) => el.email === formRigister.email.value
    );
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
    localStorage.setItem("userList", JSON.stringify(userList));
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Đăng ký thành công",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => (window.location.href = "#"));
  } else {
    Swal.fire({
      title: "Error!",
      text: "Đăng ký thất bại !!!",
      icon: "error",
      confirmButtonText: "Cancel",
    });
  }
}

//Khởi tạo account admin và check xem trong database có tài khoản admin chưa
function find() {
  let userList = JSON.parse(localStorage.getItem("userList")) || [];
  //Khởi tạo account admin có các trường...
  let admin = {
    id: 1,
    name: "admin",
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
    status: true,
  };
  //tạo mảng chứa account
  let admins = [];
  //push account vào mảng
  admins.push(admin);
  // console.log(userList.findIndex(item=>item.email === email.value));
  //tìm vị trí account trong mảng
  let userIdIndex = userList.findIndex((item) => item.email === admin.email);
  if (userIdIndex < 0) {
    //trường hợp không có account trong database thì push account admin lên database
    localStorage.setItem("userList", JSON.stringify(admins));
  } else {
    //không làm j vì đã có tài khoản
  }
}
find();
