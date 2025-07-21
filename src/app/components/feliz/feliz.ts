import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feliz',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './feliz.html',
  styleUrl: './feliz.scss'
})
export class Feliz implements OnInit {
  mostrarTelon = true;
  mostrarPantallaVideo = false;
  ocultarTexto = false;
  videosSubiendo = false;

  private audio = new Audio('/assets/videoplayback.mp3');
  private audioFondo = new Audio('/assets/sounds/guitarra.mp3');
  private reproduciendo = false;
  private audioEntrada = new Audio('/assets/sounds/entrada.mp3');

  videos = [
    { src: '/assets/vids/vid3.mp4', muted: true },
    { src: '/assets/vids/vid4.mp4', muted: false },
    { src: '/assets/vids/vid5.mp4', muted: false }
  ];

  @ViewChildren('videoRef') videoRefs!: QueryList<ElementRef<HTMLVideoElement>>;

  videoActualIndex = 0;
  posiciones: ('izquierda' | 'centro' | 'derecha' | null)[] = ['centro', null, null];

  constructor(private router: Router) { }

  ngOnInit() {
    this.audioFondo.loop = true;
    this.audioFondo.volume = 0.3;
    this.audioFondo.play().catch(() => { });
    setTimeout(() => this.iniciarEscritura(), 500);
  }

  iniciarEscritura() {


    this.escribirTexto('linea1', 'Tu felicidad ilumina todo, no sabes lo lindo que es verte sonreír', () => {
      this.escribirTexto('linea2', 'Verte feliz es una de las cosas más bonitas que me regala el día.', () => {
        if (this.reproduciendo) {
          this.audio.pause();
          this.audio.currentTime = 0;
          this.reproduciendo = false;
        }
        setTimeout(() => {
          this.mostrarPantallaVideo = true;
          this.bajarVolumenFondoGradualmente(0.1, 1200);
          setTimeout(() => this.reproducirVideos(), 300);
        }, 600);
      }, 80);
    }, 80);
  }

  escribirTexto(elementId: string, texto: string, callback?: () => void, velocidad = 80) {
    let i = 0;
    const elemento = document.getElementById(elementId);
    if (!elemento) return;
    elemento.textContent = '';
    const intervalo = setInterval(() => {
      elemento.textContent += texto.charAt(i);
      i++;
      if (i >= texto.length) {
        clearInterval(intervalo);
        callback?.();
      }
    }, velocidad);
  }

  bajarVolumenFondoGradualmente(destino: number, duracion = 1000) {
    const pasos = 20;
    const volumenInicial = this.audioFondo.volume;
    const diferencia = volumenInicial - destino;
    let paso = 0;
    const intervalo = setInterval(() => {
      paso++;
      const nuevoVolumen = volumenInicial - (diferencia * paso) / pasos;
      this.audioFondo.volume = Math.max(destino, nuevoVolumen);
      if (paso >= pasos) clearInterval(intervalo);
    }, duracion / pasos);
  }

  volverAlLogin() {
    this.audioFondo.pause();
    this.audioFondo.currentTime = 0;

    this.audioEntrada.play().catch(() => { });
    this.router.navigate(['/login']);

  }

  getClasePosicion(index: number): string {
    const pos = this.posiciones[index];
    return pos ? `pos-${pos}` : '';
  }

  reproducirVideos() {
    this.reproducirVideo(0);
  }

  reproducirVideo(index: number) {
    const video = this.videoRefs.get(index)?.nativeElement;
    if (video) {
      video.loop = false;
      video.muted = this.videos[index].muted;
      video.volume = this.videos[index].muted ? 0 : 0.2;

      video.play().catch(() => { });

      video.onended = () => {
        this.onVideoEnded(index);

        setTimeout(() => {
          video.loop = true;
          video.muted = true;
          video.volume = 0;
          video.play().catch(() => { });
        }, 300);
      };
    }
  }

  private textoFinalMostrado = false;


  onVideoEnded(index: number) {
  if (index === 0) {
    this.posiciones[0] = 'izquierda';
    this.posiciones[1] = 'centro';
    this.videoActualIndex = 1;
    setTimeout(() => this.reproducirVideo(1), 600);
  } else if (index === 1) {
    this.posiciones[1] = 'derecha';
    this.posiciones[2] = 'centro';
    this.videoActualIndex = 2;
    setTimeout(() => this.reproducirVideo(2), 600);
  } else if (index === 2 && !this.textoFinalMostrado) {
    this.textoFinalMostrado = true;

    this.videoActualIndex = 3;
    this.ocultarTexto = true;
    this.videosSubiendo = true;

    setTimeout(() => {
      this.mostrarBotonFinal = true;
      this.mostrarFraseFinal = true;

      setTimeout(() => this.mostrarTextoFinalLetraPorLetra(), 400);
    }, 1200);
  }
}


  mostrarBotonFinal = false;

  mostrarFraseFinal = false;

private textoFinal = `A veces siento que no te das cuenta de lo feliz que eres cuando te lo propones. Incluso en los días pesados, cuando el trabajo no es fácil, nunca dejas de brillar. Lo veo cuando hablas, cuando estudias, cuando te sumerges en lo que te gusta, cuando simplemente eres tú. Hay una luz que te envuelve, una felicidad tranquila que a veces tú no ves. Y es hermosa. No tengas miedo de ser feliz así, de dejar de ser quien eres, tal cual como eres, eso es lo que hace que te llene por dentro.`;

  mostrarTextoFinalLetraPorLetra() {
  const elemento = document.getElementById('fraseFinal');
  if (!elemento) return;

  let i = 0;
  elemento.textContent = '';
  const velocidad = 60; 

  const intervalo = setInterval(() => {
    elemento.textContent += this.textoFinal.charAt(i);
    i++;
    if (i >= this.textoFinal.length) {
      clearInterval(intervalo);
    }
  }, velocidad);
}

  accionContinuar() {
    this.router.navigate(['/otra-pagina']);
  }
}
