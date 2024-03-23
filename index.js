//////////////////Variaveis//////////////////

const inputs = document.querySelectorAll("[data-input]"); //Seleciona todos os inputs do formulario
const infos = document.querySelectorAll("[data-value]"); // Seleciona todos os Spans do HTML que irão receber os valores dos inputs
const wrapFicha = document.querySelector(".wrap-ficha");
const cover = document.querySelector(".cover")
const instituicao = document.querySelector("#instituicao");
const tipoTrabalho = document.querySelector("#tipoTrabalho");
let resultadoSelecao

instituicao.value = "Universidade Santa Cecília";

const erroText = document.querySelector(".erro");
let erro;

let valores = {}; // Objeto que sera usado para gravas os valores dos inputs

const btnEnviar = document.querySelector(".btn-gerar-ficha"); // Seleciona o botão Gerar Ficha
const btnGerarPDF = document.querySelector(".btn-gerar-pdf"); // Seleciona o botão Gerar PDF
const btnCancelar = document.querySelector(".btn-cancelar"); // Seleciona o botão Gerar PDF

//desabilita botoes para o usuario utilizar somente apos ter preenhido os campos
btnGerarPDF.disabled = true;
btnCancelar.disabled = true;

//////////////////Funções//////////////////

function gravarValores(e) {
  e.preventDefault(); // Previne padrão do botão do form

  //Realiza loop pelos inputs e registra valores no objeto valores
  inputs.forEach((input) => {
    if (input.required && input.value) {
      // verifica se os inputs obrigatorios estão preenchidos, caso não estejam a função não é executada

      //Lida com o erro do preenchimento
      erroText.classList.remove("ativo");
      input.style.borderColor = "black";
      input.style.boxShadow = "none";
      erro = false;

      //Resgitra os valores digitados no formulario no objeto valores
      const id = input.id;
      const value = input.value;
      valores[id] = value;
    } else if (!input.required && input.value) {
      const id = input.id;
      const value = input.value;
      valores[id] = value;
    } else {
      //Informa erro de preenchimento
      erroText.classList.add("ativo");
      erro = true;
      if (!input.value && input.required) {
        input.style.boxShadow = "0px 0px 0px 1px rgba(255,0,0,1)";
        input.style.borderColor = "rgba(255,0,0,1)";
        console.log("Deve preencher todos os campos obrigatorios");
      }
    }
  });

  valores.nomeInvertidoAluno = inverterNomes(
    valores.nomeAluno,
    valores.sobrenomeAluno,
  );
  valores.responsabilidadeInvertido = inverterNomes(
    valores.responsabilidadeNome,
    valores.responsabilidadeSobrenome,
  );

  if (!erro) {
    const estado = valores.estado.toLocaleUpperCase(); //corrige o campo estado caso o usuario digitar com letra minuscula
    valores.estado = estado;

    btnGerarPDF.disabled = false; //habilita botoes
    btnCancelar.disabled = false;

    cover.style.display = "none"
    registrarValores();
  }
}

//Registra os valores do objeto nos spans, verifica atraves do dataset do span se tem o mesmo nome da propriedade do objeto
function registrarValores() {
  infos.forEach((info) => {
    //seleciona todos os spans e passa o loop
    const dataValue = info.dataset.value;
    if (valores.hasOwnProperty(dataValue)) {
      //compara valores do objeto com os spans e se for um span assunto adiciona o ponto final
      if (info.id) {
        info.textContent = `${info.id} ${valores[dataValue]}.`; // grava valores
      } else if (info.dataset.value === "subtitulo") {
        info.textContent = ` / ${valores[dataValue]}.`;
      } else if (info.dataset.value === "curso") {
        if (resultadoSelecao === "TCC") {
          info.textContent = `Faculdade de ${valores[dataValue]},`;
        } else if (resultadoSelecao !== "TCC") {
          info.textContent = `Programa de pós-graduação em ${valores[dataValue]},`;
        }
      } else if (info.dataset.value === "nomeCoorientador") {
        info.textContent = `Coorientador: ${valores[dataValue]}`;
      } else if (info.dataset.value === "sobrenomeCoorientador") {
        info.textContent = ` ${valores[dataValue]}.`;
      } else if (!info.id) {
        info.textContent = valores[dataValue]; // grava valores
      }
    }
  });

  wrapFicha.style.visibility = "visible";
}

function gerarPDF() {
  if (!erro) {
    //seleciona o que vai virar pdf
    const conteudo = document.querySelector(".ficha");

    //configurações
    const options = {
      margin: [190, 10, 10, 10],
      filename: "ficha catalográfica.pdf",
      html2canvas: { scale: 3 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    //gera pdf e salva
    html2pdf().set(options).from(conteudo).save();
  }
}

function inverterNomes(nome, sobrenome) {
  if (nome && sobrenome) {
    const sobreNomeArray = sobrenome.split(" ");
    const ultimoNome = sobreNomeArray[sobreNomeArray.length - 1];
    const nomeDoMeio = sobreNomeArray.slice(0, -1).join(" ");
    const nomeInvertido = `${ultimoNome}, ${nome} ${nomeDoMeio}`;
    return nomeInvertido;
  }
}

function cancelar() {
  valores = {};
  infos.forEach((item) => (item.textContent = null));
  inputs.forEach((item) => (item.value = null));
  instituicao.value = "Universidade Santa Cecília";
  cover.style.display = "block"
  btnGerarPDF.disabled = true; //habilita botoes
  btnCancelar.disabled = true;
  
}

function handleInputCurso() {
  let tipoSelecionado = tipoTrabalho.selectedOptions[0].value;

  if (tipoSelecionado === "TCC") {
    resultadoSelecao = tipoSelecionado
  } else if (tipoSelecionado !== "TCC") {
    resultadoSelecao = tipoSelecionado
  }
}

//////////////////Event Listenres//////////////////

btnEnviar.addEventListener("click", gravarValores);
btnGerarPDF.addEventListener("click", gerarPDF);
btnCancelar.addEventListener("click", cancelar);
tipoTrabalho.addEventListener("change", handleInputCurso);
