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
  @ViewChild('fraseFinalTexto') fraseFinalTexto!: ElementRef;

  mostrarFraseFinal = false;
  video1Muted = false;
  mostrarTelon = true;
  private audioEscrituraFinal = new Audio('/assets/sounds/videoplayback.mp3');
  private audioFondo = new Audio('/assets/sounds/piano.mp3');
  private reproduciendo = false;
  mostrarVideo = false;
  private audioEntrada = new Audio('/assets/sounds/entrada.mp3');

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

    this.escribirTexto(
      'linea1',
      'No hay cueva tan honda, ni sombra tan densa,',
      () => {
        this.escribirTexto(
          'linea2',
          'que logre apagar la forma en que tú te iluminas.',
          () => {


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

    this.audioEscrituraFinal.pause();
    this.audioEscrituraFinal.currentTime = 0;

    this.audioEntrada.play().catch(() => { });

    this.router.navigate(['/login']);
  }


  mostrarVideos = false;
  mostrarSegundoVideo = false;
  mostrarSegundoVideoFinal = false;
  mostrarBotonContinuar = false;

  iniciarAnimacionSegundoVideo() {
    if (!this.mostrarSegundoVideo) {
      this.mostrarSegundoVideo = true;
      this.video1Muted = true;

      const video1 = this.videoPlayer1?.nativeElement;

      if (video1) {
        video1.muted = true;
        if (video1.paused) {
          video1.play().catch(() => { });
        }
      }

      setTimeout(() => {
        this.mostrarSegundoVideoFinal = true;

        setTimeout(() => {
          const video2 = this.videoPlayer2?.nativeElement;
          if (video2) {
            video2.volume = 0.2;
            video2.muted = false;

            const duracion = video2.duration;
            const intervalo = setInterval(() => {
              if (video2.currentTime >= duracion - 0.2) {
                video2.muted = true;
                clearInterval(intervalo);

                this.reubicarVideos();
              }
            }, 100);
          }
        }, 100);
      }, 1000);
    }
  }

  reubicarVideos() {
    const contenedorVideos = document.querySelector('.video-container') as HTMLElement;
    if (contenedorVideos) {
      contenedorVideos.classList.add('videos-final-pos');
    }

    setTimeout(() => {
      this.mostrarFraseFinal = true;

      setTimeout(() => {
        this.escribirTexto('finalLinea1', 'Tú no eres tus miedos, ni tus errores.', () => {
          this.escribirTexto(
            'finalLinea2',
            'Eres la mujer que sigue adelante a pesar de ellos, lo sé porque lo veo, y eso es admirable.\nSigue estando aquí a pesar de tanto, de haber cargado con más de lo que no merecías y aun así veo en ti el amor.',
            () => {

              const fadeDuration = 3000;
              const fadeSteps = 30;
              const intervalTime = fadeDuration / fadeSteps;
              let currentStep = 0;

              const fadeOut = setInterval(() => {
                currentStep++;
                const newVolume = Math.max(0, 1 - (currentStep / fadeSteps));
                this.audioFondo.volume = newVolume;

                if (currentStep >= fadeSteps) {
                  clearInterval(fadeOut);
                  this.audioFondo.pause();
                  this.audioFondo.currentTime = 0;

                  setTimeout(() => {
                    this.audioEscrituraFinal.volume = 1;
                    this.audioEscrituraFinal.play().catch(() => { });

                    this.escribirTexto(
                      'finalLinea3',
                      'Tienes una fuerza que a veces olvidas, pero yo no.',
                      () => {
                        this.audioEscrituraFinal.pause();
                        this.audioEscrituraFinal.currentTime = 0;

                        setTimeout(() => {
                          this.audioFondo.volume = 0;
                          this.audioFondo.play().catch(() => { });

                          const fadeInDuration = 3000;
                          const fadeInSteps = 30;
                          const intervalFade = fadeInDuration / fadeInSteps;
                          let stepFade = 0;

                          const fadeIn = setInterval(() => {
                            stepFade++;
                            const newVolume = Math.min(1, stepFade / fadeInSteps);
                            this.audioFondo.volume = newVolume;

                            if (stepFade >= fadeInSteps) {
                              clearInterval(fadeIn);
                            }
                          }, intervalFade);

                          this.mostrarBotonContinuar = true;
                        }, 3000);
                      },
                      80
                    );
                  }, 1000);
                }
              }, intervalTime);
            },
            70
          );
        }, 70);
      }, 100);
    }, 1000);
  }

  irAlFinal() {
    this.audioFondo.pause();
    this.audioFondo.currentTime = 0;
    this.router.navigate(['/fin']);  }

}
