import React from 'react';
import './App.css';
var echarts = require('echarts');
// require('echarts/map/js/china');
require("echarts/theme/macarons.js");

class Indiamap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            areaBorrowAmt: [],
            areaBorrowRepay: [],
            areaRegister: [],
        }
    }
    async fetch() {
        this.setState({
            loading: true
        });
        const res = await fetch('api/india-user');
        const data = await res.json();
        const userData = data.data.data;
        var json1 = [];
        var json2 = [];
        var json3 = [];
        for (let item1 in userData.areaBorrowAmt) {
            json1.push({ 'name': item1, 'value': userData.areaBorrowAmt[item1] })
        }
        for (let item2 in userData.areaRegister) {
            json2.push({ 'name': item2, 'value': userData.areaRegister[item2] });
        }
        for (let item3 in userData.areaBorrowRepay) {
            json3.push({ 'name': item3, 'value': userData.areaBorrowRepay[item3] });
        }
        this.setState({
            loading: false,
            areaBorrowAmt: json1,
            areaRegister: json2,
            areaBorrowRepay: json3
        });
        this.drawMap();
        /* Utils.ajaxData({
            url: '/modules/manage/workbench/areaInfo.htm',
            method: "get",
            callback: (result) => {
                var json1 = [];
                var json2 = [];
                var json3 = [];
                for (let item1 in result.data.areaBorrowAmt) {
                    json1.push({ 'name': item1, 'value': result.data.areaBorrowAmt[item1] });

                }
                for (let item2 in result.data.areaRegister) {
                    json2.push({ 'name': item2, 'value': result.data.areaRegister[item2] });
                }
                for (let item3 in result.data.areaBorrowRepay) {
                    json3.push({ 'name': item3, 'value': result.data.areaBorrowRepay[item3] });
                }
                this.setState({
                    loading: false,
                    areaBorrowAmt: json1,
                    areaRegister: json2,
                    areaBorrowRepay: json3
                });
                this.drawMap();

            }
        }); */
    }
    componentDidMount() {
        this.fetch();
    }
    async drawMap() {
        // console.log(echarts)
        const res = await fetch('api/india-map');
        const data = await res.json();
        const mapData = data.data;

        echarts.registerMap('india', mapData);
        var map = echarts.init(document.getElementById('map'), 'macarons');
        
        var mapOption = {
            title: {
                text: '用户地域分布',
                subtext: '',
                left: 'center',
                y: 10,
                textStyle: {
                    color: '#666',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    var province = params.name;
                    var res = province + '</br>';
                    var series = mapOption.series;
                    var monad;
                    for (var j = 0; j < series.length; j++) {
                        for (var i = 0; i < series[j].data.length; i++) {
                            if (series[j].data[i].name == province) {
                                switch (series[j].name) {
                                    case '累计注册用户': monad = '个'; break;
                                    case '累计放款金额': monad = '元'; break;
                                    case '累计还款金额': monad = '元'; break;
                                    default: monad = ''; break;
                                }
                                res += series[j].name + ': ' + (series[j].data[i] && series[j].data[i].value ? series[j].data[i].value : 0) + monad + '<br/>';
                            }
                        }
                    }
                    return res;
                },
                textStyle: {
                    align: 'left'
                }
            },
            legend: {
                orient: 'vertical',
                left: '20',
                top: '20',
                data: ['累计注册用户', '累计放款金额', '累计还款金额']
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '20',
                top: '20',
                feature: {
                    restore: { title: '刷新' },
                    saveAsImage: {}
                }
            },
            series: [
                
                {
                    name: '累计注册用户',
                    type: 'map',
                    mapType: 'india', 
                    roam: false,
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    label: {
                        show:true,
                        position: [10, 10]
                    },
                    data:this.state.areaRegister
                    
                },
                {
                    name: '累计放款金额',
                    type: 'map',
                    mapType: 'india', 
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data:this.state.areaBorrowAmt
                    
                },
                {
                    name: '累计还款金额',
                    type: 'map',
                    mapType: 'india', 
                    itemStyle:{
                        normal:{label:{show:true}},
                        emphasis:{label:{show:true}}
                    },
                    data:this.state.areaBorrowRepay
                    
                }
            ]
        };
        map.setOption(mapOption);
    }
    render() {
        return <div id="map" style={{ height: '500px', width: '850px', margin: '0 auto' }}></div>
    }
}
export default Indiamap