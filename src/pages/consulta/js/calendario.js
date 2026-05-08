// Dados dos agendamentos (simulando banco de dados)
const agendamentos = {
  "2026-02-18": [
    { hora: "10:10", cliente: "Beatriz", servico: "Manicure" },
    { hora: "11:40", cliente: "Liz", servico: "Pedicure" },
  ],
  "2026-02-19": [
    { hora: "09:00", cliente: "Ana Silva", servico: "Cabelereira" },
    { hora: "14:30", cliente: "Mariana Costa", servico: "Maquiagem" },
  ],
  "2026-02-20": [
    {
      hora: "15:00",
      cliente: "Fernanda Lima",
      servico: "Design de Sobrancelhas",
    },
  ],
};

// Horários disponíveis padrão
const horariosDisponiveis = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

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
  const dataStr = formatarDataParaString(dataSelecionada);
  const agendamentosDoDia = agendamentos[dataStr] || [];
  const horasAgendadas = agendamentosDoDia.map((a) => a.hora);

  const listaHtml = horariosDisponiveis
    .map((hora) => {
      const agendamento = agendamentosDoDia.find((a) => a.hora === hora);
      const isAgendado = !!agendamento;

      if (isAgendado) {
        return `
            <div class="horario-item horario-item-agendado">
              <div>
                <div class="horario-hora">${hora}</div>
                <div class="horario-cliente">${agendamento.cliente} - ${agendamento.servico}</div>
              </div>
              <span class="badge-status badge-agendado">Agendado</span>
            </div>
          `;
      } else {
        return `
            <div class="horario-item horario-item-disponivel">
              <div class="horario-hora">${hora}</div>
              <span class="badge-status badge-disponivel">Disponível</span>
            </div>
          `;
      }
    })
    .join("");

  document.getElementById("listaHorarios").innerHTML =
    listaHtml || "<p>Nenhum horário disponível</p>";
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

function init() {
  atualizarDiaSelecionado();
  gerarCalendario();
  gerarListaHorarios();
}

init();
