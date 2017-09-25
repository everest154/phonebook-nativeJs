(function () {
    let allContacts = JSON.parse(localStorage.getItem('users')) || [];
    let currentContact = {};
    let popupErrors = {
        tel: true,
        emails: true,
        lastName: true,
        firstName: true
    };
    let viewErrors = {
        tel: false,
        emails: false,
        lastName: false,
        firstName: false
    };

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
    const additionalEmail = doc.getElementById('addEmail');
    const emailContainer = doc.getElementById('email-container');
    const additionalNumber = doc.getElementById('addNumber');
    const phoneContainer = doc.getElementById('phone-container');

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
                    if (currentContact.additionalEmails && currentContact.additionalEmails.length) {
                        cleanupContainer(emailContainer);
                        currentContact.additionalEmails.forEach((item) => {
                            emailContainer.insertAdjacentHTML('beforeend', `<div class="form-group">
                                                                            <label>Additional email address</label>
                                                                            <input disabled type="email" value="${item}" class="form-control view-emails-input form-control-values">
                                                                            <div class="alert alert-danger" role="alert"></div>
                                                                        </div>`)
                        });
                    } else {
                        cleanupContainer(emailContainer);
                    }
                    if (currentContact.additionalPhones && currentContact.additionalPhones.length) {
                        cleanupContainer(phoneContainer);
                        currentContact.additionalPhones.forEach((item) => {
                            phoneContainer.insertAdjacentHTML('beforeend', `<div class="form-group">
                                                                            <label >Additional phone number</label>
                                                                            <input disabled type="tel" value="${item}" class="form-control view-phones-input form-control-values">
                                                                            <div class="alert alert-danger" role="alert"></div>
                                                                        </div>`)
                        });
                    } else {
                        cleanupContainer(phoneContainer);
                    }
                    showEditContainer();
                }, 500); // timeout delay should be same like in ".edit-container" selector

            }
        }
    });

    let emailsCount = 1;

    additionalEmail.addEventListener('click', () => {
        const allEmail = doc.querySelectorAll('.popup-emails');
        const lastEmail = allEmail[allEmail.length - 1];
        const additionalEmailMockUp = `<div class="form-group popup-emails">
                                            <label for="popup-email">Additional Email</label>
                                            <input type="email" class="form-control popup-emails-input" id="popup-email${emailsCount++}">
                                            <button type="button" class="glyphicon glyphicon-remove-circle remove-additional-field"></button>
                                            <div class="alert alert-danger" role="alert"></div>
                                        </div>`;
        lastEmail.insertAdjacentHTML('afterend', additionalEmailMockUp);
        popupErrors.emails = true;
    });

    let phonesCount = 1;

    additionalNumber.addEventListener('click', () => {
        const allPhones = doc.querySelectorAll('.popup-phones');
        const lastPhone = allPhones[allPhones.length - 1];
        const additionalPhoneMockUp = `<div class="form-group popup-phones">
                                            <label for="popup-email">Additional Number</label>
                                            <input type="tel" class="form-control popup-phones-input" id="popup-email${phonesCount++}">
                                            <button type="button" class="glyphicon glyphicon-remove-circle remove-additional-field"></button>
                                            <div class="alert alert-danger" role="alert"></div>
                                        </div>`;
        lastPhone.insertAdjacentHTML('afterend', additionalPhoneMockUp);
        popupErrors.tel = true;
    });

    doc.addEventListener('click', (e) => {
        const target = e.target;
        if (hasClass(target, 'remove-additional-field')) {
            target.parentNode.remove();
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
        cleanupContainer(contactList);
        if (allContacts && allContacts.length) {
            for (let i = 0; i < allContacts.length; i++) {
                usersMockup += createContactMockup(allContacts[i]);
            }
            contactList.insertAdjacentHTML('afterbegin', usersMockup);
        } else {
            contactList.insertAdjacentHTML('afterbegin', '<p class="empty-contacts-list">There are no contacts yet.</p>');
        }
    }

    function cleanupContainer(elem) {
        while (elem.hasChildNodes()) {
            elem.removeChild(elem.firstChild);
        }
    }

    function getEdit() {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = false;
        }
        editContainer.classList.remove('edit-container--edit-mode');
        btnSave.style.display = 'block';
        btnEdit.style.display = 'none';
    }

    btnEdit.addEventListener('click', getEdit);


    function saveValues() {
        let contactInputs = {
            email: emailField,
            additionalEmails: doc.querySelectorAll('.view-emails-input'),
            additionalPhones: doc.querySelectorAll('.view-phones-input'),
            phone: phoneField,
            firstName: firstNameField,
            lastName: lastNameField
        };
        let contact = {
            email: emailField.value,
            additionalEmails: getElementsValues(contactInputs.additionalEmails),
            additionalPhones: getElementsValues(contactInputs.additionalPhones),
            phone: phoneField.value,
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            id: currentContact.id
        };

        if (inputsValidation(viewErrors)) {
            updateContacts(contact, 'update');
            btnSave.style.display = 'none';
            btnEdit.style.display = 'block';
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }
            editContainer.classList.add('edit-container--edit-mode');
        } else {
            showNotification('danger', `Please fill all fields.`);
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
        const additionalEmails = doc.querySelectorAll('.popup-emails-input');
        const length = additionalEmails.length;
        const additionalPhones = doc.querySelectorAll('.popup-phones-input');
        const phonesLength = additionalPhones.length;
        body.classList.remove("modal-open");
        modal.classList.remove("in");
        for (let i = 0; i < length; i++) {
            if (!additionalEmails[i].value) {
                additionalEmails[i].parentNode.remove();
            }
        }
        for (let i = 0; i < phonesLength; i++) {
            if (!additionalPhones[i].value) {
                additionalPhones[i].parentNode.remove();
            }
        }
    }

    closeModal.addEventListener('click', closeModalModel);
    btnDismiss.addEventListener('click', closeModalModel);

    btnCreate.addEventListener('click', () => {
        let inputs = {
            email: doc.getElementById('popup-email'),
            additionalEmails: doc.querySelectorAll('.popup-emails-input'),
            additionalPhones: doc.querySelectorAll('.popup-phones-input'),
            phone: doc.getElementById('popup-phone'),
            firstName: doc.getElementById('popup-firstName'),
            lastName: doc.getElementById('popup-lastName')
        };
        let contact = {
            email: inputs.email.value,
            additionalEmails: getElementsValues(inputs.additionalEmails),
            additionalPhones: getElementsValues(inputs.additionalPhones),
            phone: inputs.phone.value,
            firstName: inputs.firstName.value,
            lastName: inputs.lastName.value,
            id: new Date().getTime()
        };
        if (inputsValidation(popupErrors)) {
            closeModalModel();
            updateContacts(contact, 'add');
            cleanupInputs(inputs);
        } else {
            showNotification('danger', `Please fill all fields.`);
        }
    });

    function getElementsValues(elements) {
        let result = [];
        const length = elements.length;
        for (let i = 0; i < length; i++) {
            result.push(elements[i].value);
        }
        return result;
    }

    function cleanupInputs(fields) {
        const additionalEmails = doc.querySelectorAll('.popup-emails-input');
        const length = additionalEmails.length;
        for (let i = 0; i < length; i++) {
            additionalEmails[i].parentNode.remove();
        }
        const additionalPhones = doc.querySelectorAll('.popup-phones-input');
        const additionalPhonesLength = additionalPhones.length;
        for (let i = 0; i < additionalPhonesLength; i++) {
            additionalPhones[i].parentNode.remove();
        }
        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                fields[key].value = '';
            }
        }
        resetErrors(popupErrors);
    }

    modal.addEventListener('keyup', (e) => {
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (e.target.nodeName === 'INPUT') {
            let parent = e.target.parentNode;
            let errorField = parent.getElementsByClassName('alert')[0];
            if (e.target.type === 'email') {
                const allEmails = doc.querySelectorAll('.modal-body input[type="email"]');
                for (let i = 0; i < allEmails.length; i++) {
                    let parent = allEmails[i].parentNode;
                    let errorField = parent.getElementsByClassName('alert')[0];
                    if (emailReg.test(allEmails[i].value)) {
                        errorField.textContent = '';
                        popupErrors.emails = false
                    } else {
                        errorField.textContent = 'Error: invalid email';
                        popupErrors.emails = true
                    }
                }
            } else if(e.target.type === 'tel') {
                const allPhones = doc.querySelectorAll('.modal-body input[type="tel"]');
                for (let i = 0; i < allPhones.length; i++) {
                    let parent = allPhones[i].parentNode;
                    let errorField = parent.getElementsByClassName('alert')[0];
                    if (phoneReg.test(allPhones[i].value)) {
                        errorField.textContent = '';
                        popupErrors.tel = false;
                    } else {
                        errorField.textContent = 'Phone number should contains 10th digits';
                        popupErrors.tel = true;
                    }
                }
            } else if(e.target.id === 'popup-firstName') {
                if (e.target.value == '') {
                    errorField.textContent = 'Field can not be empty';
                    popupErrors.firstName = true;
                } else {
                    errorField.textContent = '';
                    popupErrors.firstName = false;
                }
            } else if(e.target.id === 'popup-lastName') {
                if (e.target.value == '') {
                    errorField.textContent = 'Field can not be empty';
                    popupErrors.lastName = true;
                } else {
                    errorField.textContent = '';
                    popupErrors.lastName = false;
                }
            }
        }
    });

    editContainer.addEventListener('keyup', (e) => {
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const phoneReg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (e.target.nodeName === 'INPUT') {
            const parent = e.target.parentNode;
            const errorField = parent.getElementsByClassName('alert')[0];
            if (e.target.type === 'email') {
                if (emailReg.test(e.target.value)) {
                    errorField.textContent = '';
                    viewErrors.emails = false
                } else {
                    errorField.textContent = 'Error: invalid email';
                    viewErrors.emails = true
                }
            } else if(e.target.type === 'tel') {
                if (phoneReg.test(e.target.value)) {
                    errorField.textContent = '';
                    viewErrors.tel = false;
                } else {
                    errorField.textContent = 'Phone number should contains 10th digits';
                    viewErrors.tel = true;
                }
            } else if(e.target.id === 'firstName') {
                if (e.target.value == '') {
                    errorField.textContent = 'Field can not be empty';
                    viewErrors.firstName = true;
                } else {
                    errorField.textContent = '';
                    viewErrors.firstName = false;
                }
            } else if(e.target.id === 'lastName') {
                if (e.target.value == '') {
                    errorField.textContent = 'Field can not be empty';
                    viewErrors.lastName = true;
                } else {
                    errorField.textContent = '';
                    viewErrors.lastName = false;
                }
            }
        }
    });

    function inputsValidation(errors) {
        const errorsArray = Object.keys(errors).map(key => errors[key]);
        return errorsArray.every((err) =>  err === false);
    }

    function resetErrors(errors) {
        for (let error in errors) {
            if (errors.hasOwnProperty(error)) {
                errors[error].value = true;
            }
        }
    }
    // ==============================
    // MODAL END

    function updateContacts(contact, action) {
        switch (action) {
            case 'add':
                allContacts.push(contact);
                localStorage.setItem('users', JSON.stringify(allContacts));
                showNotification('success', 'New contact has been added');
                break;
            case 'delete':
                allContacts = allContacts.filter((it) => it.id !== contact.id);
                localStorage.setItem('users', JSON.stringify(allContacts));
                hideEditContainer();
                showNotification('success', `Contact  <b>${contact.firstName} ${contact.lastName}</b> has been removed`);
                break;
            case 'update':
                allContacts = allContacts.map((it) => {
                    if (it.id === contact.id) {
                        return contact;
                    }
                    return it;
                });
                localStorage.setItem('users', JSON.stringify(allContacts));
                showNotification('success', `Contact  <b>${contact.firstName} ${contact.lastName}</b> has been updated`);
                break;
            default :
                break;
        }
        searchField.value = '';
        updateContactsList();
    }

    function hasClass(elem, className) {
        return elem.className.split(' ').indexOf(className) > -1;
    }

    let notifyId = 0;
    function notificationTemplate(action, message) {
        return `<div id="notify-${notifyId++}" class="notification ${action}">${message}</div>`;
    }

    function showNotification(action, message) {
        let element;
        doc.body.insertAdjacentHTML('beforeend', notificationTemplate(action, message));
        element = doc.getElementById(`notify-${notifyId - 1}`);
        setTimeout(() => {
            element.remove();
        }, 3000);
    }
})();