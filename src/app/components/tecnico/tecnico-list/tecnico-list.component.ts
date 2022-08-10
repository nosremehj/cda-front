import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogoConfirmComponent } from '../../dialogo-confirm/dialogo-confirm.component';

@Component({
  selector: 'app-tecnico-list',
  templateUrl: './tecnico-list.component.html',
  styleUrls: ['./tecnico-list.component.css']
})
export class TecnicoListComponent implements OnInit {
  
  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    email: '',
    senha: '',
    perfis: [],
    dataCriacao: ''
  }

  TECNICO_DATA: Tecnico[] = [];

  displayedColumns: string[] = ['id', 'nome', 'cpf', 'email', 'acoes'];
  dataSource = new MatTableDataSource<Tecnico>(this.TECNICO_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: TecnicoService,
    private toast: ToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.service.findAll().subscribe(resposta => {
      this.TECNICO_DATA = resposta
      this.dataSource = new MatTableDataSource<Tecnico>(resposta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  findById():void {
    this.service.findById(this.tecnico.id).subscribe(resposta => {
      resposta.perfis = []
      this.tecnico = resposta;
    }) 
  }

  reloadPag(uri:string){
    this.router.navigateByUrl(`/`, {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]))
  }

  delete(id: any) {
    const dialogoReferencia = this.dialog.open(DialogoConfirmComponent);
    dialogoReferencia.afterClosed().subscribe( resposta=>{
      if(resposta){
        this.service.delete(id).subscribe(() => {
          this.toast.success("Técnico deletado com sucesso!", 'Delete');
          this.reloadPag(`tecnicos`)
        }, ex => {
          if(ex.error.errors){
            ex.error.errors.forEach(element => {
              this.toast.error(element.message);
            });
          }else{
            this.toast.error(ex.error.message);
          }
        });
      }
    })
    
  }

}