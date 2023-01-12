// initialze the modal
const modal = document.querySelector('.modal');
M.Modal.init(modal);


const form = document.querySelector('form');
const eName = document.querySelector('#name');
const parent = document.querySelector('#parent');
const department = document.querySelector('#department');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('employees').add({
        name: eName.value,
        parent: parent.value,
        department: department.value
    });

    // close the modal on successful addition of employee
    let instance = M.Modal.getInstance(modal)
    instance.close();

    form.reset();
});

