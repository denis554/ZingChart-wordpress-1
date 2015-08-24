/*
 * TO DO : 
 * Make grapgh div naming dynamic -Done
 * Be able to feed data as a csv file to it
 * Validate form inputs
 * Add set data Key for inputing data,(it is a little buggy)
 * Organize variables into currect opbjects
 */

var ZCWP  ={
  version: '0.5.0',
  company: 'PINT Inc.',
  site: 'http://zingchart.com',
  global: this,
  modules: {},
  fn: function(){}
}

var j = 0;
var labelConfigId  = 0; // This is for the label replaction. It holds each labels id.
var seriesConfigId = 0;
var scaleXCounter  = 1;
var scaleYCounter  = 1;
var jsonObject = '';
var chartTitle = '';
var chartType  = 'Bar';
var chartData = ''; 
var selectedChart = '';
var chartID = 'chartDiv';

/*Genereal form data that has chekbox, select, text, or range will get handeled here. */
function modify_chart(element,key,category,subCategory) {
  var value = ''
  switch (element.type) {
    case("checkbox") :
      value = element.checked;
    break;
    case("select-one") :
      value  = element.options[element.selectedIndex].value;
    break;
    default:
    //default is for text,range
      value= element.value;
  }
  var chartData = zingchart.exec(chartID, 'getdata');
  if (!chartData['graphset'][0][category]) {
    var dataObj = {};
    dataObj[category] = {};
    if (category === "preview" && !element.checked && element.id === "visiblePreview") {
      var tempobj = zingchart.exec(chartID,'getdata' );
        delete tempobj.graphset[0][category];
        zingchart.exec(chartID,'setdata', {
          data : tempobj
        });
        create_json();
    } else {
      if (category != subCategory ) {
        dataObj[category][subCategory] ={};
        dataObj[category][subCategory][key] = value;
      } else {
        dataObj[category][key] = value;
      }
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj   
      });
    }
  } else {
    if (category != subCategory ) {
        if (chartData['graphset'][0][category][subCategory]) {
          chartData['graphset'][0][category][subCategory][key] = value;
        } else {
          chartData['graphset'][0][category][subCategory] ={};
          chartData['graphset'][0][category][subCategory][key] = value;
        }
      } else {
        chartData['graphset'][0][category][key] = value;
      }
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : chartData['graphset'][0], 
      });
  }
    create_json();
}
  
/*
 * Generic functions for bg Color
 */
var bgType= '';
function set_bg_type(id,category,subCategory) {
  var type = document.getElementById(id);
  bgType = type.options[type.selectedIndex].value;
  if (bgType =="gradiant") {
    var domHolder = document.getElementById("backgroundColor2"+subCategory+category);
    domHolder.style.visibility = "visible";
    domHolder.previousElementSibling.style.visibility = "visible";
  } else {
    var domHolder = document.getElementById("backgroundColor2"+subCategory+category)
    domHolder.style.visibility = "hidden";
    domHolder.previousElementSibling.style.visibility = "hidden";
  }
  set_bg_color(category,subCategory);}
function set_bg_color(category,subCategory) {
  var dataObj = {};
  dataObj[category] = {};
  if (category != subCategory) {
    dataObj[category][subCategory] = {};
    if (bgType == "gradiant") {
      //Set background-color-1 attr
    dataObj[category][subCategory]['backgroundColor1'] =  document.getElementById('backgroundColor1'+subCategory+category).value;
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : dataObj
    });
    dataObj[category][subCategory]['backgroundColor2'] =  document.getElementById('backgroundColor2'+subCategory+category).value;
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : dataObj
    });
    } else {
    //Set background-color-1 attr
      dataObj[category][subCategory]['backgroundColor1'] =  document.getElementById('backgroundColor1'+subCategory+category).value;
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
      dataObj[category][subCategory]['backgroundColor2'] =  document.getElementById('backgroundColor1'+subCategory+category).value;
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
    }
  } else {
    if (bgType == "gradiant") {
      //Set background-color-1 attr
      dataObj[category]['backgroundColor1'] =  document.getElementById('backgroundColor1'+subCategory+category).value;
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
      dataObj[category]['backgroundColor2'] =  document.getElementById('backgroundColor2'+subCategory+category).value;
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
    } else {
    //Set background-color-1 attr
      dataObj[category]['backgroundColor1'] =  document.getElementById('backgroundColor1'+subCategory+category).value;
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
      dataObj[category]['backgroundColor2'] =  document.getElementById('backgroundColor1'+subCategory+category).value;
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
    }
  }
  create_json();
 }
 /*
  *  Generic function for seting border
  */
function set_border(category,subCategory) {
  var dataObj = {};
  dataObj[category] = {};
  if (category != subCategory) {
    dataObj[category][subCategory] ={};
    if (document.getElementById("border"+subCategory+category).checked) {
      dataObj[category][subCategory]["border-width"] = document.getElementById('borderWidth'+subCategory+category).value;
      dataObj[category][subCategory]["border-color"] = document.getElementById('borderColor'+subCategory+category).value;
    } else {
       dataObj[category][subCategory]["border-width"] = 0;
    }
  } else {
    if (document.getElementById('border'+category+category).checked) {
      dataObj[category]["border-width"] = document.getElementById('borderWidth'+category+category).value;
      dataObj[category]["border-color"] = document.getElementById('borderColor'+category+category).value;
    } else {
       dataObj[category]["border-width"] = 0;
    }
  }
  zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : dataObj
    });
  create_json();}
/*
 * Generic function for seting line
 */
