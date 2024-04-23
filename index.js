//////////////////Variaveis//////////////////

let inputs = document.querySelectorAll("[data-input]"); //Seleciona todos os inputs do formulario
const infos = document.querySelectorAll("[data-value]"); // Seleciona todos os Spans do HTML que irão receber os valores dos inputs
const cover = document.querySelector(".cover"); //elemento html que faz o quadrado da ficha ficar branco
const instituicao = document.querySelector("#instituicao"); //seleciona o campo instituição para poder preencher automaticamente na linha abaixo
instituicao.value = "Universidade Santa Cecília";

const tipoTrabalho = document.querySelector("#tipoTrabalho"); //seleciona o as opções de tipo de trabalho (TCC, dissertação,etc)
let resultadoSelecao; //variavel que vai ser usada para saber qual tipo de trabalho foi selecionado

const erroText = document.querySelector(".erro"); //seleciona o elemento html erro
let erro; //cria variavel erro para podermos trabalhar com ele

let valores = {}; // Objeto que sera usado para gravas os valores dos inputs

const btnEnviar = document.querySelector(".btn-gerar-ficha"); // Seleciona o botão Gerar Ficha
const btnGerarPDF = document.querySelector(".btn-gerar-pdf"); // Seleciona o botão Gerar PDF
const btnCancelar = document.querySelector(".btn-cancelar"); // Seleciona o botão Gerar PDF
let btnRemoverInput;

let viewportWidth = window.innerWidth;

const btnAdicionarAutor = document.querySelector(".btn-adicionar-autor");
const form = document.querySelector("form");
const listaRomana = document.querySelectorAll(".listaRomana span");
const numeroRomanos = ["I", "II", "III", "IV", "V", "VI"];

//desabilita botoes para o usuario utilizar somente apos ter preenhido os campos do formulario
btnGerarPDF.disabled = true;
btnCancelar.disabled = true;

//////////////////Funções//////////////////

function gravarValores(e) {
  e.preventDefault(); // Previne padrão do botão do form

  //Realiza loop pelos inputs e registra valores no objeto valores
  inputs.forEach((input) => {
    // verifica se os inputs obrigatorios estão preenchidos, caso não estejam a função não é executada
    if (input.required && input.value) {
      //Lida com o erro do preenchimento
      erroText.classList.remove("ativo");
      input.style.borderColor = "black";
      input.style.boxShadow = "none";
      erro = false;

      //Resgitra os valores digitados no formulario no objeto valores
      const id = input.id;
      const value = input.value;
      valores[id] = value;

      //verifica se tem campos que não sãp obrigatorios e registra os valores no objeto
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
      }
    }
  });

  //usa a função inverter nomes para alterar os nomes
  valores.nomeInvertidoAluno = inverterNomes(
    valores.nomeAluno,
    valores.sobrenomeAluno,
  );
  valores.nomeOrientadorInverido = inverterNomes(
    valores.nomeOrientador,
    valores.sobrenomeOrientador,
  );
  valores.nomeInvertidoAluno2 = inverterNomes(
    valores.nomeAluno2,
    valores.sobrenomeAluno2,
  );
  valores.nomeInvertidoAluno3 = inverterNomes(
    valores.nomeAluno3,
    valores.sobrenomeAluno3,
  );
  valores.nomeInvertidoAluno4 = inverterNomes(
    valores.nomeAluno4,
    valores.sobrenomeAluno4,
  );
  valores.nomeInvertidoAluno5 = inverterNomes(
    valores.nomeAluno5,
    valores.sobrenomeAluno5,
  );

  //verifica se o erro esta ativo, não deixa executar a funçaõ de gravar os valores no html
  if (!erro) {
    const estado = valores.estado.toLocaleUpperCase(); //corrige o campo estado caso o usuario digitar com letra minuscula
    valores.estado = estado;

    btnGerarPDF.disabled = false; //habilita botoes
    btnCancelar.disabled = false;

    cover.style.display = "none";

    if (viewportWidth <= 1160) {
      window.scrollTo(0, 0);
      registrarValoresHTML();
    } else {
      registrarValoresHTML();
    }
  }
}

