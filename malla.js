const ramos = [
  {
    semestre: "Año 1 - Semestre 1",
    cursos: [
      "Español I",
      "Gramática I",
      "Inglés Específico I",
      "Introducción Profesional",
      "Taller de Lengua Inglesa I",
      "Taller de Aprendizaje",
      "Taller de Habilidades Comunicacionales y Relacionales I"
    ]
  },
  {
    semestre: "Año 1 - Semestre 2",
    cursos: [
      { nombre: "Español II", prereqs: ["Español I"] },
      { nombre: "Gramática II", prereqs: ["Gramática I"] },
      { nombre: "Fonética I" },
      { nombre: "Inglés Específico II", prereqs: ["Inglés Específico I"] },
      { nombre: "Taller de Lectura y Escritura I" },
      { nombre: "Taller de Lengua Inglesa II", prereqs: ["Taller de Lengua Inglesa I"] },
      { nombre: "Taller de Vida Universitaria" }
    ]
  }
];

let completados = JSON.parse(localStorage.getItem("ramosCompletados") || "[]");

function renderMalla() {
  const container = document.getElementById("malla-container");
  container.innerHTML = "";

  ramos.forEach((sem) => {
    const divSem = document.createElement("div");
    divSem.className = "semestre";

    const h2 = document.createElement("h2");
    h2.textContent = sem.semestre;
    divSem.appendChild(h2);

    sem.cursos.forEach((curso) => {
      const nombre = typeof curso === "string" ? curso : curso.nombre;
      const prereqs = curso.prereqs || [];

      const divRamo = document.createElement("div");
      divRamo.className = "ramo";
      divRamo.textContent = nombre;
      if (prereqs.length > 0) {
        divRamo.setAttribute("data-prereqs", "Requiere: " + prereqs.join(", "));
      }

      const completado = completados.includes(nombre);
      const prereqsCumplidos = prereqs.every((p) => completados.includes(p));

      if (completado) {
        divRamo.classList.add("completed");
      } else if (!prereqsCumplidos && prereqs.length > 0) {
        divRamo.classList.add("disabled");
      }

      divRamo.addEventListener("click", () => {
        if (divRamo.classList.contains("disabled")) return;

        if (completado) {
          completados = completados.filter((c) => c !== nombre);
        } else {
          completados.push(nombre);
        }

        localStorage.setItem("ramosCompletados", JSON.stringify(completados));
        renderMalla(); // Recarga la vista
      });

      divSem.appendChild(divRamo);
    });

    container.appendChild(divSem);
  });
}

function resetearProgreso() {
  if (confirm("¿Estás seguro de que quieres borrar el progreso?")) {
    localStorage.removeItem("ramosCompletados");
    completados = [];
    renderMalla();
  }
}

renderMalla();