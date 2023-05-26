// ************** JSON server *****************
// là REST API
// là 1 thư viện
// fake ra được một API server (như backend làm)
// có thể tạo ra ứng dụng quản lý sản phẩm, quản lý sinh viên, thêm sửa xóa dữ liệu mà sử dụng Fetch, sử dụng Promise, sử dụng JSON như thật

// var courseApi = 'http://localhost:3000/courses'

// fetch(courseApi)
//          .then(function(response) {
//             return response.json()
//          })
//          .then(function(courses) {
//             setTimeout(function() {
//                console.log(courses) //in ra những gì trên link nhưng bằng javascript types
//             }, 10000)
//          })

// Mock API là Fake API
//******** Postman ********* */
// CRUD:
// - Create: Tạo mới -> POST // tạo thêm trong postman và nó sẽ lưu vào db.json, id tự tăng lên
// - Read: Lấy dữ liệu -> GET
// - Update: Chỉnh sửa -> PUT / PATCH
// - Delete: Xóa -> DELETE
// Việc thêm sửa xóa hay làm gì đó thì đều gửi API qua network

//Postman là công cụ dùng để gửi đi 4 hành động trên


// Quản lý khóa học (Thêm sửa xóa với Fetch và REST API)

// var listCoursesBlock = document.querySelector('#list-courses')

var courseAPI = 'http://localhost:3000/courses'
// var courseAPI = 'https://fakestoreapi.com/products'

function start() {
    // getCourses(function(courses) {
    //     console.log(courses) //(3) [{…}, {…}, {…}]
    //     renderCourses(courses)
    // })
    //or
    getCourses(renderCourses)
    handleCreateForm()
}
//start ứng dụng web lên
start()

// Functions
function getCourses(callback) { //hàm này dùng để chuyển thành javascript types rồi chạy callback
    fetch(courseAPI)
        .then(function(response) { // response là courseAPI
            return response.json()
        })
        .then(callback) //trả về javascript rồi chạy callback
                        // vd như getCourses(renderCourses) thì chạy renderCourses
}

//Thêm
// sau đó gửi đi một yêu cầu để tạo mới dữ liệu với phương thức là POST dùng thằng Fetch
function createCourse(data, callback) {
    // sau khi ta nhập dữ liệu vào ô input ta nhấn Create thì sẽ gửi dữ liệu đi
    var options = {
        method: 'POST',
        // có cái headers này mới in ra name + des mà ta nhập ở ô input ra trang web
        // còn nếu không có thì nó hiển thị ra undefined ở trang web
        headers: { // headers giống như việc gửi thư thì nó là nhãn thư để cho backend nó hiểu là ta đang mong chờ điều gì
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), //cái này như ta nhập dữ liệu cần thêm vào ở Postman
    }
    fetch(courseAPI, options)
        .then(function(response) {
            response.json()
        })
        .then(callback)
}

//Xóa
function handleDeleteCourse(id) { //xóa dựa theo id
    var options = {
        method: 'DELETE',
        headers: { 
            "Content-Type": "application/json",
        },
        // body: JSON.stringify(data)
    }
    fetch(courseAPI + '/' + id, options) //thêm ' + '/' + id' vào vì khi xóa 1 object thì ta cần thêm id của nó vào ở sau link (URL)
        .then(function(response) {
            response.json()
        })
        //ta dùng hàm này khi click vào nó không xóa liền mà phải đợi reload lại trang mới xóa đi
        .then(function() { //không cần callback vì ta chỉ xóa nó đi thôi
            // getCourses(renderCourses) // dùng hàm này để khi ta click vào nút Xóa thì nó xóa luôn mà không cần reload lại trang (nếu khi xóa nó không mất liền)

            // ta sử dụng xóa bằng cách này để tối ưu hóa hơn, để nó khỏi phải gọi là hàm getCourses(renderCourses), vì mỗi lần gọi là nó sẽ gọi lại API
            var courseItem = document.querySelector('.course-item-' + id)
            if (courseItem) { //nếu có courseItem thì ta xóa khỏi DOM
                courseItem.remove()
            }
        })
}

//rander
function renderCourses(courses) { // hàm này in ra trang web
    var listCoursesBlock = document.querySelector('#list-courses')
    var htmls = courses.map(function(course) {
        return `<li class="course-item-${course.id}">
                    <div class='courses-text'>
                        <h4>${course.name}</h4>
                        <p>${course.description}</p>
                    </div> 
                    <div class='del-edit'>
                        <button onclick="handlePutCourse(${course.id})">Sửa</button>
                        <button onclick="handleDeleteCourse(${course.id})">Xóa</button>
                    </div>
                </li>`
        //ta thêm class="course-item-${course.id}" để xóa thẻ li khi click vào nó tối ưu hơn
        //<button onclick="deleteCourse(${course.id})">Xóa</button> là tạo nút xóa khi click vào, dựa theo id
    })
    listCoursesBlock.innerHTML = htmls.join('')
}

//hàm để xử lý form
function handleCreateForm() { 
    var createBtn = document.querySelector('#create')
    createBtn.onclick = function() { //khi click thì lấy dữ liệu nhập ở 2 ô input ra
        //sau khi click lấy được name và description trong ô input
        var name = document.querySelector('input[name="name"]').value
        var description = document.querySelector('input[name="description"]').value
        var formData = {
            name: name,
            description: description,
        }
        // sau đó gửi đi một yêu cầu để tạo mới dữ liệu với phương thức là POST dùng thằng Fetch
        createCourse(formData,
             function() {
             getCourses(renderCourses) // dùng hàm này để khi ta click vào nút Create thì nó sẽ render ra luôn mà không cần reload lại trang (nếu khi click nó không hiện ra luôn)
        })
    }
}