//Registra os valores do objeto nos spans no html, verifica atraves do dataset do span se tem o mesmo nome da propriedade do objeto
function registrarValoresHTML() {
  infos.forEach((info) => {
    //seleciona todos os spans e passa o loop
    const dataValue = info.dataset.value;
    if (valores.hasOwnProperty(dataValue)) {
      //compara valores do objeto com os spans e realiza os ajustes necessarios dependendo do assunto do span
      if (info.id) {
        info.textContent = `${info.id} ${valores[dataValue]}.`; //Esse daqui corrige os campos assuntos, permitindo atraves do ID do html adiconar o numero do assunto e colocando um ponto no final da string
      } else if (dataValue === "subtitulo") {
        //corrige o campo subtitulo adicionando a / e o ponto final
        info.textContent = ` : ${valores[dataValue]}`;
      } else if (dataValue === "curso") {
        //verificar qual tipo de curso foi selecionado (tcc, dissertação,etc), para depois escrever a frase correta
        if (resultadoSelecao === "TCC") {
          info.textContent = `Faculdade de ${valores[dataValue]},`;
        } else if (resultadoSelecao !== "TCC") {
          info.textContent = `Programa de pós-graduação em ${valores[dataValue]},`;
        }
      } else if (dataValue === "nomeCoorientador") {
        info.textContent = `Coorientador: ${valores[dataValue]}`;
      } else if (dataValue === "sobrenomeCoorientador") {
        info.textContent = ` ${valores[dataValue]}.`;
      } else if (dataValue === "sobrenomeAluno2") {
        info.textContent = ` ${valores[dataValue]}; `;
      } else if (dataValue === "sobrenomeAluno3") {
        info.textContent = ` ${valores[dataValue]}; `;
      } else if (dataValue === "sobrenomeAluno4") {
        info.textContent = ` ${valores[dataValue]}; `;
      } else if (dataValue === "sobrenomeAluno5") {
        info.textContent = ` ${valores[dataValue]};`;
      } else if (!info.id) {
        info.textContent = valores[dataValue]; // grava valores dos spans que nao tem ID
      }
    }
  });

  const novaLista = [];

  listaRomana.forEach((item) => {
    if (item.textContent !== "") novaLista.push(item);
  });

  novaLista.forEach((item, index) => {
    item.textContent = `${numeroRomanos[index]}. ${item.innerText}. `;
  });

  if (novaLista.length > 2) {
    infos[6].innerText = `${infos[6].innerText}; `;
    infos[2].innerText = `${infos[2].innerText}; et al.`;
  } else {
    infos[6].innerText = `${infos[6].innerText}.`;
    infos[2].innerText = `${infos[2].innerText}.`;
  }

  const listaNomes = Array.from(document.querySelector(".listaNomes").children);
  console.log(listaNomes.map((item) => item.textContent));
}

