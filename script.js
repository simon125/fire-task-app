const navLinks = document.querySelector('.navbar').querySelectorAll('a.nav-link')
navLinks.forEach(el => {
    el.addEventListener('click', (e) => {
        // console.dir(e.target)
        navLinks.forEach(element => {
            if (element.classList.contains('active')) element.classList.remove('active')

        })
        el.classList.add('active')
        e.preventDefault()
        document.querySelectorAll('section').forEach(section => {

            if (section.id == e.target.name) section.classList.remove('d-none')
            else section.classList.add('d-none')
        })
    })
})

const database = firebase.database() //zmienna do bazy danych
const auth = firebase.auth() // zmienna do autentykacji




const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const registerForm = document.querySelector('#registerForm')
const taskForm = document.querySelector('#taskForm')

const createButton = (className, innerText, handleFunction) => {
    const btn = document.createElement('button')
    btn.classList.add(`btn-${className}`)
    btn.classList.add('btn')
    btn.textContent = innerText
    btn.addEventListener('click', handleFunction)
    return btn
}
const createPrioritySine = (priority) => {
    if (priority == 1) return '!'
    else if (priority == 2) return '!!'
    else if (priority == 3) return '!!!'
    else return "I don't know how but you choose wrong option"
}
const handleDone = (e) => {
    console.log(123)
}
const handleEdit = (e) => {
    console.log(456)
}
const handleDelete = (e) => {
    console.log(789)
}

const createSingleTask = (title, content, start, end, daysLeft, priority) => {
    const btns = [createButton('success', 'Done', handleDone),
    createButton('info', 'Edit', handleEdit),
    createButton('danger', 'Delete', handleDelete)]

    // console.log(start)
    // console.log(end)

    const card = document.createElement('div')
    card.className = 'card my-4'

    card.innerHTML = `
                <div class="card-header d-flex justify-content-between">
                    <h3 class="display-5">${title}</h3>
                    <div class="btn-group">
                      
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">
                        ${content}    
                    </p>
                    <h4>${priority}</h4>
                </div>
                <div class="card-footer d-flex justify-content-around">
                    <div>
                        <strong>Data start: </strong>${start}
                    </div>
                    <div>
                        <strong>Days left: </strong>${daysLeft}
                    </div>
                    <div>
                        <strong>Data end: </strong>${end}
                    </div>
                </div>`
    btns.forEach(el => {
        card.querySelector('.btn-group').appendChild(el)
    })
    return card
}

const calculateLeftDays = (end) => {

    const now = new Date().getTime()
    const distance = end - now
    const daysLeft = Math.floor(distance / (1000 * 60 * 60 * 24))
    // const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    // const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    // const sec = Math.floor((distance % (1000 * 60)) / (1000))
    return daysLeft
}
const createValidFormat = (date) => {

    // console.log(new Date(date).getDay())

    return `${new Date(date).getDay()}.${new Date(date).getMonth()}.${new Date(date).getFullYear()}`
}

//property to jest id np ==> '-LLWH_zImqc37Jelo_LY'
//jezeli nie wybierze sie daty trzeba jakos to przejac
const renderTasksList = (snapshot) => {
    let output = document.querySelector('#output')
    // console.log(output)
    output.innerHTML = ''

    for (let property in snapshot) {

        const { content, taskTitle, startDate, endDate, taskPriority } = snapshot[property]
        const daysLeft = 23//calculateLeftDays(endDate)
        const startDateToDisplay = startDate//createValidFormat(startDate)
        const endDateToDisplay = endDate//createValidFormat(endDate)
        const prioritySine = createPrioritySine(taskPriority)

        const singleTask = createSingleTask(taskTitle, content, startDateToDisplay, endDateToDisplay, daysLeft, prioritySine)
        output.appendChild(singleTask)
    }

}


firebase
    .database()
    .ref('tasks/')
    .on('value', function (snapshot) {
        renderTasksList(snapshot.val())
    });




const handleAddTaskFormSubmit = (e) => {
    e.preventDefault()
    const taskTitle = e.target.taskTitle.value
    const content = e.target.taskContent.value
    const endDate = e.target.dateEnd.value
    const startDate = e.target.dateStart.value
    const taskPriority = e.target.priority.value



    console.dir(e.target.dateEnd.value)

    database.ref('tasks/').push().set({
        taskTitle: taskTitle,
        content: content,
        endDate: endDate,
        startDate: startDate,
        taskPriority: taskPriority
    })
}



//register from submit
const handleRegisterFormSubmit = (e) => {
    e.preventDefault()
    if (emailRegExp.test(e.target.email.value)) {
        e.target.email.classList.remove('is-invalid')

        e.target.email.classList.add('is-valid')

    } else {
        e.target.email.classList.add('is-invalid')
        e.target.email.classList.remove('is-valid')

    }

    setTimeout(() => {
        e.target.email.classList.remove('is-invalid')
        e.target.email.classList.remove('is-valid')
    }, 2000)

    e.target.email.value = ''
}
//register close button
document.getElementById('x-close').addEventListener('click', (e) => {
    e.target.parentElement.parentElement.classList.add('d-none')
})
//register open button
document.getElementById('register-btn').addEventListener('click', (e) => {
    document.querySelector('div.wrapper').classList.remove('d-none')
})

registerForm.addEventListener('submit', handleRegisterFormSubmit)
taskForm.addEventListener('submit', handleAddTaskFormSubmit)

