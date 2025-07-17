import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-triste',
  imports: [CommonModule, NzIconModule],
  templateUrl: './triste.html',
  styleUrl: './triste.scss',
  standalone: true
})
export class Triste implements OnInit {
  mostrarTelon = true;
  private audio = new Audio('/assets/videoplayback.mp3');
  private audioFondo = new Audio('/assets/sounds/fondo1.mp3'); 
  private reproduciendo = false;

  ngOnInit() {
    this.audioFondo.loop = true;
    this.audioFondo.volume = 0.1;
    this.audioFondo.play().catch(() => {});
    setTimeout(() => {
      this.iniciarEscritura();
    }, 500); 
  }

  iniciarEscritura() {
    this.audio.loop = true;
    this.audio.volume = 0.8;
    this.audio.play().then(() => {
      this.reproduciendo = true;
    }).catch(() => {});

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
}