function set_line(category,subCategory) {
  var dataObj = {};
  dataObj[category] = {};
  if (category != subCategory) {
    dataObj[category][subCategory] ={};
    var lineStyles = document.getElementById("lineStyle"+subCategory+category);
    var style = lineStyles.options[lineStyles.selectedIndex].value;
    dataObj[category][subCategory]["lineStyle"] = (style !='') ? style : 'solid';
    dataObj[category][subCategory]["lineWidth"] = (document.getElementById('lineWidth'+subCategory+category).value !='') ? document.getElementById('lineWidth'+subCategory+category).value : '2px';
    dataObj[category][subCategory]["lineColor"] = (document.getElementById('lineColor'+subCategory+category).value !='') ? document.getElementById('lineColor'+subCategory+category).value :'#000';
    dataObj[category][subCategory]["lineGapSize"] = (document.getElementById('lineGapSize'+subCategory+category).value !='') ? document.getElementById('lineGapSize'+subCategory+category).value :'2px';
    dataObj[category][subCategory]["lineSegmentSize"] = (document.getElementById('lineSegmentSize'+subCategory+category).value !='') ? document.getElementById('lineSegmentSize'+subCategory+category).value :'2px';
  } else {
    var lineStyles = document.getElementById("lineStyle"+category);
    var style = lineStyles.options[lineStyles.selectedIndex].value;
    dataObj[category]["lineStyle"] = (style !='') ? style : 'solid';
    dataObj[category]["lineWidth"] = (document.getElementById('lineWidth'+category).value !='') ? document.getElementById('lineWidth'+category).value : '2px';
    dataObj[category]["lineColor"] = (document.getElementById('lineColor'+category).value !='') ? document.getElementById('lineColor'+category).value :'#000';
    dataObj[category]["lineGapSize"] = (document.getElementById('lineGapSize'+category).value !='') ? document.getElementById('lineGapSize'+category).value :'2px';
    dataObj[category]["lineSegmentSize"] = (document.getElementById('lineSegmentSize'+category).value !='') ? document.getElementById('lineSegmentSize'+category).value :'2px';
  }
  zingchart.exec(chartID,'modify', {
    graphid : 0,
    data : dataObj
  });
  create_json();}
/*
 * Generic function for seting font
 */
function set_font(category,subCategory) { 

  var dataObj = {};
  dataObj[category] = {};
  if (category != subCategory) {
    var txtalgn = document.getElementById('textAlign'+subCategory+category);
    var selected = txtalgn.options[txtalgn.selectedIndex].value;
    var fontstls = document.getElementById('fontStyle'+subCategory+category);
    var style = fontstls.options[fontstls.selectedIndex].value;
    dataObj[category][subCategory] ={};
    dataObj[category][subCategory]["fontColor"] = document.getElementById('fontColor'+subCategory+category).value;
    dataObj[category][subCategory]["fontSize"] = document.getElementById('fontSize'+subCategory+category).value;
    dataObj[category][subCategory]["fontFamily"] = document.getElementById('fontFamily'+subCategory+category).value;
    if (document.getElementById('text'+subCategory+category).value !='') {
      dataObj[category][subCategory]["text"] = document.getElementById('text'+subCategory+category).value;
    } else {
      var tempobj = zingchart.exec(chartID,'getdata' );
      delete tempobj.graphset[0][category][subCategory]["text"];
      zingchart.exec(chartID,'setdata', {
        graphid: 0,
        data : tempobj.graphset[0]
      });
      create_json();
    }
    dataObj[category][subCategory]["textAlign"] = selected;
    dataObj[category][subCategory]["fontStyle"] = style;
    dataObj[category][subCategory]["bold"] = document.getElementById('fontBold'+subCategory+category).checked;
  } else {
      dataObj[category]["fontColor"] = document.getElementById('fontColor'+category).value;
  } 
  zingchart.exec(chartID,'modify', {
    graphid : 0,
    data : dataObj
  });
  zingchart.exec(chartID,'update');
  create_json();}
function new_label() {
  var ttl = document.getElementById("LabelsTitle");
  var lbl = document.getElementById("lableConfig");
  var clnlLbl = lbl.cloneNode(true);
  var clnttl = ttl.cloneNode(true);
  childs = clnlLbl.childNodes;
  labelConfigId++;
  for (var i= 0 , len = clnlLbl.childNodes.length ; i<len; i++) {
    if (childs[i].id) {
      childs[i].id += labelConfigId;
      childs[i].value = "";
      childs[i].setAttribute("data-count",labelConfigId);
      if (childs[i].type == "select-one") {
        childs[i].value = "solid";
      };
      if (childs[i].id =="backgroundColor2labelslabels"+labelConfigId) {
        childs[i].style.visibility ="hidden";
      };
    };
  }
  clnttl.innerHTML += labelConfigId;
  document.querySelector("#labelsAccordion").appendChild(clnttl);
  document.querySelector("#labelsAccordion").appendChild(clnlLbl);
  jQuery(function($) {
    $('#labelsAccordion').accordion("refresh");  
  });
  if (labelConfigId == 1 ) {
    var chartDta = zingchart.exec(chartID, 'getdata');
    var chartLabels = chartDta['graphset'][0]['labels'];
    if( typeof chartLabels == "undefined") {
      var dataObj = {
        labels :[]
      };
      var vals ={}
      dataObj.labels.push(vals);
      dataObj.labels.push(vals);
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj  
      });
    } else {
      var vals ={};
      chartLabels.push(vals);
       zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "labels" : chartLabels
        }  
      });
    }

  } else {
    var chartDta = zingchart.exec(chartID, 'getdata');
    var chartLabels = chartDta['graphset'][0];
    var empty ={}
    chartLabels['labels'].push(empty);
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : chartLabels  
    });
  }
 create_json();}
/*
 * Label Modify chart
 */
