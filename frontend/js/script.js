const protocol = "http://";
const baseURL = "localhost:1111";

function loadLoginPage() {
    if (localStorage.getItem("token")) {
        loadInitPage();
        return;
    }

    clearPage(true);
    if (!document.querySelector(".container")) {
        const c = document.createElement("div");
        c.className = "container container-pages";
        document.body.appendChild(c);
    }

    document.querySelector(".container").innerHTML = `
        <div class="row w-100">
            <div class="col-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
                <div class="card p-4 shadow">
                    <h3 class="card-title text-center mb-4">Login</h3>
                    <form id="loginForm">
                        <div class="mb-3">
                            <label for="loginInput" class="form-label">Usuário</label>
                            <input type="text" class="form-control" id="loginInput" required>
                        </div>
                        <div class="mb-3">
                            <label for="passwordInput" class="form-label">Senha</label>
                            <input type="password" class="form-control" id="passwordInput" required>
                        </div>
                        <button type="button" class="btn btn-primary w-100" onclick="login()">Entrar</button>
                    </form>
                </div>
            </div>
        </div>`;
}

async function login() {
    const URLcompleta = `${protocol}${baseURL}/auth/login`;
    const login = document.querySelector("#loginInput").value.trim();
    const pass = document.querySelector("#passwordInput").value;

    if (!login || !pass) return;

    try {
        const { data } = await axios.post(URLcompleta, { login, pass });
        const token = data?.token || data; // Ajuste conforme resposta real
        if (token) {
            localStorage.setItem("token", token);
        }
        loadInitPage();
    } catch (error) {
        const serverMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Falha ao realizar login.";
        alert(`Erro (${error.response?.status || "?"}): ${serverMessage}`);
    }
}

function loadInitPage() {
    clearPage(); // NÃO usar clearPage(true)
    // Cria container se não existir (ex: após login)
    let container = document.querySelector(".container");
    if (!container) {
        container = document.createElement("div");
        container.className = "container container-pages";
        document.body.appendChild(container);
    }

    const page = `
        <h1 class="text-center py-4">Gerador de Senhas</h1>
        <form>
            <div class="row justify-content-center mb-2 gap-4">
                <div class="col-md-8">
                    <input class="form-control" type="text" id="fromPassword"
                        placeholder="Insira o app / website que sua senha estará associada" required>
                </div>
                <div class="col-md-8">
                    <input class="form-control" type="number" id="sizePassword" placeholder="Tamanho da senha"
                        min="4" max="64" required>
                </div>
                <div class="col-md-8">
                    <input type="checkbox" class="form-check-input" id="includesUppercase" checked>
                    <label for="includesUppercase" class="form-check-label">Incluir Letra Maiúscula</label>
                </div>
                <div class="col-md-8">
                    <input type="checkbox" class="form-check-input" id="includesNumbers">
                    <label for="includesNumbers" class="form-check-label">Incluir Números</label>
                </div>
                <div class="col-md-8">
                    <input type="checkbox" class="form-check-input" id="includesSpecial">
                    <label for="includesSpecial" class="form-check-label">Incluir Caracteres Especiais</label>
                </div>
                <div class="col-md-6 d-flex justify-content-center">
                    <button type="button" class="btn btn-primary w-50" onclick="createAndSavePassword()">Gerar Senha</button>
                </div>
            </div>
        </form>
        <div class="card d-none mt-2" id="card-passwordCreated">
            <div class="card-body text-center"></div>
        </div>`;
    container.innerHTML = page;
}

