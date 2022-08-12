import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { Cliente } from 'src/app/models/cliente';
import { Tecnico } from 'src/app/models/tecnico';
import { ChamadoService } from 'src/app/services/chamado.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-chamado-update',
  templateUrl: './chamado-update.component.html',
  styleUrls: ['./chamado-update.component.css']
})
export class ChamadoUpdateComponent implements OnInit {
  
  clientes: Cliente[] = []
  tecnicos: Tecnico[] = []

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

  prioridade : FormControl = new FormControl(null, [Validators.required])
  status : FormControl = new FormControl(null, [Validators.required])
  titulo : FormControl = new FormControl(null, [Validators.required])
  observacoes : FormControl = new FormControl(null, [Validators.required])
  tecnico : FormControl = new FormControl(null, [Validators.required])
  cliente : FormControl = new FormControl(null, [Validators.required])

  constructor(
    private chamadoService: ChamadoService,
    private clienteService: ClienteService,
    private tecnicoService: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.chamado.id = this.route.snapshot.paramMap.get('id');
    this.findById();
    this.findAllClientes();
    this.findAllTecnicos();
  }

  findAllClientes(): void{
    this.clienteService.findAll().subscribe( resposta =>{
      this.clientes = resposta;
    })
  }

  findAllTecnicos(): void{
    this.tecnicoService.findAll().subscribe( resposta =>{
      this.tecnicos = resposta;
    })
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

  update(): void{
    this.chamadoService.update(this.chamado).subscribe( resposta =>{
      this.toast.success('Chamado atualizado com sucesso!', 'Atualização');
      this.router.navigate(['chamados']);
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

  validaCampos(): boolean{
    return this.prioridade.valid && this.status.valid && this.titulo.valid && this.observacoes.valid && this.tecnico.valid && this.cliente.valid
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