function modify_chart_label(id,type,key,category,subcategory,count) {
  var value = ''
  switch (type) {
    case("checkbox") :
      value = document.getElementById(id).checked;
    break;
    case("select-one") :
      var opts = document.getElementById(id);
      value  = opts.options[opts.selectedIndex].value;
    break;
    default:
    //default is for text,range
      value= document.getElementById(id).value;
  }
  // Get chart JSON
  var chartDta = zingchart.exec(chartID, 'getdata');
  var chartLabels = chartDta['graphset'][0]['labels']; // Ternary operator to check to see if 'labels' exists
  if (typeof chartLabels  == "undefined" ){ //Empty array situation, createing a new label
    var dataObj = {
      labels :[],
    };
    var vals = {};
    if (key == 'callout-hook') {
        calloutHook =[];
      calloutHook.push(document.getElementById("callout-hooklabelsX").value);
      calloutHook.push(document.getElementById("callout-hooklabelsY").value);
      dataObj.labels.push(calloutHook);
    } else {
      vals[key] = value;
      dataObj.labels.push(vals);
    }
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj  
      });
  } else { //Labels already exists, so we're modifying instead of createing 
    if (count == chartLabels.length) {//New elemnt case we hace to push it 
      if (key == 'callout-hook') {
        calloutHook =[];
        calloutHook.push(document.getElementById("callout-hooklabelsX").value);
        calloutHook.push(document.getElementById("callout-hooklabelsY").value);
        chartLabels.push(calloutHook);
      } else {
        var vals = {};
        vals[key] = value;
        chartLabels.push(vals);
      }
       zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "labels": chartLabels
        }
      });
    } else {
      chartLabels[count][key] = value;
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "labels": chartLabels
        }
      });
    }
  }
  create_json();}
/*
 * functions for labels bg Color
 */ 
var bgTypelbl= [];
function set_bg_type_label(id,category,subCategory,count) {
  count = (count != 0) ? count : ''; 
  var typeLblIndex = (count == "" ) ? 0 : count;
  var type = document.getElementById(id);
  if (count == bgTypelbl.length) {
    bgTypelbl.push(type.options[type.selectedIndex].value);
  } else {
    bgTypelbl[typeLblIndex] = type.options[type.selectedIndex].value;
  }

  if (bgTypelbl[typeLblIndex] =="gradiant") {
    document.getElementById("backgroundColor2"+subCategory+category+count).style.visibility = "visible";
  } else {
    document.getElementById("backgroundColor2"+subCategory+category+count).style.visibility = "hidden";
  }
  set_bg_color_label(category,subCategory,count);}
function set_bg_color_label(category,subCategory,count) {
  count = (count != 0) ? count : ''; 
  var typeLblIndex = (count == "" ) ? 0 : count;
  // Get chart JSON
  var chartDta = zingchart.exec(chartID, 'getdata');
  var chartLabels = chartDta['graphset'][0]['labels']
  if (typeof chartLabels  == "undefined" ){ //Empty array situation, createing a new label
    console.log("We have to add label!!");
    var dataObj = {
      labels :[],
    };
    var vals = {};
    if (bgTypelbl[typeLblIndex] == "gradiant") {
      //Set background-color-1 attr
    vals['backgroundColor1'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value;
    vals['backgroundColor2'] =  document.getElementById('backgroundColor2'+subCategory+category+count).value;
    dataObj.labels.push (vals);
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : dataObj
    });
    } else {
    //Set background-color-1 attr
      vals['backgroundColor1'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value;
      vals['backgroundColor2'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value;
      dataObj.labels.push (vals);
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
    }  
  } else {
    if (count == chartLabels.length) {
      if (bgTypelbl[typeLblIndex] == "gradiant") {
        //Set background-color-1 attr
        var vals = {};
        vals['background-color-1'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value;
        vals['background-color-2'] =  document.getElementById('backgroundColor2'+subCategory+category+count).value;
      } else {
        //Set background-color-1 attr
        vals['background-color-1'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value;
        vals['background-color-2'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value; 
      } 
      chartLabels.push (vals);
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "labels":chartLabels
        }
      }); 
    } else {
      if (bgTypelbl[typeLblIndex] == "gradiant") {
        //Set background-color-1 attr
        chartLabels[(count == "" ) ? 0 : count]['background-color-1'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value;
        chartLabels[(count == "" ) ? 0 : count]['background-color-2'] =  document.getElementById('backgroundColor2'+subCategory+category+count).value;
      } else {
        //Set background-color-1 attr
        chartLabels[(count == "" ) ? 0 : count]['background-color-1'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value;
        chartLabels[(count == "" ) ? 0 : count]['background-color-2'] =  document.getElementById('backgroundColor1'+subCategory+category+count).value; 
      }
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "labels":chartLabels
        }
      }); 
    }
    
  }   
  create_json();
 }
function set_border_label(category,subCategory,count) {

  count = (count != 0) ? count : ''; 
  // Get chart JSON
  var chartDta = zingchart.exec(chartID, 'getdata');
  var chartLabels = chartDta['graphset'][0]['labels']; 
  if (typeof chartLabels  == "undefined") { 
    var dataObj = {
      labels :[],
    };
    var vals = {};
    if (document.getElementById('border'+category+count).checked) {
      vals["border-width"] = document.getElementById('borderWidth'+category+count).value;
      vals["border-color"] = document.getElementById('borderColor'+category+count).value;
    } else {
      vals["border-width"] = 0;
    }
    dataObj.labels.push (vals);
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : dataObj  
    });
  } else {
    if (document.getElementById('border'+category+count).checked) {
      chartLabels[(count == "" ) ? 0 : count]["border-width"] = document.getElementById('borderWidth'+category+count).value;
      chartLabels[(count == "" ) ? 0 : count]["border-color"] = document.getElementById('borderColor'+category+count).value;
    } else {
       chartLabels[(count == "" ) ? 0 : count]["border-width"] = 0;
    }
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : {
        "labels":chartLabels
      }
    });
  } 
  create_json();}