//4.PATCH Update a course
function handlePutCourse(id, name, description) {
// đặt các biến của ô input khi click vào nút sửa
    var nameInput = document.querySelector('input[name="name"]');
    var descriptionInput = document.querySelector('input[name="description"]');

    //này dùng để khi bấm vào nút sửa thì biến name vs description sẽ nhảy vào ô input:

    //gán name vs description lấy ra từ thẻ h4 vs p
    var courseItem = document.querySelector(".course-item-" + id)
    var name = courseItem.querySelector("h4").textContent //lấy ra giá trị của thẻ h4 (là name)
    var description = courseItem.querySelector("p").textContent //lấy ra giá trị của thẻ p (là description)

    //gán ô input khi bấm nút sửa là giá trị của name vs description (hiện name vs description chính khóa học ta bấm sửa ở ô input)
    nameInput.value = name; 
    descriptionInput.value = description;

    // đổi nút Create thành Save
    var createBtn = document.getElementById('create')
    var saveBtn = document.getElementById('save')
    createBtn.style.display = 'none'
    saveBtn.style.display = 'block'


    // Click vào nút Save thì in ra trang web:
    saveBtn.onclick = function () {
        // Gán biến formData là name vs description ta vừa sửa
        var formData = {
            name: nameInput.value,
            description: descriptionInput.value, 
        };
        //Và in ra giá trị sửa trên web
        // Nút Save trở thành nút Create và input thành rỗng sau khi sửa (PUT)
        saveBtn.style.display = 'none'
        createBtn.style.display = 'block'
        updateCourse(id, formData, function () {
            nameInput.value = "";
            descriptionInput.value = "";
            getCourses(renderCourses) 
        });
    }
}

function updateCourse(id, data, callback) {
    var option = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }
    fetch(courseAPI + "/" + id, option)
        .then(function (response) {
            return response.json()
        })
        .then(callback)
}




// function handlePutForm() { //hàm để xử lý form
//     var courseItem = document.querySelector(".course-item-" + id)
//     var name = courseItem.querySelector("h4").textContent
//     var description = courseItem.querySelector("p").textContent

//     document.querySelector("#update-form").style.display = "block"
//     document.querySelector('input[name="name"]').value = name
//     document.querySelector('input[name="description"]').value = description

    
//     var updateBtn = document.querySelector("#add")

//     updateBtn.onclick = function() {
//         var updateName = document.querySelector('input[name="name"]').value
//         var updateDescription = document.querySelector('input[name="description"]').value

//         var updateData = {
//             name: updateName,
//             description: updateDescription,
//         }

//         var options = {
//             method: 'PUT',
//             headers: { 
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updateData)
//         }
    
//         fetch(courseAPI + '/' + id, options) 
//                 .then(function(response) {
//                     return response.json()
//                 })
//                 .then(function() {
//                     document.querySelector("#update-form").style.display = "none"
//                     getCourses(renderCourses)
//                 })
//     }
    
// }

// function handleUpForm() { //hàm để xử lý form
//     var input_name = document.querySelector('input[name="name"]')
//     var input_description = document.querySelector('input[name="description"]')
//     var input_price = document.querySelector('input[name="price"]')

//     input_name.value = name
//     input_description.value = description
//     input_price.value = price

    
    
//     var createBtn = document.querySelector('#create')
//     var addBtn = document.querySelector('#add')

//     addBtn.onclick = function() {
//         createBtn.innerText = "Save"
//         var data = {
//             name: input_name.value,
//             description: input_description.value,
//             price: input_price.value
//         }

//         var options = {
//             method: 'PUT',
//             headers: { 
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updateData)
//         }
    
//         fetch(courseAPI + '/' + id, options) 
//                 .then(function(response) {
//                     return response.json()
//                 })
//                 .then(function() {
//                     getCourses(courseAPI, function(courses) {
//                         renderCourses(courses)
//                     })
//                 })

//                 createBtn.innerText = "Cr"
//                 input_name.value = ""
//                 input_description.value = ""
//                 input_price.value = ""
//     }
    
// }

// update a course
// function updateForm(id) {
//     var courseItem = document.querySelector(".course-item-" + id);
//     var courseTitle = courseItem.querySelector("h4");
//     var courseDescription = courseItem.querySelector('p');
//     document.querySelector("input[name=\"title\"]").value = courseTitle.innerText;
//     document.querySelector("input[name=\"description\"]").value = courseDescription.innerText;
//     var create = document.getElementById("create");
//     create.hidden = "true";
//     document.getElementById("add").innerHTML = `<button id="save" courseId="${id}">Save</button>`;
//     var save = document.getElementById("save");
//     save.onclick = function() {
//         var title = document.querySelector("input[name=\"title\"]").value;
//         var description = document.querySelector("input[name=\"description\"]").value;
//         var data = {
//             title, 
//             description
//         };
//         handleUpdateCourse(id, data);
//     }
// }

// function handleUpdateCourse(id, data) {
//     var put = {
//         method: "PUT", 
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     }
//     fetch(courseApi + '/' + id, put)
//         .then(function(response) {
//             return response.json();
//         })
//         .then(function() {
//             getCourses(renderCourses);
//             var save = document.getElementById("save");
//             save.hidden = "true";
//             var create = document.getElementById("create");
//             create.hidden = "false";
//         })
// }

