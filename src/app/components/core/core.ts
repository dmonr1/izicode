import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-core',
  imports: [CommonModule, NzIconModule],
  templateUrl: './core.html',
  styleUrl: './core.scss',
  standalone: true
})
export class Core implements OnInit {
  mostrarTelon = true;
  private audio = new Audio('/assets/videoplayback.mp3');
  private audioFondo = new Audio('/assets/sounds/piano.mp3'); 
  private reproduciendo = false;

    constructor(private router: Router) {}


  ngOnInit() {
    this.audioFondo.loop = true;
    this.audioFondo.volume = 1;
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

   volverAlLogin() {
    this.audioFondo.pause();
    this.audioFondo.currentTime = 0;
    this.router.navigate(['/login']); // Cambia la ruta si usas otra
  }

}