function new_series() {
  var title = document.getElementById("seriesTitle");
  var series = document.getElementById("seriesConfig");
  var clonedSeries = series.cloneNode(true);
  var clonedTitle = title.cloneNode(true);
  childs = clonedSeries.childNodes;
  seriesConfigId++;
  // THis for will add id and data count,
  // In our case this will be only the tabseris div
  for (var i= 0 , len = clonedSeries.childNodes.length ; i<len; i++) {
    //We only care about the elements that has id
    if (childs[i].id) {
      childs[i].id += seriesConfigId;
      childs[i].setAttribute("data-count",seriesConfigId);
      //This one checks for the childs of the cloned node
      //it checks for the childs of tabseries div
      for (var k= 0;k<childs[i].childNodes.length;k++ ) {
          //if the child has data-category == series and it is a elemnet 
        if (childs[i].childNodes[k].nodeName != "#text") {
          if (childs[i].childNodes[k].getAttribute("data-category") == "series") {
            if (childs[i].childNodes[k].type =="label") {
              childs[i].childNodes[k].innerHTML += seriesConfigId;
            };
            childs[i].childNodes[k].setAttribute("data-count",seriesConfigId);
          };
        };
      };
    };
  }
  clonedTitle.innerHTML += seriesConfigId;
  document.querySelector("#seriesAccordion").appendChild(clonedTitle);
  document.querySelector("#seriesAccordion").appendChild(clonedSeries);
  //Refrreshing Ui toaccomedate new elemnts
  jQuery(function($) {
    $('#seriesAccordion').accordion("refresh"); 
    $("#"+childs[1].id).tabs(); 
  });
  if (seriesConfigId == 1 ) {
    var chartDta = zingchart.exec(chartID, 'getdata');
    var chartseries = chartDta['graphset'][0]['series'];
    if( typeof chartseries == "undefined") {
      var dataObj = {
        series :[]
      };
      var vals ={}
      dataObj.labels.push(vals);
      dataObj.labels.push(vals);
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj  
      });
    } else {
      var vals ={};
      chartseries.push(vals);
       zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "series" : chartseries
        }  
      });
    }

  } else {
    var chartDta = zingchart.exec(chartID, 'getdata');
    var chartseries = chartDta['graphset'][0];
    var empty ={}
    chartseries['series'].push(empty);
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : chartseries  
    });
  }
  create_json();}
var bgTypeseries= [];
function set_bg_type_series(element,category,subCategory,count) {
  count = (element.parentElement.parentElement.dataset.count != 0) ? element.parentElement.parentElement.dataset.count : ''; 
  var typeSeriesIndex = (count == "" ) ? 0 : count;
  if (count == bgTypeseries.length) {
    bgTypeseries.push(element.options[element.selectedIndex].value);
  } else {
    bgTypeseries[typeSeriesIndex] = element.options[element.selectedIndex].value;
  }
  if (bgTypeseries[typeSeriesIndex] =="gradiant") {
    element.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.visibility = "visible";
  } else {
    element.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.visibility = "hidden";
  }
  set_bg_color_series(element.nextElementSibling.nextElementSibling.nextElementSibling,category,subCategory,count);}
function set_bg_color_series(element,category,subCategory) {
  count = (element.parentElement.parentElement.dataset.count != 0) ? element.parentElement.parentElement.dataset.count : ''; 
  var typeSeriesIndex = (count == "" ) ? 0 : count;
  // Get chart JSON
  var chartDta = zingchart.exec(chartID, 'getdata');
  var chartSeries = chartDta['graphset'][0]['series']
  if (typeof chartSeries  == "undefined" ){ //Empty array situation, createing a new label
    if (category == subcategory) {
      var dataObj = {
        series :[],
      };
      var vals = {};
      if (bgTypeseries[typeSeriesIndex] == "gradiant") {
        //Set background-color-1 attr
      vals['backgroundColor1'] =  element.value;
      vals['backgroundColor2'] =  element.nextElementSibling.nextElementSibling.nextElementSibling.value;
      dataObj.labels.push (vals);
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj
      });
      } else {
      //Set background-color-1 attr
        vals['backgroundColor1'] =  element.value;
        vals['backgroundColor2'] =  element.value;
        dataObj.labels.push (vals);
        zingchart.exec(chartID,'modify', {
          graphid : 0,
          data : dataObj
        });
      }  
    } else {
      //TODO
    }

  } else {
    // We are short in series, so we have to add new sereis elment
    if (count == chartSeries.length) { 
      if (category == subCategory) {
        if (bgTypelbl[typeSeriesIndex] == "gradiant") {
          //Set background-color-1 attr
          var vals = {};
          vals['background-color-1'] =  element.value;
          vals['background-color-2'] =  element.nextElementSibling.nextElementSibling.nextElementSibling.value;
        } else {
          //Set background-color-1 attr
          vals['background-color-1'] =  element.value;
          vals['background-color-2'] =  element.value; 
        } 
      } else {
        //TODO : case that the 
      } 
      chartSeries.push (vals);
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "series":chartSeries
        }
      });
      // We are modifying the exisiting series
    } else {
      if (category == subCategory) {
        if (bgTypeseries[typeSeriesIndex] == "gradiant") {
          //Set background-color-1 attr
          chartSeries[(count == "" ) ? 0 : count]['background-color-1'] =  element.value;
          chartSeries[(count == "" ) ? 0 : count]['background-color-2'] =  element.nextElementSibling.nextElementSibling.nextElementSibling.value;
        } else {
          //Set background-color-1 attr
          chartSeries[(count == "" ) ? 0 : count]['background-color-1'] =  element.value;
          chartSeries[(count == "" ) ? 0 : count]['background-color-2'] =  element.value; 
        }
      } else {
        //If we have subcategory, then we only need to change it
        if (chartSeries[(count == "" ) ? 0 : count][subCategory]) {
          if (bgTypeseries[typeSeriesIndex] == "gradiant") {
            //Set background-color-1 attr
            chartSeries[(count == "" ) ? 0 : count][subCategory]['background-color-1'] =  element.value;
            chartSeries[(count == "" ) ? 0 : count][subCategory]['background-color-2'] =  element.nextElementSibling.nextElementSibling.nextElementSibling.value;
          } else {
            //Set background-color-1 attr
            chartSeries[(count == "" ) ? 0 : count][subCategory]['background-color-1'] =  element.value;
            chartSeries[(count == "" ) ? 0 : count][subCategory]['background-color-2'] =  element.value; 
          }
        // If we dont have the subcat, then we have to create it and assing values to it.
        } else {
          
          var data = {};
          if (bgTypeseries[typeSeriesIndex] == "gradiant") {
            //Set background-color-1 attr
            data['background-color-1'] =  element.value;
            data['background-color-2'] =  element.nextElementSibling.nextElementSibling.nextElementSibling.value;
          } else {
            //Set background-color-1 attr
            data['background-color-1'] =  element.value;
            data['background-color-2'] =  element.value; 
          }
          chartSeries[(count == "" ) ? 0 : count][subCategory]  = data;
        }
      }

      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
          "series":chartSeries
        }
      }); 
    } 
  }   
  create_json();}
