import { Component, OnInit } from '@angular/core';
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
    this.router.navigate(['/login']); // Cambia la ruta si usas otra
  }

}
