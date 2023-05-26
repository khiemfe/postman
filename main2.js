var courseAPI = 'http://localhost:3000/courses'

// fetch(courseAPI)
//     .then(course => {
//         return course.json()
//     })
//     .then(data => {
//         render(data)
//     })
//or
function start() {
    getCourses(render)
    handlecreateForm()
}
start()

function render(courses) {
    var list_courses = document.querySelector('#list-courses')
    var htmls = courses.map(course => {
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
    })
    list_courses.innerHTML = htmls.join('')
}

function getCourses(callback) {
    fetch(courseAPI)
    .then(course => {
        return course.json()
    })
    .then(callback)
}

//khi nhấn vào nút btn hoặc nhấn enter nó sẽ hoạt động hàm này để POST
function click_course() {
    var nameInput = document.querySelector('input[name="name"]')
    var descriptionInput = document.querySelector('input[name="description"]')
    
    var name = nameInput.value
    var description = descriptionInput.value
    var formData = {
        name: name,
        description: description
    }
    if(name != '' && description != '') {
        createCourse(formData,() => {
            getCourses(render)
        })
        nameInput.value = ''
        descriptionInput.value = ''

        var list_courses_2 = document.querySelector('#list-courses')
        list_courses_2.scrollTo(0, 1000000000000000)
    }
}
function handlecreateForm() {
    var create = document.querySelector('#create')
    create.addEventListener('click', click_course)
}
var create = document.querySelector('#create')
document.addEventListener('keypress', function(e) {
    if(create.classList.contains('block') && e.code === 'Enter') {
        click_course()
    }
})
function createCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }
    fetch(courseAPI, options)
        // .then(course => {
        //     course.json()
        // })
        .then(callback)
}

function handleDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    }
    fetch(courseAPI + '/' + id, options)
        .then(() => {
            // getCourses(render)
            //or
            var courseItem = document.querySelector('.course-item-' + id)
            courseItem ? courseItem.remove() : courseItem
        })
}

function handlePutCourse(id) {
    var nameInput = document.querySelector('input[name = name]')
    var descriptionInput = document.querySelector('input[name = description]')

    var courseItem = document.querySelector('.course-item-' + id)
    var name = courseItem.querySelector('h4').textContent
    var description = courseItem.querySelector('p').textContent

    nameInput.value = name
    descriptionInput.value  = description

    var createBtn = document.getElementById('create')
    var saveBtn = document.getElementById('save')
    createBtn.classList.add('none')
    createBtn.classList.remove('block')
    saveBtn.classList.remove('none')
    saveBtn.classList.add('block')

    saveBtn.addEventListener('click', () => {
        var formData = {
            name: nameInput.value,
            description: descriptionInput.value
        }
        createBtn.classList.add('block')
        createBtn.classList.remove('none')
        saveBtn.classList.remove('block')
        saveBtn.classList.add('none')
        updateCourse(id, formData, () => {
            nameInput.value = ''
            descriptionInput.value = ''
            getCourses(render)
        })
    })
    var save = document.querySelector('#save')
    document.addEventListener('keypress', function(e) {
        if(save.classList.contains('block') && e.code === 'Enter') {
            console.log(1)
            var formData = {
                name: nameInput.value,
                description: descriptionInput.value
            }
            createBtn.classList.add('block')
            createBtn.classList.remove('none')
            saveBtn.classList.remove('block')
            saveBtn.classList.add('none')
            updateCourse(id, formData, () => {
                nameInput.value = ''
                descriptionInput.value = ''
                getCourses(render)
            })
        }
    })
}

function updateCourse(id, data, callback) {
    var options = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
    fetch(courseAPI + '/' + id, options)
        .then(callback)
}