function set_border_series(element,category,subCategory) {

  count = (element.parentElement.parentElement.dataset.count != 0) ? element.parentElement.parentElement.dataset.count : ''; 
  // Get chart JSON
  var chartData = zingchart.exec(chartID, 'getdata');
  var chartSeries = chartData['graphset'][0]['series']; 

  if (typeof chartSeries  == "undefined") { 
      // We are short in series we have to add one
      if (category ==  subCategory) {
        var dataObj = {
          series :[],
        };
        var vals = {};
        if (element.previousElementSibling.previousElementSibling.previousElementSibling.checked) {
          vals["border-width"] = element.value;
          vals["border-color"] = element.nextElementSibling.nextElementSibling.nextElementSibling.value;
        } else {
          vals["border-width"] = 0;
        }
        dataObj.labels.push (vals);
      } else {
        // Our category and subcategory is different
        // TODO
      }
      zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj  
      });
  } else {
    if (category == subCategory) {
      if (element.previousElementSibling.previousElementSibling.previousElementSibling.checked) {
        chartSeries[(count == "" ) ? 0 : count]["border-width"] = element.value;
        chartSeries[(count == "" ) ? 0 : count]["border-color"] = element.nextElementSibling.nextElementSibling.nextElementSibling.value;
      } else {
         chartSeries[(count == "" ) ? 0 : count]["border-width"] = 0;
      }
    } else {
      var data = {};
      chartSeries[(count == "" ) ? 0 : count][subCategory] = data;
      if (element.previousElementSibling.previousElementSibling.previousElementSibling.checked) {
        chartSeries[(count == "" ) ? 0 : count][subCategory]["border-width"] = element.value;
        chartSeries[(count == "" ) ? 0 : count][subCategory]["border-color"] = element.nextElementSibling.nextElementSibling.nextElementSibling.value;
      } else {
         chartSeries[(count == "" ) ? 0 : count][subCategory]["border-width"] = 0;
      }
    }
    zingchart.exec(chartID,'modify', {
      graphid : 0,
      data : {
        "series":chartSeries
      }
    });
  } 
  create_json();}
/*
 * series setting line
 */
function set_line_series(element,category,subCategory) {
  count = (element.parentElement.parentElement.dataset.count != 0) ? element.parentElement.parentElement.dataset.count : '';
  var chartData = zingchart.exec(chartID, 'getdata');
  var chartSeries = chartData['graphset'][0]['series']; 
  if (category != subCategory) {
    if (count == chartSeries.length ) {
      //TO DO
    } else  {
      var data = {}
      data["line-color"]        = element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value;
      data["line-style"]        = element.options[element.selectedIndex].value;
      data["line-width"]        = element.previousElementSibling.previousElementSibling.previousElementSibling.value;
      data["line-gap-size"]     = element.nextElementSibling.nextElementSibling.nextElementSibling.value;
      data["line-segment-size"] = element.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value;
      chartSeries[(count == "" ) ? 0 : count][subCategory] = data;
    }
  } else {//Same category and subcategory
    if (count == chartSeries.length ) {
      //TODO 
    } else {
       chartSeries[(count == "" ) ? 0 : count]["line-color"]        = element.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value;
       chartSeries[(count == "" ) ? 0 : count]["line-style"]        = element.options[element.selectedIndex].value;
       chartSeries[(count == "" ) ? 0 : count]["line-width"]        = element.previousElementSibling.previousElementSibling.previousElementSibling.value;
       chartSeries[(count == "" ) ? 0 : count]["line-gap-size"]     = element.nextElementSibling.nextElementSibling.nextElementSibling.value;
       chartSeries[(count == "" ) ? 0 : count]["line-segment-size"] = element.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.value;
    }
  }
  
  zingchart.exec(chartID,'modify', {
    graphid : 0,
    data : {
      "series" : chartSeries
    }
  });
  create_json();}
/*
 * Series Modify chart
 */
