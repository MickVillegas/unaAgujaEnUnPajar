        function toggleMenu() {
            document.getElementById("listaOpciones").classList.toggle("show");
        }

        function seleccionarIdioma(lang, imgSrc, labelText) {
            document.getElementById("imgSeleccionada").src = imgSrc;
            document.getElementById("txtSeleccionado").innerText = labelText;
            document.getElementById("listaOpciones").classList.remove("show");
            cambiarIdioma(lang);
        }

        // Cierra el desplegable si se hace clic fuera
        window.addEventListener("click", function(e) {
            if (!e.target.closest(".custom-dropdown")) {
                document.getElementById("listaOpciones").classList.remove("show");
            }
        });

        let idiomaActual = "es";

        const traducciones = {
            es: {
                titulo: "UNA AGUJA EN UN PAJAR",
                pajaQuitada: "Paja quitada: ",
                tiempo: "Tiempo: ",
                victoria: "¡Aguja encontrada!",
                hasQuitado: "Has quitado ",
                pajasTexto: " pajas.",
                tiempoTotal: "Tiempo total: ",
                jugarDeNuevo: "Jugar de nuevo"
            },
            en: {
                titulo: "A NEEDLE IN A HAYSTACK",
                pajaQuitada: "Straw removed: ",
                tiempo: "Time: ",
                victoria: "Needle found!",
                hasQuitado: "You removed ",
                pajasTexto: " straws.",
                tiempoTotal: "Total time: ",
                jugarDeNuevo: "Play again"
            }
        };

        function cambiarIdioma(lang) {
            idiomaActual = lang;
            const t = traducciones[lang];

            document.getElementById("txtTitulo").innerText = t.titulo;
            document.getElementById("txtVictoria").innerText = t.victoria;
            document.getElementById("btnReiniciar").innerText = t.jugarDeNuevo;
            
            pajQuit.textContent = t.pajaQuitada + contador;
            document.getElementById("cronometro").innerText = t.tiempo + formatearTiempo(tiempoSegundos);

            if (document.getElementById("modalVictoria").style.display === "flex") {
                document.getElementById("textoContador").innerText = t.hasQuitado + contador + t.pajasTexto;
                document.getElementById("textoTiempo").innerText = t.tiempoTotal + formatearTiempo(tiempoSegundos);
            }
        }

        let tiempoSegundos = 0;
        let intervaloTiempo = null;
        let sonidoYaSonado = [];

        function formatearTiempo(segundosTotales) {
            let horas = Math.floor(segundosTotales / 3600);
            let minutos = Math.floor((segundosTotales % 3600) / 60);
            let segundos = segundosTotales % 60;

            let h = horas < 10 ? "0" + horas : horas;
            let m = minutos < 10 ? "0" + minutos : minutos;
            let s = segundos < 10 ? "0" + segundos : segundos;

            return h + ":" + m + ":" + s;
        }

        function iniciarCronometro() {
            clearInterval(intervaloTiempo);
            tiempoSegundos = 0;
            document.getElementById("cronometro").innerText = traducciones[idiomaActual].tiempo + "00:00:00";

            intervaloTiempo = setInterval(function() {
                tiempoSegundos++;
                document.getElementById("cronometro").innerText = traducciones[idiomaActual].tiempo + formatearTiempo(tiempoSegundos);
            }, 1000);
        }

        function detenerCronometro() {
            clearInterval(intervaloTiempo);
        }
        
        const musica = document.getElementById("musicaFondo");

        window.addEventListener("load", function() {
            musica.volume = 0.4;
            musica.play().catch(function(error) {
                window.addEventListener("click", function() {
                    if (musica.paused) {
                        musica.play();
                    }
                }, { once: true });
            });
        });

        const musicaGanar = document.getElementById("musicaGanar");

        function sonidoGanarReproducir(){
            if (musicaGanar.paused) {
                musicaGanar.volume = 1.0;
                musicaGanar.play();
            }
        }

        const sonido = document.getElementById("sonido");

        let bolsaAudios = [];

        function obtenerNumeroSinRepetir() {
            if (bolsaAudios.length === 0) {
                bolsaAudios = Array.from({ length: 80 }, (_, i) => i + 1);

                for (let i = bolsaAudios.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [bolsaAudios[i], bolsaAudios[j]] = [bolsaAudios[j], bolsaAudios[i]];
                }
            }
            return bolsaAudios.pop(); 
        }

        function sonidoAlAzar() {
            const azar = obtenerNumeroSinRepetir();
        
            const sonido = document.getElementById("sonido");
            sonido.setAttribute("src", `./audio/s${azar}.mp3`);

            if (sonido.paused) {
                sonido.volume = 1.0;
                sonido.play();
            }
        }
        
        let caja = document.getElementById("caja");
        let pajQuit = document.getElementById("pajQuit");

        let contador = 0

        function cargarJuego(){
            iniciarCronometro();
            let numAzar = Math.floor((Math.random() * (5000 - 1)) + 1);

            const paloAncho = 10;
            const paloAlto = 60;

            const maxLeft = caja.clientWidth - paloAncho;
            const maxTop = caja.clientHeight - paloAlto;

            for (let i = 1; i <= 5000; i++) {

                let div = document.createElement("div");

                if(i == numAzar){
                    div.setAttribute("id", "true");
                }
                else{
                    div.setAttribute("id", "false");
                }

                let angulo = Math.floor(Math.random() * 360);

                div.style.left = Math.floor(Math.random() * maxLeft) + "px";
                div.style.top = Math.floor(Math.random() * maxTop) + "px";

                div.style.transform = "rotate(" + angulo + "deg)";

                caja.appendChild(div);

            }

            let paja = document.querySelectorAll("#false")
            let aguja = document.querySelector("#true")

            for (let i = 0; i < paja.length; i++) {
                paja[i].addEventListener("click", tocaPaja)  
            }

            aguja.addEventListener("click", tocaAguja)  

        }

        cargarJuego()

        function tocaPaja(event) {

            let nodoClick
            
            if(event){
                nodoClick = event.target
                caja.removeChild(nodoClick)
                sonidoAlAzar()
                contador++
                pajQuit.textContent = traducciones[idiomaActual].pajaQuitada + contador
            }
        }
        
        function tocaAguja(event) {

            let nodoClick

            if(event){
                nodoClick = event.target
                caja.removeChild(nodoClick)
                sonidoGanarReproducir()
                detenerCronometro();
                document.getElementById("textoContador").innerText = traducciones[idiomaActual].hasQuitado + contador + traducciones[idiomaActual].pajasTexto;
                document.getElementById("textoTiempo").innerText = traducciones[idiomaActual].tiempoTotal + formatearTiempo(tiempoSegundos);
                document.getElementById("modalVictoria").style.display = "flex";

                caja.replaceChildren();
            }
        }

        function cerrarModal() {
            contador = 0
            pajQuit.textContent = traducciones[idiomaActual].pajaQuitada + contador
            document.getElementById("modalVictoria").style.display = "none";
            cargarJuego()
        }