function gerarPDF() {
  //executa função se o erro nao existir
  if (!erro) {
    //seleciona o que vai virar pdf
    const conteudo = document.querySelector(".ficha");

    //configurações
    const options = {
      margin: [180, 10, 10, 10], // faz a informação ir para o final da pagina a4 do PDF, caso queira deixar no topo, alterar para: 10, 10, 10 ,10
      filename: "ficha catalográfica.pdf",
      html2canvas: { scale: 3 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    //gera pdf e salva
    html2pdf().set(options).from(conteudo).save();
  }
}

//funçaõ que inverte o nome, ela é usda para inverter o nome do aluno e do campo responsabilidade
function inverterNomes(nome, sobrenome) {
  if (nome && sobrenome) {
    const sobreNomeArray = sobrenome.split(" "); // pega a string digitada no sobrenome e divide em varias strings dentro de uma array
    const ultimoNome = sobreNomeArray[sobreNomeArray.length - 1]; //seleciona a ultima string da array criada acima

    if (
      //verifica se a ultima string contem alguma das regras abaixo, e caso possitivo o nome invertido vai ter 2 nomes antes da "," ao inves de 1 nome apenas
      ultimoNome === "Filho" ||
      ultimoNome === "Neto" ||
      ultimoNome === "Junior" ||
      ultimoNome === "Sobrinho" ||
      ultimoNome === "Júnior" ||
      ultimoNome.includes("-")
    ) {
      const nomeDoMeio = sobreNomeArray.slice(0, -2).join(" ");
      const nomePenultimo = sobreNomeArray[sobreNomeArray.length - 2];
      const nomeInvertido = `${nomePenultimo} ${ultimoNome}, ${nome} ${nomeDoMeio}`;

      return nomeInvertido;
    } else {
      //caso seja nome normal inverte o nome com apenas o ultimo antes da ","
      const nomeDoMeio = sobreNomeArray.slice(0, -1).join(" ");
      const nomeInvertido = `${ultimoNome}, ${nome} ${nomeDoMeio}`;
      return nomeInvertido;
    }
  }
}

function cancelar() {
  //zera os valores para o inicial da aplicação
  valores = {};
  infos.forEach((item) => (item.textContent = null));
  inputs.forEach((item) => (item.value = null));
  instituicao.value = "Universidade Santa Cecília";
  cover.style.display = "block";
  btnGerarPDF.disabled = true; //desabilita botoes
  btnCancelar.disabled = true;
  const divsCriadas = document.querySelectorAll(".criado");
  divsCriadas.forEach((div) => div.remove());
}

//função para lidar com a seleçãpo do tipo de curso (tcc,dissertação, etc)
function handleInputCurso() {
  let tipoSelecionado = tipoTrabalho.selectedOptions[0].value;

  if (tipoSelecionado === "TCC") {
    resultadoSelecao = tipoSelecionado;
  } else if (tipoSelecionado !== "TCC") {
    resultadoSelecao = tipoSelecionado;
  }
}

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
function saveInput() {
  viewportWidth = window.innerWidth;
}
const handleResize = debounce(() => saveInput());

let i = 2;
function criarInput() {
  if (i <= 5) {
    const elementoReferencia = document.querySelector(".elementoReferencia");

    const wrapInputNome = document.createElement("div");
    wrapInputNome.classList.add("wrap-input", "coluna1-2", "criado");

    const newInputNome = document.createElement("input");
    newInputNome.required = true;
    newInputNome.id = `nomeAluno${i}`;
    newInputNome.type = "text";
    newInputNome.dataset.input = `nomeAluno${i}`;

    const labelNome = document.createElement("label");
    labelNome.innerHTML = `<label for="nomeAluno${i}">Nome do autor ${i}</label>`;

    const wrapInputSobrenome = document.createElement("div");
    wrapInputSobrenome.classList.add("wrap-input", "coluna2-5", "criado");

    const newInputSobrenome = document.createElement("input");
    newInputSobrenome.required = true;
    newInputSobrenome.id = `sobrenomeAluno${i}`;
    newInputSobrenome.type = "text";
    newInputSobrenome.dataset.input = `sobrenomeAluno${i}`;

    const labelSobrenome = document.createElement("label");
    labelSobrenome.innerHTML = `<label for="sobrenomeAluno${i}">Sobrenome do autor ${i}</label>`;

    wrapInputNome.appendChild(labelNome);
    wrapInputNome.appendChild(newInputNome);
    wrapInputSobrenome.appendChild(labelSobrenome);
    wrapInputSobrenome.appendChild(newInputSobrenome);

    form.insertBefore(wrapInputNome, elementoReferencia);
    form.insertBefore(wrapInputSobrenome, elementoReferencia);

    i++;
    inputs = document.querySelectorAll("[data-input]");
  }
}

function eliminarInput() {}

//////////////////Event Listenres//////////////////

btnEnviar.addEventListener("click", gravarValores);
btnGerarPDF.addEventListener("click", gerarPDF);
btnCancelar.addEventListener("click", cancelar);
tipoTrabalho.addEventListener("change", handleInputCurso);
btnAdicionarAutor.addEventListener("click", criarInput);
window.addEventListener("resize", handleResize);