function modify_chart_series(element,type,key,category,subCategory) {
  count = element.parentElement.parentElement.dataset.count;
  var tempValue = '';
  switch (type) {
    case("checkbox") :
      tempValue = element.checked;
    break;
    case("select-one") :
      tempValue  = element.options[element.selectedIndex].value;
    break;
    default:
    //default is for text,range
      tempValue= element.value;
  }


  if (key == "values") {
    
    try {
      tempValue = "["+tempValue + "]";
      value = JSON.parse(tempValue);
    } catch (e) {

    }
    
  } else {
    var value = tempValue;
  }
  // Get chart JSON
  var chartDta = zingchart.exec(chartID, 'getdata');
  var chartSeries = chartDta['graphset'][0]['series']; // Ternary operator to check to see if 'labels' exists

  if (typeof chartSeries  == "undefined" ){ //Empty array situation, createing a new series
    var dataObj = {
      series :[],
    };
    var vals = {};
    vals[key] = value;
    if (category == subCategory) { // The same category part
      dataObj.series.push(vals);
    } else {
      var vals ={};
      dataObj[subCategory] = vals;
    }
    zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : dataObj  
      });
  } else { //Labels already exists, so we're modifying instead of createing 
      if (category == subCategory) {
        if (count == chartSeries.length) {//New elemnt case we have to push it 
            var vals = {};
            vals[key] = value;
            chartLabels.push(vals);
           zingchart.exec(chartID,'modify', {
            graphid : 0,
            data : {
              "series": chartSeries
            }
          });
        } else {
          chartSeries[count][key] = value;
          zingchart.exec(chartID,'modify', {
            graphid : 0,
            data : {
              "series": chartSeries
            }
          });
        }
      } else {
        if (count == chartSeries.length) {//New elemnt case we have to push it 
            var vals = {};
            vals[key] = value;
            var sub = {}
            sub[subCategory] = vals;
            chartLabels.push(sub);
            zingchart.exec(chartID,'modify', {
            graphid : 0,
            data : {
              "series": chartSeries
            }
          });
        } else {
          var vals = {};
          vals[key] = value;
          chartSeries[count][subCategory] = vals;
          zingchart.exec(chartID,'modify', {
            graphid : 0,
            data : {
              "series": chartSeries
            }
          });
        }
      }

  }
  create_json();}
function modify_chart_scale(element) {
  //This does not get at the first scale
  var category = '';
  if (element.parentElement.parentElement.dataset.category) {
    category = element.parentElement.parentElement.dataset.category
  } else {
    category = element.parentElement.dataset.category;
  }
  //Subcategories get duplicated but categories won't because of speed.
  var subCategory = element.parentElement.dataset.subCategory;
  var value = '';
  switch (element.type) {
    case("checkbox") :
      value = element.checked;
    break;
    case("select-one") :
      value  = element.options[element.selectedIndex].value;
    break;
    default:
    //default is for text,range
      value= element.value;
  }
  var chartData = zingchart.exec(chartID, 'getdata');
  if (subCategory == "scale-x" || subCategory=="scale-y") {
    if (!chartData ['graphset'][0][category]) {
      chartData ['graphset'][0][category] = {};
    }
    chartData ['graphset'][0][category][element.dataset.key] = value;
  } else {
    // This is the case that we modify the subcategory within category
    if (!chartData ['graphset'][0][category]) {
      chartData ['graphset'][0][category] = {};
    };
    if (!chartData ['graphset'][0][category][subCategory]) {
      chartData ['graphset'][0][category][subCategory] = {};
    } 
    chartData ['graphset'][0][category][subCategory][element.dataset.key] = value;
  }
  zingchart.exec(chartID,'setdata', {
          graphid : 0,
          data : chartData ['graphset'][0]
        });
  create_json();
}
function new_scale_x() {
  var clonedTitle  = document.getElementById("scaleX").cloneNode(true);
  var clonedConfig = document.getElementById("scaleX").nextElementSibling.cloneNode(true);
  scaleXCounter ++;
  clonedTitle.id  = "scaleX"+scaleXCounter;
  var scaleCategory = "scale-x-"+scaleXCounter;
  clonedTitle.innerHTML = scaleCategory;
  clonedConfig.dataset.category = scaleCategory;
  childs = clonedConfig.childNodes;
  for (var i= 0 , len = clonedConfig.childNodes.length ; i<len; i++) {
    //We only care about the elements that has id
    if (childs[i].id) {
      childs[i].id += scaleXCounter;
      childs[i].dataset.category = scaleCategory;
      childs[i].dataset.count = scaleXCounter;
      //This one checks for the childs of the cloned node
      //it checks for the childs of tabseries div
      for (var k= 0;k<childs[i].childNodes.length;k++ ) {
          //if the child has data-category == series and it is a elemnet 
        if (childs[i].childNodes[k].nodeName != "#text") {
          if (childs[i].childNodes[k].getAttribute("data-category") == "scale-x") {
            //childs[i].childNodes[k] += scaleXCounter;
            childs[i].childNodes[k].setAttribute("data-count",scaleXCounter);
          };
        };
      };
    };
  }
  clonedConfig.setAttribute("data-count",scaleXCounter);
  document.getElementById("scaleAccordion").appendChild(clonedTitle);
  document.getElementById("scaleAccordion").appendChild(clonedConfig);
  jQuery(function($) {
    $('#scaleAccordion').accordion("refresh"); 
    $("#"+childs[1].id).tabs(); 
  });
}
function new_scale_y() {
  var clonedTitle  = document.getElementById("scaleY").cloneNode(true);
  var clonedConfig = document.getElementById("scaleY").nextElementSibling.cloneNode(true);
  scaleYCounter ++;
  var scaleCategory = "scale-y-"+scaleYCounter;
  clonedTitle.innerHTML = scaleCategory;
  clonedConfig.dataset.category = scaleCategory;
  clonedTitle.id  = "scaleY"+scaleYCounter;
  childs = clonedConfig.childNodes;
  for (var i= 0 , len = clonedConfig.childNodes.length ; i<len; i++) {
    //We only care about the elements that has id
    if (childs[i].id) {
      childs[i].id += scaleYCounter;
      childs[i].dataset.category = scaleCategory;
      childs[i].dataset.count    = scaleYCounter;
      //This one checks for the childs of the cloned node
      //it checks for the childs of tabseries div
      for (var k= 0;k<childs[i].childNodes.length;k++ ) {
          //if the child has data-category == series and it is a elemnet 
        if (childs[i].childNodes[k].nodeName != "#text") {
          if (childs[i].childNodes[k].getAttribute("data-category") == "scale-y") {
            //childs[i].childNodes[k] += scaleXCounter;
            childs[i].childNodes[k].setAttribute("data-count",scaleYCounter);
          };
        };
      };
    };
  }
  clonedConfig.setAttribute("data-count",scaleYCounter);
  document.getElementById("scaleAccordion").appendChild(clonedTitle);
  document.getElementById("scaleAccordion").appendChild(clonedConfig);
  jQuery(function($) {
    $('#scaleAccordion').accordion("refresh"); 
    $("#"+childs[1].id).tabs(); 
  });
}




