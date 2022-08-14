import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { ChamadoService } from 'src/app/services/chamado.service';

@Component({
  selector: 'app-chamado-view',
  templateUrl: './chamado-view.component.html',
  styleUrls: ['./chamado-view.component.css']
})
export class ChamadoViewComponent implements OnInit {

  chamado: Chamado = {
    prioridade: '',
    status: '',
    titulo: '',
    observacoes: '',
    tecnico: '',
    cliente: '',
    nomeCliente: '',
    nomeTecnico: '',
  }

  constructor(
    private chamadoService: ChamadoService,
    private toast: ToastrService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.findById();
  }

  

  findById(): void{
    this.chamadoService.findById(this.chamado.id).subscribe( resposta =>{
      this.chamado = resposta;
    }, ex => {
      if(ex.error.errors){
        ex.error.errors.forEach(element => {
          this.toast.error(element.message);
        });
      }else{
        this.toast.error(ex.error.message);
      }
    })
  }

  retornaStatus(status: any): string{
    if(status == 0){
      return 'Aberto'
    } else if(status ==1){
      return 'Em andamento'
    }else{
      return 'Encerrado'
    }
  }
  retornaPrioridade(status: any): string{
    if(status == 0){
      return 'Baixa'
    } else if(status ==1){
      return 'Média'
    }else{
      return 'Alta'
    }
  }
}
