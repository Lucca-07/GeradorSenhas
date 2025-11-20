const protocol = "http://";
const baseURL = "localhost:1111";

function loadInitPage() {
    clearPage();
    const container = document.querySelector(".container");
    const page = `
        <h1 class="text-center py-4">Gerador de Senhas</h1>
        <form>
            <div class="row justify-content-center mb-2 gap-4">
                <!-- SELECT DE APP / WEBSITE -->
                <div class="col-md-8">
                    <input class="form-control" type="text" id="fromPassword"
                        placeholder="Insira o app / website que sua senha estará associada" required>
                </div>
                <!-- QUANTIDADE DE CARACTERES -->
                <div class="col-md-8">
                    <input class="form-control" type="number" name="" id="sizePassword" placeholder="Tamanho da senha"
                        min="4" max="16" required>
                </div>
                <!-- LETRA MAIÚSCULA -->
                <div class="col-md-8">
                    <input type="checkbox" class="form-check-input" name="" id="includesUppercase" checked>
                    <label for="includesUppercase" class="form-check-label">Incluir Letra Maiúscula</label>
                </div>
                <!-- NÚMEROS -->
                <div class="col-md-8">
                    <input type="checkbox" class="form-check-input" name="" id="includesNumbers">
                    <label for="includesNumbers" class="form-check-label">Incluir Números</label>
                </div>
                <!-- CARACTERES ESPECIAS -->
                <div class="col-md-8">
                    <input type="checkbox" class="form-check-input" name="" id="includesSpecial">
                    <label for="includesSpecial" class="form-check-label">Incluir Caracteres Especiais</label>
                </div>
                <!-- BOTÃO PARA GERAR SENHA -->
                <div class="col-md-6 d-flex justify-content-center">
                    <button type="button" class="btn btn-primary w-50" onclick="createAndSavePassword()">Gerar
                        Senha</button>
                </div>
            </div>
        </form>
        <div class="card d-none mt-2" id="card-passwordCreated">
                <div class="card-body text-center">
                    
                </div>
            </div>`;
    if (container) {
        container.innerHTML += page;
    }
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
    clearPage();
    const container = document.querySelector(".container");
    if (!container) return;

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

function clearPage() {
    const container = document.querySelector(".container");
    if (container) {
        container.innerHTML = "";

        // Remove a classe que contém a animação
        container.classList.remove("container-pages");
        
        // Força um reflow/repaint lendo uma propriedade de layout (truque comum em CSS/JS)
        void container.offsetWidth; 
        
        // Adiciona a classe novamente para reiniciar a animação
        container.classList.add("container-pages");
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
