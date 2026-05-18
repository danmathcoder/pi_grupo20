// mock só trocar o nome  de onde ta 'agendamentos' pra esse que o mock aparece
const agendamentos_mock = {
  "2026-05-14": [
    { hora: "10:10", cliente: "Beatriz", servico: "Manicure" },

    { hora: "11:40", cliente: "Liz", servico: "Pedicure" },

    { hora: "14:30", cliente: "Mariana Costa", servico: "Maquiagem" },
  ],

  "2026-05-15": [
    {
      hora: "15:00",
      cliente: "Fernanda Lima",
      servico: "Design de Sobrancelhas",
    },
  ],
  "2026-05-16": [
    { hora: "12:10", cliente: "Beatriz", servico: "Manicure" },

    { hora: "18:00", cliente: "Liz", servico: "Pedicure" },

    { hora: "14:30", cliente: "Giovanna", servico: "Maquiagem" },
  ],
};

let agendamentos = {};

async function carregarAgendamentos() {
  const resposta = await fetch("/consulta-agendamentos");
  const dados = await resposta.json();

  agendamentos = {};

  dados.forEach((item) => {
    const data = new Date(item.data_atendimento).toISOString().split("T")[0];

    const horario = item.horario.slice(0, 5);

    if (!agendamentos[data]) {
      agendamentos[data] = [];
    }

    agendamentos[data].push({
      hora: horario,
      cliente: `${item.nome} ${item.sobrenome}`,
      servico: item.servico,
    });
  });

  gerarListaHorarios();
}

const horariosDisponiveis = [];

for (let hora = 10; hora <= 18; hora++) {
  horariosDisponiveis.push(`${String(hora).padStart(2, "0")}:00`);
}

let dataAtual = new Date();
let dataSelecionada = new Date();

function formatarData(data) {
  const dias = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado",
  ];
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  return {
    dataCompleta: `${dia}/${mes}/${ano}`,
    semana: dias[data.getDay()],
  };
}

function atualizarDiaSelecionado() {
  const formato = formatarData(dataSelecionada);
  document.getElementById("diaNumero").textContent = formato.dataCompleta;
  document.getElementById("diaSemana").textContent = formato.semana;
}

function gerarListaHorarios() {
  const agenda = document.getElementById("agenda");

  const dataStr = formatarDataParaString(dataSelecionada);

  const agendamentosDoDia = agendamentos[dataStr] || [];

  let html = "";

  for (let hora = 10; hora <= 18; hora++) {
    const horaFormatada = `${String(hora).padStart(2, "0")}:00`;

    const agendamentosDaHora = agendamentosDoDia.filter((item) =>
      item.hora.startsWith(String(hora).padStart(2, "0")),
    );

    let cardsHtml = "";

    agendamentosDaHora.forEach((agendamento) => {
      const minutos = Number(agendamento.hora.split(":")[1]);

      const top = 70 + minutos * 8;
      console.log(agendamento);
      cardsHtml += `
        <div 
          class="card-agendamento"
          style="top: ${top}px"
        >
          <div class="card-hora">${agendamento.hora}</div>
          <div class="card-cliente">${agendamento.cliente}</div>
          <div class="card-servico">${agendamento.servico}</div>
        </div>
      `;
    });

    html += `
      <div class="coluna-horario">
        <div class="titulo-hora">${horaFormatada}</div>
        ${cardsHtml}
      </div>
    `;
  }

  agenda.innerHTML = html;
}
function formatarDataParaString(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function gerarCalendario() {
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);

  const primeiroDiaSemana = primeiroDia.getDay();
  const diasNoMes = ultimoDia.getDate();

  const diasDoMesAnterior = new Date(ano, mes, 0).getDate();

  let calendarioHtml = "";

  for (let i = 0; i < primeiroDiaSemana; i++) {
    calendarioHtml += `<div class="calendar__day calendar__day--empty"></div>`;
  }

  const hoje = new Date();
  const dataSelecionadaStr = formatarDataParaString(dataSelecionada);

  for (let dia = 1; dia <= diasNoMes; dia++) {
    const dataAtualComparar = new Date(ano, mes, dia);
    const dataStr = formatarDataParaString(dataAtualComparar);
    const isSelecionado = dataStr === dataSelecionadaStr;
    const isHoje = dataAtualComparar.toDateString() === hoje.toDateString();

    let classes = "calendar__day";
    if (isSelecionado) classes += " calendar__day--selected";
    if (isHoje) classes += " calendar__day--today";

    calendarioHtml += `<div class="${classes}" onclick="selecionarDia(${ano}, ${mes}, ${dia})">${dia}</div>`;
  }

  const totalDias = primeiroDiaSemana + diasNoMes;
  const diasRestantes = totalDias % 7 === 0 ? 0 : 7 - (totalDias % 7);

  for (let i = 0; i < diasRestantes; i++) {
    calendarioHtml += `<div class="calendar__day calendar__day--empty"></div>`;
  }

  document.getElementById("diasMes").innerHTML = calendarioHtml;
  document.getElementById("mesAnoAtual").textContent =
    `${getNomeMes(mes)} ${ano}`;
}

function getNomeMes(mes) {
  const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return meses[mes];
}

function selecionarDia(ano, mes, dia) {
  dataSelecionada = new Date(ano, mes, dia);
  atualizarDiaSelecionado();
  gerarCalendario();
  gerarListaHorarios();
}

function mesAnterior() {
  dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1);
  gerarCalendario();
}

function proximoMes() {
  dataAtual = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1);
  gerarCalendario();
}

async function init() {
  atualizarDiaSelecionado();
  gerarCalendario();

  await carregarAgendamentos();
}

init();
