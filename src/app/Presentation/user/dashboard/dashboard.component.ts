import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent
} from "ng-apexcharts";
import { MediaMatcher } from '@angular/cdk/layout';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("chartCandlestick") chartCandl!: ChartComponent;

  public chartOptions!: any;
  public chartCandlestick!: any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  items!: MenuItem[];
  cities!: any[];
  statusOfOrders!: any[];
  selectedCity!: any;
  plotOptions: any = {
    pie: {
      size: '100%',
      disblay: "block",

      startAngle: 0,
      endAngle: 360,
      expandOnClick: true,
      offsetX: 30,
      offsetY: 0,
      customScale: 10,
      dataLabels: {
        offset: 0,
        minAngleToShowLabel: 10
      },

    }
  }
  dataLabels: any = {
    enabled: false,
    offset: 0,
    formatter: function (val: any) {
      return val + "%"
    }
  }

  constructor(media: MediaMatcher, private changeDetectorRef: ChangeDetectorRef) {
    this.mobileQuery = media.matchMedia('(max-width: 992px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.chartCandlestick.chart = {
          type: "candlestick",
          width: "100%",
          height: 350,


          zoom: {
            enabled: true
          },
        }
        changeDetectorRef.detectChanges();
      }



    };
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit() {
    this.chartCandlestick = {
      series: [
        {
          name: "candle",
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33]
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11]
            },
            {
              x: new Date(1538782200000),
              y: [6630.71, 6648.95, 6623.34, 6635.65]
            },
            {
              x: new Date(1538784000000),
              y: [6635.65, 6651, 6629.67, 6638.24]
            },
            {
              x: new Date(1538785800000),
              y: [6638.24, 6640, 6620, 6624.47]
            },
            {
              x: new Date(1538787600000),
              y: [6624.53, 6636.03, 6621.68, 6624.31]
            },
            {
              x: new Date(1538789400000),
              y: [6624.61, 6632.2, 6617, 6626.02]
            },
            {
              x: new Date(1538791200000),
              y: [6627, 6627.62, 6584.22, 6603.02]
            },
            {
              x: new Date(1538793000000),
              y: [6605, 6608.03, 6598.95, 6604.01]
            },
            {
              x: new Date(1538794800000),
              y: [6604.5, 6614.4, 6602.26, 6608.02]
            },
            {
              x: new Date(1538796600000),
              y: [6608.02, 6610.68, 6601.99, 6608.91]
            },
            {
              x: new Date(1538798400000),
              y: [6608.91, 6618.99, 6608.01, 6612]
            },
            {
              x: new Date(1538800200000),
              y: [6612, 6615.13, 6605.09, 6612]
            },
            {
              x: new Date(1538802000000),
              y: [6612, 6624.12, 6608.43, 6622.95]
            },
            {
              x: new Date(1538803800000),
              y: [6623.91, 6623.91, 6615, 6615.67]
            },
            {
              x: new Date(1538805600000),
              y: [6618.69, 6618.74, 6610, 6610.4]
            },
            {
              x: new Date(1538807400000),
              y: [6611, 6622.78, 6610.4, 6614.9]
            },
            {
              x: new Date(1538809200000),
              y: [6614.9, 6626.2, 6613.33, 6623.45]
            },

          ]
        }
      ],
      chart: {
        type: "candlestick",
        width: "110%",
        height: 350,


        zoom: {
          enabled: true
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#3C90EB',
            downward: '#10B981'
          }
        }
      },

      xaxis: {
        type: "datetime",
        offestX: 50,

      },
      yaxis: {
        width: 100,
        offestX: 50,

        labels: {
          show: true,
          offestX: 50,

        },
        tooltip: {
          enabled: true

        }
      }
    };
    if (this.mobileQuery.matches) {
      this.chartCandlestick.chart = {
        type: "candlestick",
        width: "100%",
        height: 350,


        zoom: {
          enabled: true
        },
      }
    }
    this.chartOptions = {
      series: [55, 44, 13],
      chart: {
        type: "donut",
        width: "100%",
        height: 400,
        offsetY: 20
      },
      colors: ['#10B981', 'rgba(251, 191, 36, 1)', 'rgba(239, 68, 68, 1)'],
      plotOptions: {
        pie: {
          size: 200,
          offset: 0,
          dataLabels: {
            offset: 0,
          },
          dount: {
            offset: 0

          }
        }
      },
      labels: [`
      <span class='d-block title-chart-dount'>
        الطلبات المقبولة
      </span>
      <span class='d-block subTitle-chart-dount'>
      <strong>2.5</strong> طلب
      </span>
      `, `
      <span class='d-block title-chart-dount'>
الطلبات المنتظرة
      </span>
      <span class='d-block subTitle-chart-dount'>
      <strong>6.4</strong> طلب
      </span>
      `, `
      <span class='d-block title-chart-dount'>
الطلبات الرفوضة
      </span>
      <span class='d-block subTitle-chart-dount'>
      <strong>1,202</strong> طلب
      </span>
      `],
      legend: {
        position: "bottom",
        horizontalAlign: 'center',
        width: "100%",
        offsetY: 10,

        itemMargin: {
          horizontal: 15,
          vertical: 0,

        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%"
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    this.statusOfOrders = [
      { name: 'اليوم', code: 'today' },
      { name: 'الاسبوع', code: 'week' },
      { name: 'الشهر', code: 'month' }
    ];
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
            command: () => {
            }
          }
        ]
      },
      {
        label: 'Navigate',
        items: [
          {
            label: 'Angular',
            icon: 'pi pi-external-link',
            url: 'http://angular.io'
          },
          {
            label: 'Router',
            icon: 'pi pi-upload',
            routerLink: '/fileupload'
          }
        ]
      }
    ];
  }
}
