// Credencial de demonstração
const DEMO_USER = {
  email: "torcedor@palmeiras.com",
  password: "teste",
};

const form       = document.getElementById("loginForm");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const btnToggle  = document.getElementById("toggleSenha");
const btnSubmit  = document.getElementById("btnLogin");
const alertBox   = document.getElementById("loginAlert");
const spinner    = document.getElementById("btnSpinner");
const btnText    = document.getElementById("btnText");


/**
 * Marca um campo como válido ou inválido.
 * @param {HTMLInputElement} input
 * @param {string|null} mensagem  – null = campo válido
 */
function setFieldState(input, mensagem) {
  const feedback = input.nextElementSibling?.classList.contains("invalid-feedback")
    ? input.nextElementSibling
    : input.parentElement.querySelector(".invalid-feedback");

  if (mensagem) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    if (feedback) feedback.textContent = mensagem;
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }
}

function clearFieldState(input) {
  input.classList.remove("is-invalid", "is-valid");
}


function validateEmail(value) {
  if (!value.trim()) return "O e-mail é obrigatório.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(value)) return "Informe um e-mail válido (ex: nome@dominio.com).";
  return null; // válido
}

function validateSenha(value) {
  if (!value) return "A senha é obrigatória.";
  if (value.length < 5) return "A senha deve ter pelo menos 5 caracteres.";
  return null;
}


inputEmail.addEventListener("blur", () => {
  setFieldState(inputEmail, validateEmail(inputEmail.value));
});

inputEmail.addEventListener("input", () => {
  // Remove feedback visual enquanto o usuário ainda digita
  if (inputEmail.classList.contains("is-invalid")) {
    clearFieldState(inputEmail);
  }
});

inputSenha.addEventListener("blur", () => {
  setFieldState(inputSenha, validateSenha(inputSenha.value));
});

inputSenha.addEventListener("input", () => {
  if (inputSenha.classList.contains("is-invalid")) {
    clearFieldState(inputSenha);
  }

});


//Mostrar / ocultar senha

btnToggle.addEventListener("click", () => {
  const show = inputSenha.type === "password";
  inputSenha.type = show ? "text" : "password";
  btnToggle.innerHTML = show
    ? '<i class="bi bi-eye-slash"></i>'
    : '<i class="bi bi-eye"></i>';
  btnToggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
});


//Alerta de erro / sucesso

function showAlert(mensagem, tipo = "danger") {
  alertBox.className  = `alert alert-${tipo} alert-dismissible fade show`;
  alertBox.innerHTML  = `${mensagem}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>`;
  alertBox.hidden     = false;
  alertBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideAlert() {
  alertBox.hidden = true;
}

//Estado de carregamento do botão

function setLoading(on) {
  btnSubmit.disabled     = on;
  spinner.hidden         = !on;
  btnText.textContent    = on ? "Entrando…" : "Entrar";
}


//Submit – validação completa + login

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert();

  const emailErr = validateEmail(inputEmail.value);
  const senhaErr = validateSenha(inputSenha.value);

  setFieldState(inputEmail, emailErr);
  setFieldState(inputSenha, senhaErr);

  if (emailErr || senhaErr) return; // aborta se houver erro

  setLoading(true);

  // Simula latência de rede (200–600 ms)
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));

  const lembrar = document.getElementById("lembrar").checked;

  if (
    inputEmail.value.trim().toLowerCase() === DEMO_USER.email &&
    inputSenha.value === DEMO_USER.password
  ) {
    if (lembrar) {
      localStorage.setItem("palmeiras_usuario", inputEmail.value.trim());
    }

    showAlert(
      '<i class="bi bi-check-circle-fill me-2"></i>' +
      '<strong>Login bem-sucedido!</strong> Redirecionando…',
      "success"
    );

    // Aguarda 1,5 s e vai para index
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } else {
    setLoading(false);
    showAlert(
      '<i class="bi bi-exclamation-triangle-fill me-2"></i>' +
      "E-mail ou senha incorretos. " +
      "<small class='d-block mt-1'>Dica: use <code>torcedor@palmeiras.com</code> / <code>teste</code></small>"
    );
    inputSenha.value = "";
    clearFieldState(inputSenha);
    inputEmail.focus();
  }
});

// Preenche e-mail salvo (lembrar-me)

window.addEventListener("DOMContentLoaded", () => {
  const salvo = localStorage.getItem("palmeiras_usuario");
  if (salvo) {
    inputEmail.value = salvo;
    document.getElementById("lembrar").checked = true;
  }
});
