import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ser',
  imports: [CommonModule, NzIconModule],
  templateUrl: './ser.html',
  styleUrl: './ser.scss',
  standalone: true
})
export class Ser implements OnInit {

  mostrarTelon = true;
  private audio = new Audio('/assets/videoplayback.mp3');
  private audioFondo = new Audio('/assets/sounds/fondo2.mp3');
  private reproduciendo = false;
  private audioEntrada = new Audio('/assets/sounds/entrada.mp3');

  mostrarBloqueo = true;
  claveIngresada = '';
  animarFrase = false;
  mostrarGaleria = false;


  constructor(private router: Router) { }

  ngOnInit() {
    document.addEventListener('keydown', this.detectarTecla.bind(this));
  }

  detectarTecla(event: KeyboardEvent) {
    if (!this.mostrarBloqueo) return;

    const tecla = event.key;

    if (/^[0-9]$/.test(tecla)) {
      this.ingresarNumero(tecla);
      this.activarAnimacionBoton(tecla);
    } else if (tecla === 'Backspace') {
      this.borrarUltimo();
      this.activarAnimacionBoton('borrar');
    }
  }

  activarAnimacionBoton(valor: string) {
    const boton = document.getElementById(`btn-${valor}`);
    if (!boton) return;

    boton.classList.add('tecla-activa');

    setTimeout(() => {
      boton.classList.remove('tecla-activa');
    }, 300);
  }


  ngOnDestroy() {
    document.removeEventListener('keydown', this.detectarTecla.bind(this));
  }

  iniciarEscritura() {
    this.audio.loop = true;
    this.audio.volume = 0.8;
    this.audio.play().catch(() => { });
  
    this.escribirTexto(
      'linea1',
      'Si alguien me preguntara qué es la hermosura, solo tendría que mirarte para responder.',
      () => {
        this.escribirTexto(
          'linea2',
          'Y solo con una mirada tuya todo tiene sentido.',
          () => {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.reproduciendo = false;
            this.animarFrase = true;
  
            setTimeout(() => {
              this.mostrarGaleria = true;
              setTimeout(() => this.mostrarSecuenciaGaleria(), 100); 
            }, 1500);
          },
          80
        );
      },
      80
    );
  }
  
  async mostrarSecuenciaGaleria() {
    const esperar = (ms: number) => new Promise(res => setTimeout(res, ms));
  
    const mostrarVideo = async (selector: string) => {
      const video = document.querySelector(selector) as HTMLVideoElement;
      if (!video) return;
      video.classList.add('visible');
      video.currentTime = 0;
      video.muted = false;
      await video.play().catch(() => { });
  
      await new Promise<void>((res) => {
        video.onended = () => {
          video.muted = true;
          video.loop = true;
          video.play().catch(() => {});
          res();
        };
      });
    };
  
    const mostrarImagen = async (selector: string) => {
      const el = document.querySelector(selector) as HTMLElement;
      if (!el) return;
      el.classList.add('visible');
      await esperar(5000); 
    };
  
    await mostrarVideo('.gal-1'); 
    await esperar(1000);
    await mostrarVideo('.gal-2'); 
  
    await mostrarImagen('.gal-3'); 
    await mostrarImagen('.gal-4'); 
    await mostrarImagen('.gal-5'); 
    await mostrarImagen('.gal-6'); 
    await mostrarImagen('.gal-7'); 
  
    await mostrarVideo('.gal-8'); 

    this.mostrarBotonContinuar = true;

  }
  
  

  escribirTexto(elementId: string, texto: string, callback?: () => void, velocidad: number = 80) {
    let i = 0;
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    elemento.textContent = '';
    const intervalo = setInterval(() => {
      elemento.textContent += texto.charAt(i);
      i++;
      if (i >= texto.length) {
        clearInterval(intervalo);
        if (callback) callback();
      }
    }, velocidad);
  }

  volverAlLogin() {
    this.audioFondo.pause();
    this.audioFondo.currentTime = 0;

    this.audioEntrada.play().catch(() => { });
    this.router.navigate(['/login']);
  }

  ingresarNumero(numero: string) {
    if (this.claveIngresada.length < 6) {
      this.claveIngresada += numero;
      if (this.claveIngresada.length === 6) {
        setTimeout(() => {
          this.verificarClave();
        }, 300);
      }
    }
  }

  borrarUltimo() {
    this.claveIngresada = this.claveIngresada.slice(0, -1);
  }

  animarSalidaBloqueo = false;

  verificarClave() {
    if (this.claveIngresada === '101209') {
      this.animarSalidaBloqueo = true;

      setTimeout(() => {
        this.mostrarBloqueo = false;
        this.mostrarTelon = true;
      }, 700);

      setTimeout(() => {
        this.reproducirAudioFondo();
        this.iniciarEscritura();
      }, 1000);
    } else {
      this.claveIngresada = '';
    }
  }

  accionEmergencia() {
    const numero = '51991127220';
    const mensaje = encodeURIComponent('Hola, te necesito urgentemente.');
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  reproducirAudioFondo() {
    this.audioFondo.loop = true;
    this.audioFondo.volume = 0.5;
    this.audioFondo.play().catch(() => { });
  }

  mostrarBotonContinuar = false;
  
  continuar() {
    this.audioFondo.pause();
    this.audioFondo.currentTime = 0;
    this.router.navigate(['/fin']);
  }
}