/*****************************************************
 *                   Legend                          *
 *****************************************************/
function set_xy_position_legend() {
  if (document.getElementById("visibleLegend").checked) {
    zingchart.exec(chartID,'modify', {
        graphid : 0,
        data : {
        legend : {
          "position" : document.getElementById('xPositionLegend').value+' '+document.getElementById('yPositionLegend').value,
        }
      }
    });
    create_json();
  };
}

/*****************************************************
 *                   Plot Area                       *
 *****************************************************/
function set_background_position_plot_area() {
  zingchart.exec(chartID,'modify', {
          graphid : 0,
          data : {
          plotarea : {
              "backgroundPosition" : document.getElementById('backgroundPositionXPlotArea').value+' '+document.getElementById('backgroundPositionYPlotArea').value
          }
        }
      });
  create_json();
}
function create_json() {
  zingchart.exec(chartID,'update');
  // At some point we have to fix this this does not work correctly
  var jsonString = JSON.stringify(zingchart.exec(chartID,'getdata' ),null,"\t");
  //if (typeof jsonString != "undefined") {
    //document.getElementById('jsonData').innerHTML = "<em>"+jsonString+"</em>";
     document.getElementById('zingcharts-javaScript').value = jsonString;
  //} else {
   // alert("Please select your chart first!!!");
  //}
}
function chartRouter() {
  var charts = document.getElementById('whichChart');
  /*document.getElementById("accordion").style.display = "block";
  document.getElementById("dataTabs").style.display = "block";
  document.getElementById("chartSelector").style.display = "none";*/
  var selectedChart = charts.options[charts.selectedIndex].value;
  if (document.getElementById('zingcharts-javaScript').value.trim() == "") {
    switch (selectedChart) {
      case 'bar' :
        chartData={
        "type": "bar",
        "series": [
        { "values": [35, 42, 67, 89, 25, 34, 67, 85 ] },
        { "values": [28, 57, 43, 56, 78, 99, 67, 28 ] }
        ]
        };
      break;
      case 'line' :
        chartData = {
        "show-progress":false,
        "graphset":[
            {
                "plot":{
                    
                },
                "type":"line",
                "series":[
                    {
                        "values":[-57,-44,-7,-17,58,-31,-81,57,28,-14,94,87,-89,-89,-20,-97,-11,44,30,-38],
                        "text":"Item 0"
                    },
                    {
                        "values":[53,42,-27,-92,6,13,60,-83,-7,-92,47,-71,32,31,-85,-86,8,-12,97,-96],
                        "text":"Item 1"
                    },
                ]
            }
        ]
        };

      break;
      case 'area':
        chartData = {
           "type":"area",
            "series":[
              {
              "values":[11,36,7,44,11,28,42,26,13,32,12,24,16,11,43,39]
              },
              {
              "values":[21,29,14,16,28,35,21,18,11,7,4,9,25,15,33,13]
            }
          ] 
        };
      break;
      case 'scatter':
        chartData = 
                    {
              "graphset":[
                  {
                      "type":"scatter",
                      "series":[
                          {
                              "values":[[1,15],
                              [2.3,4],
                              [5,10.4],
                              [6,7],
                              [3,6],
                              [7.5,15],
                              [8,2.3],
                              [.81,7],
                              [2,12.5],
                              [4.2,4],
                              [5,1],
                              [6,3],
                              [8.8,16.8]]
                          },
                          {
                              "values":[[3,5],
                              [2.3,17],
                              [8,8],
                              [6.4,12.3],
                              [4,6.6],
                              [7.2,3],
                              [2,12],
                              [1.5,4.3],
                              [6.7,2],
                              [4,10],
                              [3.4,10],
                              [6,14],
                              [2,6.7]]
                          },
                          {
                              "values":[[3,11],
                              [6.2,7.2],
                              [8,14],
                              [3,2.5],
                              [4.4,5],
                              [8,13],
                              [2,1],
                              [7.9,4.1],
                              [6,16.3],
                              [.51,8],
                              [3,6],
                              [5.7,14.8],
                              [2,2]]
                          }
                      ]   
                  }
              ]
          };
      break;
      case 'pie':
         chartData =
          {
              "graphset":[
                  {    
                      "type":"pie",
                      "series":[
                          {
                              "text":"Apples",
                              "values":[5]
                          },
                          {
                              "text":"Oranges",
                              "values":[8]
                          },
                          {
                              "text":"Bananas",
                              "values":[22]
                          },
                          {
                              "text":"Grapes",
                              "values":[16]
                          },
                          {
                              "text":"Cherries",
                              "values":[12]
                          }
                      ]
                  }
              ]
          
        };
      break;
    }
    drawChart();
  } else {
    var chartJSON = JSON.parse(document.getElementById('zingcharts-javaScript').value.trim());
    chartJSON['graphset'][0]["type"] = selectedChart;
     zingchart.exec(chartID,'setdata', {
          data : chartJSON
        });
  }
  
}

