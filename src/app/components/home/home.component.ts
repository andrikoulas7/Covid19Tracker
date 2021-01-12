import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart'
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart'
  };


  constructor(private dataService: DataServiceService) { }

  initChart(caseType: string) {

    let dataTable = [];
    dataTable.push(["Country", "Cases"])

    this.globalData.forEach(cs => {
      let value: number;
      if (caseType == 'c')
        if (cs.confirmed > 2000)
          value = cs.confirmed
      if (caseType == 'a')
        if (cs.active > 2000)
          value = cs.active
      if (caseType == 'd')
        if (cs.deaths > 1000)
          value = cs.deaths
      if (caseType == 'r')
        if (cs.recovered > 2000)
          value = cs.recovered

      dataTable.push([
        cs.country, value
      ])
    })

    console.log(dataTable);


    this.pieChart = {
      chartType: 'PieChart',
      dataTable: dataTable,
      options: {
        height: 500
      },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: dataTable,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        },
      },
    };
  }

  ngOnInit(): void {
    this.dataService.getGlobalData()
      .subscribe(
        {
          next: (result) => {
            console.log(result);

            this.globalData = result;
            result.forEach(cs => {
              if (!Number.isNaN(cs.confirmed)) {
                this.totalActive += cs.active
                this.totalConfirmed += cs.confirmed
                this.totalDeaths += cs.deaths
                this.totalRecovered += cs.active
              }
            })

            this.initChart('c');
          }
        }
      );
  }

  updateChart(input: HTMLInputElement) {
    this.initChart(input.value)
  }

}
