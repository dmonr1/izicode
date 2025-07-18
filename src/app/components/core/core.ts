import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-core',
  imports: [CommonModule, NzIconModule],
  templateUrl: './core.html',
  styleUrl: './core.scss',
  standalone: true
})

export class Core implements OnInit {
  @ViewChild('fondoZoom') fondoZoom!: ElementRef;
  @ViewChild('videoPlayer1') videoPlayer1!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoPlayer2') videoPlayer2!: ElementRef<HTMLVideoElement>;
  @ViewChild('fraseTexto') fraseTexto!: ElementRef;

  video1Muted = false;

  mostrarTelon = true;
  private audio = new Audio('/assets/videoplayback.mp3');
  private audioFondo = new Audio('/assets/sounds/piano.mp3');
  private reproduciendo = false;
  mostrarVideo = false;

  constructor(private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.audioFondo.loop = true;
    this.audioFondo.volume = 1;
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
      'No hay cueva tan honda, ni sombra tan densa,',
      () => {
        this.escribirTexto(
          'linea2',
          'que logre apagar la forma en que tú te iluminas.',
          () => {
            if (this.reproduciendo) {
              this.audio.pause();
              this.audio.currentTime = 0;
              this.reproduciendo = false;
            }

            setTimeout(() => this.ejecutarZoomYNegro(), 6000);
          },
          80
        );
      },
      80
    );
  }

  escribirTexto(id: string, texto: string, callback?: () => void, velocidad = 80) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    let i = 0;
    const int = setInterval(() => {
      el.textContent += texto.charAt(i);
      i++;
      if (i >= texto.length) {
        clearInterval(int);
        if (callback) callback();
      }
    }, velocidad);
  }


  ejecutarZoomYNegro() {
    const fondo = this.fondoZoom.nativeElement as HTMLElement;
    const contenedor = document.querySelector('.cont-general') as HTMLElement;
  
    if (this.fraseTexto) {
      this.fraseTexto.nativeElement.classList.add('ocultar-frase');
    }
  
    fondo.classList.add('zoom-in');
  
    setTimeout(() => {
      fondo.classList.remove('zoom-in');
      fondo.classList.add('fondo-negro');
      contenedor.classList.add('fondo-negro-activo');
  
      setTimeout(() => {
        this.mostrarVideos = true;
      }, 1000);
    }, 3000);
  }

  volverAlLogin() {
    this.audioFondo.pause();
    this.audioFondo.currentTime = 0;
    this.router.navigate(['/login']);
  }

  mostrarVideos = false;
  mostrarSegundoVideo = false;
  mostrarSegundoVideoFinal = false;

  iniciarAnimacionSegundoVideo() {
    if (!this.mostrarSegundoVideo) {
      this.mostrarSegundoVideo = true;
      this.video1Muted = true;
  
      const video1 = this.videoPlayer1?.nativeElement;
  
      if (video1) {
        video1.muted = true;
        if (video1.paused) {
          video1.play().catch(() => {});
        }
      }
  
      setTimeout(() => {
        this.mostrarSegundoVideoFinal = true;
  
        setTimeout(() => {
          const video2 = this.videoPlayer2?.nativeElement;
          if (video2) {
            video2.volume = 0.2;
            video2.muted = false;
  
            // 👇 Vigilar el final (últimos 0.2 segundos)
            const duracion = video2.duration;
            const intervalo = setInterval(() => {
              if (video2.currentTime >= duracion - 0.2) {
                video2.muted = true;
                clearInterval(intervalo); // solo mutear una vez
              }
            }, 100);
          }
        }, 100);
      }, 1000);
    }
  }
  

 
    
}
