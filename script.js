// Array global para armazenar os objetos de usuário. Será populado com dados do localStorage ou por novas adições.
var evolvereUsers = [];

// Executa o código quando o DOM (Document Object Model) da página está completamente carregado.
document.addEventListener("DOMContentLoaded", function () {
  // Obtém referências para os elementos do DOM com os quais o script irá interagir.
  const userForm = document.getElementById("userForm");
  const userNameInput = document.getElementById("userName");
  const emailInput = document.getElementById("email");
  const deleteAllButton = document.getElementById("deleteAllBtn");
  const clearFormButton = document.getElementById("clearFormBtn");
  const searchInput = document.getElementById("searchInput");

  // Carrega e Renderiza usuários assim que a página abrir
  getUsers();
  renderUsers();

  // Adiciona um ouvinte de evento para o envio do formulário.
  userForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtém os valores dos campos de nome de usuário e email.
    const userName = userNameInput.value;
    const email = emailInput.value;

    // Chama a função para adicionar o novo usuário.
    addUser(userName, email);

    // Limpa os campos do formulário após o envio.
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
    renderUsers(filteredUsers);
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

  // Encontra o ID mais alto no array atual para gerar um ID sequencial
  const maxId = evolvereUsers.reduce(
    (max, user) => (user.id > max ? user.id : max),
    0
  );

  // Objeto do novo usuário
  var newUser = {
    id: maxId + 1,
    userName: userName,
    email: email,
    timestamp: new Date().toLocaleString("pt-BR"), // Data e hora formatada para o Brasil
  };

  // Adiciona o novo usuário ao array global `evolvereUsers`.
  evolvereUsers.push(newUser);
  localStorage.setItem("evolvereUsers", JSON.stringify(evolvereUsers));

  renderUsers();
}

// Função para deletar todos os usuários
function deleteAllUsers() {
  // Exibe uma caixa de diálogo de confirmação antes de apagar os dados.
  if (confirm("Tem certeza que deseja apagar todos os usuários?")) {
    localStorage.clear();
    evolvereUsers = [];
    renderUsers();
  }
}

// Função para deletar um único usuário
function deleteUser(userId) {
  // Cria um novo array contendo todos os usuários, exceto aquele com o ID a ser deletado.
  evolvereUsers = evolvereUsers.filter(function (user) {
    return user.id !== userId;
  });
  // Atualiza o localStorage com o novo array de usuários (sem o usuário deletado).
  localStorage.setItem("evolvereUsers", JSON.stringify(evolvereUsers));
  renderUsers();
}

// Função para pegar os usuários do localStorage
function getUsers() {
  // Obtém a lista de usuários do localStorage (que está em formato string) e a converte de volta para um objeto JavaScript.
  var storedList = JSON.parse(localStorage.getItem("evolvereUsers"));
  evolvereUsers = storedList || [];
}

// Função para renderizar/mostrar os usuários na tela
// O parâmetro `usersToRender` permite renderizar uma lista filtrada. Se nenhum parâmetro for passado, ele usa a lista completa `evolvereUsers` como padrão.
function renderUsers(usersToRender = evolvereUsers) {
  var userElement = document.getElementById("user-list");

  // Verifica se o elemento da lista de usuários realmente existe no HTML antes de tentar manipulá-lo.
  if (userElement) {
    // Limpa a lista de usuários existente na tela para evitar duplicações ao renderizar novamente.
    userElement.innerHTML = "";

    // Verifica se a lista de usuários a ser renderizada está vazia.
    if (usersToRender.length === 0) {
      userElement.innerHTML = "<li>Nenhum usuário cadastrado.</li>";
      return;
    }

    // Itera sobre cada usuário no array `usersToRender` para criar os elementos da lista.
    usersToRender.forEach(function (user) {
      // Cria um novo elemento de item de lista (`<li>`) para cada usuário.
      var userList = document.createElement("li");

      // Adicionado a exibição do ID do usuário. Define o conteúdo HTML do item da lista.
      userList.innerHTML = `<span><strong>#${user.id}</strong> - ${user.timestamp} - <strong>${user.userName}</strong>, ${user.email}</span>`;

      // Cria um elemento de botão para a exclusão.
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "Excluir";
      deleteButton.className = "btn-delete-item";
      // Define a função que será executada quando o botão de excluir for clicado.
      deleteButton.onclick = function () {
        deleteUser(user.id);
      };

      // Adiciona o botão de exclusão ao final do item da lista (`<li>`).
      userList.appendChild(deleteButton);

      // Adiciona o item da lista (`<li>`) completo à lista principal na página (`<ul>`).
      userElement.appendChild(userList);
    });
  }
}
