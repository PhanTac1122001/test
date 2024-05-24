function find() {
    let userList = JSON.parse(localStorage.getItem("userList")) || [];
    
    let admin = {
        id: 1,
        name: "admin",
        email: "admin@gmail.com",
        password: "admin",
        role: false,
        status: true,
    };
    
    let admins = [];
    
    admins.push(admin);
   
    let userIdIndex = userList.findIndex((item) => item.email === admin.email);
    if (userIdIndex < 0) {  
        localStorage.setItem("userList", JSON.stringify(admins));
    } else {
        
    }
}
find();