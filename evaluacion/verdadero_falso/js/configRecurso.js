var maxIntentos = 2;                 // número de intentos máximo para resolver el ejercicio
var maxIntentosReactivo = 2;
var calificacionGlobal = false;
var formatoColumnas = true;          // true: muestra preguntas y respuesta en columnas; false muestra preguntas y respuesta apiliados
var esTexto = true;                  // true: respuestas son TEXTO; false respuestas son IMAGENES
var invPregResp = false;             // true: invierte orden de preguntas y respuestas; false NO invierte orden de preguntas y respuestas

var reactivosMostrar = 5;            // número de reactivos a mostrar
if (reactivos.length < reactivosMostrar) {
	reactivosMostrar = reactivos.length;
}
var total = reactivosMostrar;

var intentos = 0;
var correctas = 0;
var contestadas = 0;
var totalPreguntas = 0;
var mezclarPreguntas = true;         // true: mezcla preguntas; false NO mezcla preguntas
var mezclarRespuestas = true;        // true: mezcla respuestas; false NO mezcla respuestas
var mostrarRetroIndividual = true;  // true: muestra retro por pregunta individual; false: NO muestra retro por pregunta individual
var mostrarRetroFinal = false;       // true: muestra retro por aciertos; false: NO muestra retro
var porEspacios = true;
var porEnunciados = true;

var retroCal = [
	{LimInf: 0, LimSup: 3, Mensaje: ["No fue suficiente", "Insufficient"]},
	{LimInf: 4, LimSup: 6, Mensaje: ["Esfuérzate más", "Work harder"]},
	{LimInf: 7, LimSup: 9, Mensaje: ["Suficiente", "Sufficient"]},
	{LimInf: 10, LimSup: 10, Mensaje: ["Excelente", "Excellent"]},
	];

var retroCal1 = [
	{LimInf: 0, LimSup: 3, Mensaje: "No fue suficiente"},	
	{LimInf: 4, LimSup: 6, Mensaje: "Esfuérzate más"},	
	{LimInf: 7, LimSup: 9, Mensaje: "Suficiente"},	
	{LimInf: 10, LimSup: 10, Mensaje: "Excelente"},	
	];

var ambSCORM = false;
var barraSCORM = false;

var idioma = "ESP";
var titTabla = [
	{m1: "True", m2: "False"},
	{m1: "Verdadero", m2: "Falso"}
];