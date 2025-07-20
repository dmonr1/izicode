import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';


@Component({
  selector: 'app-feliz',
  imports: [CommonModule, NzIconModule],
  templateUrl: './feliz.html',
  styleUrl: './feliz.scss',
  standalone: true

})
export class Feliz implements OnInit {

  mostrarTelon = true;
  private audio = new Audio('/assets/videoplayback.mp3');
  private audioFondo = new Audio('/assets/sounds/guitarra.mp3');
  private reproduciendo = false;

  @ViewChild('pantallaVideo') pantallaVideoRef!: ElementRef<HTMLVideoElement>;

videoIndex = 0;
videos = [
  { src: '/assets/vids/vid3.mp4', muted: true },
  { src: '/assets/vids/vid4.mp4', muted: false },
  { src: '/assets/vids/vid5.mp4', muted: true }
];
videoActual = this.videos[this.videoIndex];

mostrarPantallaVideo = false;

ajustarVolumen() {
  const video: HTMLVideoElement | null = document.querySelector('video');
  if (video && !this.videoActual.muted) {
    video.volume = 0.2;
  }
}

reproducirSiguienteVideo() {
  this.videoIndex++;
  if (this.videoIndex < this.videos.length) {
    this.videoActual = this.videos[this.videoIndex];
  } else {
    this.mostrarPantallaVideo = false;
  }
}

  constructor(private router: Router) { }


  ngOnInit() {
    this.audioFondo.loop = true;
    this.audioFondo.volume = 0.3;
    this.audioFondo.play().catch(() => { });
    setTimeout(() => {
      this.iniciarEscritura();
    }, 500);
  }

  iniciarEscritura() {
    this.audio.loop = true;
    this.audio.volume = 0.8;
    this.audio.play().then(() => {
      this.reproduciendo = true;
    }).catch(() => { });

    this.escribirTexto(
      'linea1',
      'Cuando tú sonríes, todo en mí se alumbra, no importa el momento, siempre voy a estar para ti.',
      () => {
        this.escribirTexto(
          'linea2',
          'No necesito respuestas, solo estar ahí contigo.',
          () => {
            if (this.reproduciendo) {
              this.audio.pause();
              this.audio.currentTime = 0;
              this.reproduciendo = false;
            }
            setTimeout(() => {
              this.mostrarPantallaVideo = true;
            }, 600);
          },
          80
        );
      },
      80
    );
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
    this.router.navigate(['/login']);
  }



}
