const form = document.getElementById("formulario");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const fullname = document.getElementById("fullname").value;
  const serviceType = document.getElementById("serviceType").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  try {
    const resposta = await fetch("/salvar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: name,
        sobrenome: fullname,
        servico: serviceType,
        data_atendimento: date,
        horario: time,
      }),
    });

    const texto = await resposta.text();

    if (resposta.ok) {
      form.reset();
    }
  } catch (erro) {
    console.log(erro);
  }
});
