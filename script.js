var evolvereUsers = [];

document.addEventListener("DOMContentLoaded", function () {
  const userForm = document.getElementById("userForm");
  const userNameInput = document.getElementById("userName");
  const emailInput = document.getElementById("email");
  const deleteAllButton = document.getElementById("deleteAllBtn");
  const clearFormButton = document.getElementById("clearFormBtn");
  const searchInput = document.getElementById("searchInput");

  // Carregar usuários do localStorage assim que a página abrir
  getUsers();
  renderUsers();

  userForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userName = userNameInput.value;
    const email = emailInput.value;

    addUser(userName, email);

    userForm.reset();
  });

  // Funcionalidade ao botão de deletar todos
  deleteAllButton.addEventListener("click", deleteAllUsers);

  // Funcionalidade ao botão de limpar formulário
  clearFormButton.addEventListener("click", function () {
    userForm.reset();
  });

  // Funcionalidade de busca em tempo real
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = evolvereUsers.filter(function (user) {
      return (
        user.userName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    });
    renderUsers(filteredUsers); // Renderizar apenas os usuários filtrados
  });
});

// Função para adicionar usuário
function addUser(userName, email) {
  if (userName === "") {
    alert("Nome de usuário não deve estar vazio");
    return;
  }
  if (email === "") {
    alert("Email não deve estar vazio");
    return;
  }

  // Objeto do novo usuário
  var newUser = {
    id: Date.now(), // ID único usando a data/hora atual
    userName: userName,
    email: email,
    timestamp: new Date().toLocaleString("pt-BR"),
  };

  evolvereUsers.push(newUser);
  localStorage.setItem("evolvereUsers", JSON.stringify(evolvereUsers));

  // Renderizar a lista para mostrar o novo usuário imediatamente
  renderUsers();
}

// Função para deletar todos os usuários
function deleteAllUsers() {
  if (confirm("Tem certeza que deseja apagar todos os usuários?")) {
    localStorage.clear();
    evolvereUsers = [];
    renderUsers();
  }
}

// Função para deletar um único usuário
function deleteUser(userId) {
  evolvereUsers = evolvereUsers.filter(function (user) {
    return user.id !== userId;
  });
  localStorage.setItem("evolvereUsers", JSON.stringify(evolvereUsers));
  renderUsers();
}

// Função para pegar os usuários do localStorage
function getUsers() {
  var storedList = JSON.parse(localStorage.getItem("evolvereUsers"));
  evolvereUsers = storedList || [];
}

// Função para renderizar/mostrar os usuários na tela
function renderUsers(usersToRender = evolvereUsers) {
  var userElement = document.getElementById("user-list");

  if (userElement) {
    userElement.innerHTML = "";

    if (usersToRender.length === 0) {
      userElement.innerHTML = "<li>Nenhum usuário cadastrado.</li>";
      return;
    }

    usersToRender.forEach(function (user) {
      var userList = document.createElement("li");

      userList.innerHTML = `<span>${user.timestamp} - <strong>${user.userName}</strong>, ${user.email}</span>`;

      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Excluir";
      deleteButton.className = "btn-delete-item"; // Para o estilo CSS
      deleteButton.onclick = function () {
        deleteUser(user.id);
      };

      userList.appendChild(deleteButton);

      userElement.appendChild(userList);
    });
  }
}
