// Máscara para campo de telefone
function mascaraTelefone(event) {
  let input = event.target;
  let valor = input.value;

  // Remove tudo que não é número
  valor = valor.replace(/\D/g, "");

  // Limita a 11 dígitos
  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  // Aplica a máscara
  if (valor.length <= 6) {
    valor = valor.replace(/(\d{2})(\d{0,4})/, "($1) $2");
  } else if (valor.length <= 10) {
    valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  input.value = valor;
}

// Validação do telefone antes de enviar
function validarCampoTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, "");

  if (numeros.length === 0) {
    return { valido: false, mensagem: "Telefone é obrigatório" };
  }

  if (numeros.length < 10) {
    return {
      valido: false,
      mensagem: "Telefone incompleto. Use o formato (XX) XXXXX-XXXX",
    };
  }

  if (numeros.length === 10) {
    return { valido: true, mensagem: "Telefone fixo válido" };
  }

  if (numeros.length === 11) {
    return { valido: true, mensagem: "Celular válido" };
  }

  return { valido: false, mensagem: "Telefone inválido" };
}

// Como usar no HTML

// Validação no envio do formulário
document.querySelector("form").addEventListener("submit", function (event) {
  const telefone = document.getElementById("ftel").value;
  const validacao = validarCampoTelefone(telefone);

  if (!validacao.valido) {
    event.preventDefault();
    alert(validacao.mensagem);
  }
});
