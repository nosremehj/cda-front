import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Chamado } from 'src/app/models/chamado';
import { ChamadoService } from 'src/app/services/chamado.service';

@Component({
  selector: 'app-chamado-list',
  templateUrl: './chamado-list.component.html',
  styleUrls: ['./chamado-list.component.css']
})
export class ChamadoListComponent implements OnInit {

  CHAMADO_DATA: Chamado[] = [];
  FILTRO_DATA: Chamado[] = [];

  displayedColumns: string[] = ['id', 'titulo', 'cliente', 'tecnico', 'dataAbertura', 'prioridade', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Chamado>(this.CHAMADO_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private service: ChamadoService,
    private toast: ToastrService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    this.service.findAll().subscribe( resposta => {
      this.CHAMADO_DATA = resposta;
      this.dataSource = new MatTableDataSource<Chamado>(resposta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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

  orderByStatus(status: any): void{
    let list: Chamado[]=[];
    this.CHAMADO_DATA.forEach( chamado => {
      if(chamado.status == status)
        list.push(chamado)
    });
    this.FILTRO_DATA = list;
    this.dataSource = new MatTableDataSource<Chamado>(list);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
