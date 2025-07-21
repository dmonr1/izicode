import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-fin',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './fin.html',
  styleUrl: './fin.scss',
})
export class Fin implements OnInit {
  imagenActual: string | null = null;
  mostrarBotones = false;
  private audioFondo = new Audio('/assets/sounds/music.mp3');
  private audioEntrada = new Audio('/assets/sounds/entrada.mp3');

  private imagenes: string[] = [];
  private indexImagen = 0;

   texto = `Al final del día, sin importar cómo haya sido, siempre terminas aquí.

No importa si fue un día triste, uno lleno de dudas, o uno alegre.

Siempre terminas siendo tú.

Con tu manera única de sentir, de pensar, de mirar con desconfianza el mundo.

Yo sigo aquí, observándote con cariño, incluso en medio de nuestras diferencias, incluso cuando cuesta demostrarte lo que siento.

Tal vez no siempre he sabido expresarlo con claridad…

Pero cada parte de esto cada palabra, cada página, cada imagen fue pensada para ti.

Porque quiero que sepas que me importas, que te pienso, que te valoro.

Que, aunque tengas días difíciles, sigo eligiéndote.

Y no porque seas perfecta, sino porque eres tú.

Y tú… eres lo que quiero.

A veces lo que duele no es lo que pasa, sino lo que tememos que pase.

Pero aquí estás. Y aquí estoy.

Y aunque no tenga todas las respuestas, tengo algo claro.

Quiero que seas parte de mi vida.

No por necesidad, sino por amor.

Este último minuto no es un final.

Es una forma de recordarte…

Que tú eres mi punto de partida.

Siempre.


Con mucho amor y cariño,
Diego`;

  constructor(private router: Router) {}

  ngOnInit() {
    this.reproducirAudioFondo();
    this.iniciarSecuenciaImagenes();
  }

  reproducirAudioFondo() {
    this.audioFondo.loop = true;
    this.audioFondo.volume = 0.5; 
    this.audioFondo.play().catch(() => {
      console.warn('No se pudo reproducir el audio automáticamente.');
    });
  }
  
  iniciarEscritura() {
    const contenedor = document.getElementById('contenedorTexto');
    if (!contenedor) return;

    let i = 0;
    const duracionTotal = 100000; 
    const velocidad = Math.floor(duracionTotal / this.texto.length); 

    contenedor.textContent = ''; 

    const intervalo = setInterval(() => {
      contenedor.textContent += this.texto.charAt(i);
      i++;
      if (i >= this.texto.length) {
        clearInterval(intervalo);
      }
    }, velocidad);
  }

  iniciarSecuenciaImagenes() {
    this.imagenes = Array.from({ length: 18 }, (_, i) => `/assets/imgs/img${i + 6}.jpg`);
    this.mostrarSiguienteImagen();
  }

  mostrarSiguienteImagen() {
    if (this.indexImagen >= this.imagenes.length) {
      setTimeout(() => {
        // aplicar fadeOut manualmente
        const tele = document.querySelector('.teleprompter') as HTMLElement;
        const pantalla = document.querySelector('.contenedor-pantalla') as HTMLElement;
  
        if (tele) tele.style.animation = 'fadeOut 1s forwards';
        if (pantalla) pantalla.style.animation = 'fadeOut 1s forwards';
  
        setTimeout(() => {
          if (tele) tele.style.display = 'none';
          if (pantalla) pantalla.style.display = 'none';
          this.mostrarBotones = true;
        }, 1000); 
      }, 2000); 
      return;
    }
  
    this.imagenActual = this.imagenes[this.indexImagen];
    this.indexImagen++;
  
    setTimeout(() => {
      this.mostrarSiguienteImagen();
    }, 5000);
  }
  
  repetir() {
    this.indexImagen = 0;
    this.imagenActual = null;
    this.mostrarBotones = false;
  
    const tele = document.querySelector('.teleprompter') as HTMLElement;
    const pantalla = document.querySelector('.contenedor-pantalla') as HTMLElement;
    const contenedorTexto = document.getElementById('contenedorTexto');
  
    if (tele) {
      tele.style.display = 'flex';
      tele.style.animation = 'fadeIn 1s forwards';
    }
  
    if (pantalla) {
      pantalla.style.display = 'flex';
      pantalla.style.animation = 'fadeIn 1s forwards';
    }
  
    if (contenedorTexto) {
      contenedorTexto.style.animation = 'none';
      contenedorTexto.offsetHeight; 
      contenedorTexto.style.animation = 'scrollTeleprompter 110s linear forwards';
    }
  
    this.iniciarSecuenciaImagenes();
  }
  

  irInicio() {
    this.audioFondo.pause();
    this.audioFondo.currentTime = 0;
    this.audioEntrada.play().catch(() => { });
    this.router.navigate(['/inicio']);
  }
}