function load_attrs(element) {
  tabbed      = arguments[1] || false;
  laodTab     = arguments[2] || false;
  category    = element.dataset.category ;
  subCategory = element.dataset.subcategory;
  if(document.getElementById('zingcharts-javaScript').value.trim() != ""){
    var chartJSON = JSON.parse(document.getElementById('zingcharts-javaScript').value.trim());
    var elementsJSON = '';
    //This part only makes the scales but it does not fill them.
    if (element.dataset.category == "scale") {
      var scales = zingchart.exec(chartID,'getscales');
      for (scale in scales) {
        if (scales[scale].indexOf("scale-x") >-1 && scales[scale] != "scale-x") {
          new_scale_x();
        };
      }
    };
    //This part is for setting categories for the scale
    /*if () {
        category = element.parentElement.parentElement.parentElement.dataset.category;
    };*/
    if (element.dataset.category !== element.dataset.subcategory) {
      try {
        elementsJSON = chartJSON['graphset'][0][element.dataset.category][element.dataset.subcategory];
      } catch(e) {
        //This means we do not have that attr in our JSON
        elementsJSON = undefined;
      }
    } else {
       try {
        elementsJSON = chartJSON['graphset'][0][element.dataset.category];
      } catch(e) {
        //This means we do not have that attr in our JSON
        elementsJSON = undefined;
      }
    }
    //It should only treverse the dom and fill out things if that property actually in the liberarry
    if (typeof elementsJSON !== "undefined") {
      for(attr in elementsJSON ) {
        //This is the general case for the time that there is no tabbed attrs
        var elements ;
        if (tabbed) {
          //When it is tabbed we only load the first tab, the rest get loaded when they clicked on the tab
          elements = element.nextElementSibling.childNodes[1].childNodes[3].childNodes;
        } else if (laodTab) {
          //In the tab situation, the href part will refer to id of the div container , 
          //so we use it for accessing container
          elements =  document.getElementById(element.hash.split("#")[1]).childNodes;
        } else {
          elements = element.nextElementSibling.childNodes;
        }

        // This part is for setting bg color attrs since They will set without key
        if (attr == "background-color-1") {
          var bgEndId = '';
          if (element.dataset.category != element.dataset.subcategory) {
            bgEndId = element.dataset.category+element.dataset.subcategory;
          } else {
            bgEndId = element.dataset.category+ element.dataset.category;
          }
          if (elementsJSON[attr] != elementsJSON["background-color-2"]) {
            document.getElementById("backgroundType"+bgEndId).selectedIndex = 1;
            document.getElementById("backgroundColor1"+bgEndId).value = elementsJSON[attr];
            document.getElementById("backgroundColor2"+bgEndId).value = elementsJSON["background-color-2"];
            document.getElementById("backgroundColor2"+bgEndId).style.visibility = "visible";
            document.getElementById("backgroundColor2"+bgEndId).previousElementSibling.style.visibility = "visible";
          } else {
            //No need to set the vis here because when it gets loaded its a to hidden.
            document.getElementById("backgroundType"+bgEndId).selectedIndex = 0;
            //We have a solid bg
            document.getElementById("backgroundColor1"+bgEndId).value = elementsJSON[attr];
            document.getElementById("backgroundColor2"+bgEndId).value = elementsJSON[attr];
          }
        };
        // border check box should be cheked manually as well
        if (attr == "border-width" && elementsJSON[attr] != 0 ) {
          document.getElementById("border"+element.dataset.category+element.dataset.subcategory).checked = true;
          document.getElementById("borderWidth"+element.dataset.category+element.dataset.subcategory).value = elementsJSON[attr];
        };
        //Regardless of border witdth we will set its color if it exist
        if (attr == "border-color"  ) {
          document.getElementById("borderColor"+element.dataset.category+element.dataset.subcategory).value = elementsJSON[attr];
        };
        for(el in elements) {
          if (elements[el].nodeName != "#text") {
            // Seems that it has a problem witht the undefined keys so I used try catch for it. 
            //It may be bettter way to handle it though.
            try {
              if (elements[el].dataset.key == attr) {
                switch (elements[el].type) {
                case ("checkbox"):
                  elements[el].checked = elementsJSON[attr];
                  break;
                case("select-one") :
                  elements[el].value  = elementsJSON[attr];
                  break;
                default:
                  elements[el].value = elementsJSON[attr];
                }

              }
            } catch (e) {

            }
          }
        }
      }
    }
  }
}

function load_empty_labels() {
  if(document.getElementById('zingcharts-javaScript').value.trim() != ""){
    var chartJSON = JSON.parse(document.getElementById('zingcharts-javaScript').value);
    for(label in chartJSON['graphset'][0]["labels"] ) {
      new_label();
    }
  }
}

function load_label_data() {
  if(document.getElementById('zingcharts-javaScript').value.trim() != ""){
    var chartJSON = JSON.parse(document.getElementById('zingcharts-javaScript').value);
    for(label in chartJSON['graphset'][0]["labels"] ) {
      //new_label();
    }
  }
}

function drawChart(){
  zingchart.render({
    id:chartID,
    height:400,
    width:600,
    data:chartData
  });
};
