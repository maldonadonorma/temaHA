/*** ADIB ABUD JASO ***/
/*
Nota: para encontrar la ventana de este SCORM en Moodle 2.7 en una consola se puede utilizar:
var MiSCORM = document.getElementById('scorm_object').contentWindow; //donde MiSCORM será la 'window' de este iframe
*/
//Objeto con funciones de comunicación con el API de SCORM
var conectividadSCORM = function() {
    var API = null;
    var numObjetivos = 0;
    function findAPI(win) {
        while ((win.API == null) && (win.parent != null) && (win.parent != win)) {//Busca en la ventana parent el objeto API
            win = win.parent;
        }
        API = win.API;
        if (API == null) {
            API = parent.API;
            if (API == null) {
               API = top.API; 
               console.log("findAPI: Parent not found");
            }
			else {
                console.log("findAPI: None not found");
            }
            console.log("findAPI: Win not found");
        }  
        console.log("findAPI: Win ok");  
    }

    function initAPI() {
        var win = window;
        findAPI(win);//Función de arriba
        if ((API == null) && (win.opener != null) && (typeof(win.opener) != "undefined")) {//if we still have not found the API, look at the opener and it's frameset
            findAPI(win.opener);
        }
        else if ((API == null) && (win.opener == null) && (typeof(win.opener) == "undefined")) { //if we still have not found the API, look at the opener and it's frameset 
            findAPI(win.top);
        }else if ((API == null)) {
            console.log("initAPI: None win and top");  //
        }
        console.log("initAPI: Objeto = " + window, API);
    }
    return {
        API: API,
        initAPI: initAPI,
        iniciarScorm: function() {
            console.log("iniciarScorm *"); 
            var inicio = null;
            inicio = API.LMSInitialize("");
            if (inicio == 'false') {
                console.log("iniciarScorm: Error al iniciar" + API.LMSGetLastError() + " = " + API.LMSGetDiagnostic()); 
                return false;
            }
			else {
                console.log("iniciarScorm: LMSInitialize " + inicio);
                console.log("iniciarScorm: Usuario " + this.getUsuario()); 
            }
        },
        incompletar: function() {
            var estadoIncompleto = API.LMSSetValue("cmi.core.lesson_status", "incomplete");
            //API.LMSGetValue("cmi.core.lesson_mode");//Para obtener si está en “browse”, “normal”, “review”, RO
            console.log("incompletar: estadoIncompleto  " + estadoIncompleto);
        },
        completar: function() {
            var estadoCompleto = API.LMSSetValue("cmi.core.lesson_status", "completed");
            console.log("completar: estadoCompleto " + estadoCompleto);
        },
        calificar: function(aciertos, total) {
            var score = API.LMSSetValue("cmi.core.score.raw", aciertos);
            var maximo = API.LMSSetValue("cmi.core.score.max", total);
            console.log("calificar:" + aciertos + " de " + total + ". - " + score + " - " + maximo);
        },
        salvar: function() {
            var salvacion = API.LMSCommit("");
            console.log("salvar: " + salvacion);
        },
        terminar: function() {
            var terminacion = API.LMSFinish("");
            console.log("terminar: " + terminacion);
        },
        conectarYComenzar: function() {
            var mensaje = "conectarYcomenzar -sin cambios-";
            if (API == null) {
                try {
                    initAPI();
                    this.iniciarScorm();
                    mensaje = "conectó en modo: " + API.LMSGetValue("cmi.core.lesson_mode");
                }
				catch(e) {
                    mensaje = e.message;
                }
            }
			else {
                console.log("conectarYComenzar: API = ", API);
            }
            return mensaje;
        },
        desconectarConCalificacion: function(aciertos, total) {
            this.calificar(aciertos,total);
            this.completar();
            this.salvar();
            this.terminar();
            console.log("desconectarConCalificacion:       --desconectarConCalificacion " + aciertos + "  -  " + total);
        },
        crearObjetivos: function(numero) {
            numObjetivos = numero;
            if (API.LMSGetValue("cmi.objectives._count") < "" + numero) {
                for (var i = 0; i < numero; i++) {
                    if ((API.LMSGetValue("cmi.objectives." + i + ".status") == "incomplete") ||  
                            (API.LMSGetValue("cmi.objectives." + i + ".status") == "passed") ) {
                        console.log("crearObjetivos: status [] = " + API.LMSGetValue("cmi.objectives." + i + ".status"));
                    }
					else {
                        API.LMSSetValue("cmi.objectives." + i + ".id", "objetivo_" + i);
                        API.LMSSetValue("cmi.objectives." + i + ".status", "incomplete");
                        API.LMSSetValue("cmi.objectives." + i + ".score.raw", 0);
                        API.LMSSetValue("cmi.objectives." + i + ".score.max", 0);
                        API.LMSSetValue("cmi.objectives." + i + ".score.min", 0);
                    }
                }
                //API.LMSSetValue("cmi.objectives._count", numero);
                return true;
            }
			else {
                return false;
            }
        },
        iniciarObjetivo: function(numero) {
			console.log("iniciarObjetivo: " + (numero + 1));
            if (API.LMSGetValue("cmi.objectives." + numero + ".status") == "not attempted") {
				console.log("iniciarObjetivo: cmi.objectives." + numero + ".status");
                return API.LMSSetValue("cmi.objectives." + numero + "." + status, "incomplete");
            }
			else {
                return false;
            }
        },
        calificarObjetivo: function(numero, raw, maxima, minima) {
            var resultados = [];
            resultados.push(API.LMSSetValue("cmi.objectives." + numero + ".score.raw", raw));
            resultados.push(API.LMSSetValue("cmi.objectives." + numero + ".score.max", maxima));
            resultados.push(API.LMSSetValue("cmi.objectives." + numero + ".score.min", minima));
			console.log("calificarObjetivo: Objetivo " + (numero + 1) +", con " + raw + " aciertos de " + maxima + " posibles, con mínimo aprobatorio de " + minima);
            return resultados;
        },
        finalizarObjetivo: function(numero) {
            return API.LMSSetValue("cmi.objectives." + numero + ".status", "passed");            
            console.log("finalizarObjetivo: cmi.objectives." + numero + ".status, " + API.LMSGetValue("cmi.objectives." + numero + ".status"));
        },
        verificarEstado: function() {
            var totalObjetivos = API.LMSGetValue("cmi.objectives._count");
            console.log("verificarEstado: Actuales: " + totalObjetivos);
            //var incremento = 100/totalObjetivos;
            //var porcentaje = 0;
            var avance = 0;
            for (var i = 0; i < totalObjetivos; i++) {
                if (API.LMSGetValue("cmi.objectives." + i + ".status") == "passed") {
                    avance++;
                }//fin if
            }//fin for
            if ((avance == totalObjetivos) && (avance > 0)) {
                API.LMSSetValue("cmi.core.lesson_status", "completed"); // coloca el status en completed
                //this.terminar(); //cierra la comunicacion del SCO -- no aplica
            }
			else {//fin if
                API.LMSSetValue("cmi.core.lesson_status", "incomplete");
            }
        },
        numDefinidos: function() {
            var totalObjetivos = API.LMSGetValue("cmi.objectives._count");
            console.log("numDefinidos: Objetivos definidos: " + totalObjetivos);
            //var incremento = 100/totalObjetivos;
            //var porcentaje = 0;
            var avance = 0;
            for (var i = 0; i < totalObjetivos; i++) {
                if (API.LMSGetValue("cmi.objectives." + i + ".status") == "passed" || 
                    API.LMSGetValue("cmi.objectives." + i + ".status") == "incomplete") {
                    avance++;
                }//fin if
            }//fin for
            return avance;
        },
        obtenerDatosAvance: function() {
            var totalObjetivos = API.LMSGetValue("cmi.objectives._count");
            console.log("obtenerDatosAvance: Objetivos totales: " + totalObjetivos);
            var incremento = 100/totalObjetivos;
            var porcentaje = 0;
            var estados = [];
            for (var i = 0; i < totalObjetivos; i++) {
                estados[i] = API.LMSGetValue("cmi.objectives." + i + ".status");
                if (estados[i] == "passed") {
                    porcentaje += incremento;
                }
            }
            return {porcentaje:porcentaje, estados:estados};
        },getUsuario:function() {
            return API.LMSGetValue("cmi.core.student_id");
        },getLastError:function() {
            return API.LMSGetLastError();
        }
    }
}();
