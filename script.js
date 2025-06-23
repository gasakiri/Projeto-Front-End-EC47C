var evolvereUsers = [];

getUsers();

function addUser(userName = '', email = '', pw = '') {
    if (userName === '') {
        alert('Nome de usuário não deve estar vazio');
        return;
    }
    if (email === '') {
        alert('Email não deve estar vazio');
        return;
    }
    if (pw === '') {
        alert('Senha não deve estar vazia');
        return;
    }

    var count = evolvereUsers.length;
    var newUser = { id: count + 1, userName: userName, email: email, pw: pw };
    evolvereUsers.push(newUser);
    localStorage.setItem('evolvereUsers', JSON.stringify(evolvereUsers));
}

function getUsers() {
    var storedList = JSON.parse(localStorage.getItem('evolvereUsers'));
    evolvereUsers = storedList || [];
}

function renderUsers() {
    var userElement = document.getElementById('user-list');
    if (userElement) {
        userElement.innerHTML = '';
        evolvereUsers.forEach((user) => {
            var userList = document.createElement('li');
            userList.textContent = user.id + ': ' + user.userName + ', ' + user.email;
            userElement.appendChild(userList);
        });
    }
}

addUser('primeiro', 'primeiro@primeiro.com', 'password123');
addUser('segundo', 'segundo@segundo.com', 'password123');
renderUsers();