async function loadPasswords() {
    const loadPasswordsEndpoint =
        "/api/passwords/user/ebaf2813-66d9-43b5-909d-fdac134cc225";
    const URLcompleta = `${protocol}${baseURL}${loadPasswordsEndpoint}`;
    try {
        const response = await axios.get(URLcompleta);
        const passes = response.data.passwords;
        return Array.isArray(passes) ? passes : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function loadAllPasswordPage() {
    const passes = await loadPasswords();

    // Não apagar o body (mantém sidebar)
    clearPage(); // antes: clearPage(true)

    // Garante container
    let container = document.querySelector(".container");
    if (!container) {
        container = document.createElement("div");
        container.className = "container container-pages";
        document.body.appendChild(container);
    }

    // Se a sidebar não existir (caso tenha sido limpa em outra transição), recria
    if (!document.querySelector(".navbar-container")) {
        loadSideBar();
    }

    container.innerHTML = `
        <h1 class="text-center py-4">Minhas Senhas</h1>
        <div class="row justify-content-center gap-2" id="row-passes"></div>
        <div class="card d-none" id="card-showpasses">
            <div class="card-body"></div>
        </div>
    `;

    const rowpasses = document.querySelector("#row-passes");
    if (!rowpasses) return;

    if (passes.length === 0) {
        showCard(
            "#card-showpasses",
            `Nenhuma senha cadastrada para este usuário`,
            ["bg-danger-subtle"],
            ["d-none"],
            5000
        );
        return;
    }

    const cardsHTML = passes
        .map(
            (pass) => `
        <div class="col-md-8">
            <div class="card">
                <div class="card-body bg-light">
                    <div class="row">
                        <div class="col-6">
                            <span>Origem: ${pass.from}</span>
                        </div>
                        <div class="col-6">
                            <span>Senha: ${pass.pass}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
        )
        .join("");

    rowpasses.innerHTML = cardsHTML;
}

function clearPage(all = false) {
    const container = document.querySelector(".container");
    if (container) {
        container.innerHTML = "";
        container.classList.remove("container-pages");
        void container.offsetWidth;
        container.classList.add("container-pages");
    }
    if (all) {
        // Em vez de apagar tudo, garante estrutura mínima
        document.body.innerHTML = "";
        const c = document.createElement("div");
        c.className = "container container-pages";
        document.body.appendChild(c);
    }
}

async function createAndSavePassword() {
    const createAndSavePasswordEndpoint = "/api/password/generate";
    const URLcompleta = `${protocol}${baseURL}${createAndSavePasswordEndpoint}`;

    const fromPassword = document.querySelector("#fromPassword").value.trim();
    const sizePassword = Number(document.querySelector("#sizePassword").value);
    const includeUpperCase =
        document.querySelector("#includesUppercase").checked;
    const includeNumbers = document.querySelector("#includesNumbers").checked;
    const includeSpecial = document.querySelector("#includesSpecial").checked;

    if (!fromPassword || !sizePassword) {
        alert("Preencha app/website e tamanho.");
        return;
    }

    const dataToSend = {
        owner_name: "ADMIN",
        from: fromPassword,
        length: sizePassword,
        uppercase: includeUpperCase,
        numbers: includeNumbers,
        special: includeSpecial,
    };

    try {
        const { data } = await axios.post(URLcompleta, dataToSend);
        showCard(
            "#card-passwordCreated",
            `Senha para ${fromPassword} criada: ${data.password}`,
            ["bg-success-subtle"],
            ["d-none"],
            5000
        );
    } catch (error) {
        console.error(error);
        showCard(
            "#card-passwordCreated",
            `Erro: ${error.response?.data?.error || error.message}`,
            ["bg-danger-subtle"],
            ["d-none"],
            5000
        );
    }
}

function showCard(selector, text, classesToAdd, classesToRemove, timer) {
    const card = document.querySelector(selector);
    if (!card) return;
    const cardbody = card.querySelector(".card-body");
    if (!cardbody) return;
    cardbody.innerHTML = text;
    card.classList.add(...classesToAdd);
    card.classList.remove(...classesToRemove);
    setTimeout(() => {
        card.classList.remove(...classesToAdd);
        card.classList.add(...classesToRemove);
    }, timer);
}

function loadSideBar() {
    const sidebar = `<div class="position-absolute navbar-container">
        <button class="btn btn-primary m-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarNav"
            aria-controls="sidebarNav">
            <i class="bi bi-list"></i> Menu
        </button>

        <nav>
            <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarNav" data-bs-keyboard="false"
                data-bs-backdrop="false" aria-labelledby="sidebarTitle">
                <div class="offcanvas-header">
                    <h6 class="offcanvas-title" id="sidebarTitle">Gerador de Senhas</h6>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
                </div>
                <div class="offcanvas-body px-0">
                    <ul class="nav nav-pills flex-column mb-0 align-items-start" id="menu">
                        <li class="nav-item">
                            <a href="#" class="nav-link text-truncate" onclick="loadInitPage()">
                                <i class="fs-5 bi-house"></i><span class="ms-1 d-sm-inline">Inicio</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" data-bs-toggle="collapse" class="nav-link text-truncate"
                                onclick="loadAllPasswordPage()">
                                <i class="fs-5 bi-key"></i><span class="ms-1 d-sm-inline">Todas minhas
                                    senhas</span>
                            </a>
                        </li>
                        <li class="dropend">
                            <a href="#" class="nav-link dropdown-toggle text-truncate" id="dropdown"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fs-5 bi-person"></i><span class="ms-1 d-sm-inline">Minha conta</span>
                            </a>
                            <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdown">
                                <li>
                                    <a class="dropdown-item" href="#">Visualizar</a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#">Editar</a>
                                </li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#">Sair</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>`;
    document.body.innerHTML += sidebar;
}
