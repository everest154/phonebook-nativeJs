(function () {
    let allContacts = JSON.parse(localStorage.getItem('users')) || [];
    let currentContact = {};

    const doc = document;
    const contactList = doc.getElementById('contacts-list');
    const searchField = doc.getElementById('contact-search');
    const btnDeleteContact = doc.getElementById('delete-contact');
    const editContainer = doc.getElementById('edit-container');
    const firstNameField = doc.getElementById('firstName');
    const lastNameField = doc.getElementById('lastName');
    const emailField = doc.getElementById('email');
    const phoneField = doc.getElementById('phone');
    const btnEdit = doc.getElementById('btnEdit');
    const btnSave = doc.getElementById('btnSave');
    const inputs = doc.getElementsByClassName('form-control-values');
    const btnCreateContact = doc.getElementById('btn-create');
    const modal = doc.getElementById('createModal');
    const body = doc.getElementsByTagName('body')[0];
    const closeModal = doc.querySelector('button.close');
    const btnDismiss = doc.querySelector('#btn-dismiss');
    const btnCreate = doc.querySelector('#btn-save-contact');

    updateContactsList();

    btnDeleteContact.addEventListener('click', () => {
        updateContacts(currentContact, 'delete');
    });

    contactList.addEventListener('click', (event) => {
        const expression = /list-group-item/;
        if (expression.test(event.target.className)) {
            const id = event.target.getAttribute('data-id');
            currentContact = allContacts.filter((item) => item.id == id)[0];
            if (currentContact.firstName
                && currentContact.lastName
                && currentContact.email
                && currentContact.phone) {
                hideEditContainer();
                setTimeout(() => {
                    firstNameField.value = currentContact.firstName;
                    lastNameField.value = currentContact.lastName;
                    emailField.value = currentContact.email;
                    phoneField.value = currentContact.phone;
                    showEditContainer();
                }, 500); // timeout delay should be same like in ".edit-container" selector

            }
        }
    });

    searchField.addEventListener('focus', () => {
        hideEditContainer();
    });

    searchField.addEventListener('keyup', (event) => {
        const searchInput = event.target.value;
        const items = contactList.getElementsByTagName('li');
        const itemsLength = items.length;
        let i;
        let item;
        for (i = 0; i < itemsLength; i++) {
            item = items[i];
            if (item.textContent.search(searchInput) >= 0) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        }
    });

    function showEditContainer() {
        editContainer.classList.add('edit-container--showed');
    }

    function hideEditContainer() {
        editContainer.classList.remove('edit-container--showed')
    }

    function createContactMockup(contact) {
        return `<li data-id="${contact.id}" class="list-group-item sidebar__contacts-item">${contact.firstName} ${contact.lastName}</li>`;
    }

    function updateContactsList() {
        let usersMockup = '';
        cleanupContactsContainer();
        if (allContacts && allContacts.length) {
            for (let i = 0; i < allContacts.length; i++) {
                usersMockup += createContactMockup(allContacts[i]);
            }
            contactList.insertAdjacentHTML('afterbegin', usersMockup);
        } else {
            contactList.insertAdjacentHTML('afterbegin', '<p class="empty-contacts-list">There are no contacts yet.</p>');
        }
    }

    function cleanupContactsContainer() {
        while (contactList.hasChildNodes()) {
            contactList.removeChild(contactList.firstChild);
        }
    }

    function getEdit() {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false;
        }
        btnSave.style.display = 'block';
        btnEdit.style.display = 'none';
    }

    btnEdit.addEventListener('click', getEdit);


    function saveValues() {
        let contact = {
            email: emailField.value,
            phone: phoneField.value,
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            id: currentContact.id
        };
        let contactInputs = {
            email: emailField,
            phone: phoneField,
            firstName: firstNameField,
            lastName: lastNameField
        };

        if (inputsValidation(contactInputs)) {
            updateContacts(contact, 'update');
            btnSave.style.display = 'none';
            btnEdit.style.display = 'block';
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }
        }
    }

    btnSave.addEventListener('click', saveValues);


    // MODAL START
    // ==============================

    btnCreateContact.addEventListener('click', () => {
        body.classList.add("modal-open");
        modal.classList.add("in");
    });

    function closeModalModel() {
        body.classList.remove("modal-open");
        modal.classList.remove("in");
    }

    closeModal.addEventListener('click', closeModalModel);
    btnDismiss.addEventListener('click', closeModalModel);

    btnCreate.addEventListener('click', () => {
        let inputs = {
            email: doc.getElementById('popup-email'),
            phone: doc.getElementById('popup-phone'),
            firstName: doc.getElementById('popup-firstName'),
            lastName: doc.getElementById('popup-lastName')
        };
        let contact = {
            email: inputs.email.value,
            phone: inputs.phone.value,
            firstName: inputs.firstName.value,
            lastName: inputs.lastName.value,
            id: new Date().getTime()
        };
        if (inputsValidation(inputs)) {
            closeModalModel();
            updateContacts(contact, 'add');
            cleanupInputs(inputs);
        }
    });

    function cleanupInputs(fields) {
        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                fields[key].value = '';
            }
        }
    }

    function inputsValidation(fields) {
        let errors = {};
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                if (key === 'firstName' && fields[key].value === ''
                    || key === 'lastName' && fields[key].value === '' ) {
                    errors[key] = 'Field can not be empty';
                } else if (key === 'email' && !emailReg.test(fields[key].value)) {
                    errors[key] = 'Invalid email';
                } else if (key === 'phone' && !phoneReg.test(fields[key].value)) {
                    errors[key] = 'You have to write 10 digits number';
                } else {
                    errors[key] = '';
                }
            }
        }

        for (let error in errors) {
            if (errors.hasOwnProperty(error)) {
                const parent = fields[error].parentNode;
                const errorField = parent.getElementsByClassName('alert')[0];
                if (errorField) {
                    (errors[error]) ? errorField.textContent = 'Error: ' + errors[error] : error.textContent = '';
                } else {
                    if (errors[error]) {
                        parent.insertAdjacentHTML('beforeend',
                            `<div class="alert alert-danger" role="alert">
                              Error: ${errors[error]}
                            </div>`);
                    }
                }
            }
        }
        let errorsArray = Object.keys(errors).map(key => errors[key]);
        return errorsArray.every((err) =>  err === '');
    }

    // ==============================
    // MODAL END

    function updateContacts(contact, action) {
        switch (action) {
            case 'add':
                allContacts.push(contact);
                localStorage.setItem('users', JSON.stringify(allContacts));
                break;
            case 'delete':
                allContacts = allContacts.filter((it) => it.id !== contact.id);
                localStorage.setItem('users', JSON.stringify(allContacts));
                hideEditContainer();
                break;
            case 'update':
                allContacts = allContacts.map((it) => {
                    if (it.id === contact.id) {
                        return contact;
                    }
                    return it;
                });
                localStorage.setItem('users', JSON.stringify(allContacts));
                break;
            default :
                break;
        }
        searchField.value = '';
        updateContactsList();
    }
})();