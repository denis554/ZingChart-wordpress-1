//THIS LOGIC WILL EVENTUALLY GETS MOVED TO SERVER SI

/*All the general form items register here*/
var formData   = [userInterface.titleData,userInterface.subtitleData,userInterface.legendDatageneral,userInterface.legendDataitem,userInterface.
legendDataMarker,userInterface.plotareaData,userInterface.plotGeneralData,userInterface.plotAnimationData,userInterface.
plotHoverState,userInterface.hoverMarker,userInterface.plotMarkerData,userInterface.tooltip,userInterface.
valueBox,userInterface.scaleData,userInterface.scaleRData,userInterface.previewData];
/*All series items register here*/
var seriesData = [userInterface.seriesGeneralData,userInterface.seriesAnimationData,userInterface.seriesHoverState,userInterface.
serieshoverMarker,userInterface.seriesMarkerData,userInterface.seriestooltip,userInterface.seriesvalueBox];
/*All scale items register here*/
var scaleData  = [userInterface.scaleX,userInterface.scaleXGuid,userInterface.scaleXLabel,userInterface.scaleXmarkers,userInterface.
scaleXrefLine,userInterface.scaleXTick,userInterface.scaleXItem,userInterface.scaleY,userInterface.scaleYGuid,userInterface.scaleYLabel,userInterface.scaleYmarkers,userInterface.
scaleYrefLine,userInterface.scaleYTick,userInterface.scaleYItem ];




window.onload =function load_inputs() {
  //If our textarea is not empty it means that we are eddititng so we can draw the chart based on that:
  if (document.getElementById("zingcharts-javaScript").value.trim() != "") {
    chartData  = JSON.parse(document.getElementById('zingcharts-javaScript').value);
    document.getElementById('whichChart').value = chartData['graphset'][0]["type"] ;
    drawChart();
  };


/* All Scale data goes here */ 

  var seriesElement = document.getElementsByClassName("scl-el");
  var linebreak = "";
  for (var i = 0; i < seriesElement.length; i++) {
    for (var m=0; m <scaleData.length;m++) {
      if (seriesElement[i].getAttribute('data-category') == scaleData[m]["category"] && seriesElement[i].getAttribute('data-sub-category') == scaleData[m]["subcategory"]) {
        for (j=0; j<scaleData[m].inputs.length; j++) {
            linebreak = scaleData[m].inputs[j].divider ? "<hr>" :" ";
            switch(scaleData[m].inputs[j].type){
            case('checkbox') :
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ scaleData[m].inputs[j].label+": </label>"
              +"<input type='checkbox' id='"+scaleData[m].inputs[j].id+"' data-category='"
              +scaleData[m]["category"]+"' data-key='"+scaleData[m].inputs[j].key+"' dat-subcat='"+
              scaleData[m].subcategory
              +"' onchange='modify_chart_scale(this)'><br>";
            break;
            case("color") :
              var defaultVal= ''; 
              if (typeof scaleData[m].inputs[j].defValue != 'undefined' &&  scaleData[m].inputs[j].defValue != '') {
                defaultVal = scaleData[m].inputs[j].defValue;
              } else {
                defaultVal = "#000000";
              }
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ scaleData[m].inputs[j].label+": </label>"
              +"<input type='color' id='"+scaleData[m].inputs[j].id+"' data-category='"
              +scaleData[m]["category"]+"' data-key='"+scaleData[m].inputs[j].key+"' dat-subcat='"+
              scaleData[m].subcategory +"' onchange='modify_chart_scale(this)' value='"+defaultVal+"'><br>";
            break;
            case("text") :
              var defaultVal= ''; 
              if (typeof scaleData[m].inputs[j].defValue != 'undefined' ) {
                defaultVal = scaleData[m].inputs[j].defValue;
              };
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ scaleData[m].inputs[j].label+": </label>"
              +"<input type='text' id='"+scaleData[m].inputs[j].id+"' data-category='"
              +scaleData[m]["category"]+"' data-key='"+scaleData[m].inputs[j].key+"' dat-subcat='"+
              scaleData[m].subcategory +"' onKeyUp='modify_chart_scale(this)' value='"+defaultVal+"'><br>";
            break;
            case ('select'):
              var options = ''
              var optionLable = '';
              for (var k=0; k<scaleData[m].inputs[j].values.length;k++) {
                if (scaleData[m].inputs[j].labels) {
                   optionLable = scaleData[m].inputs[j].labels[k];
                } else {
                  optionLable = scaleData[m].inputs[j].values[k];
                }
                options += "<option value='"+scaleData[m].inputs[j].values[k]+"'>"+optionLable +"</option>"
              };
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ scaleData[m].inputs[j].label+": </label>"
              +"<select id='"+scaleData[m].inputs[j].id+"' data-category='"+scaleData[m]["category"]
              +"' data-key='"+scaleData[m].inputs[j].key+"' dat-subcat='"+
              scaleData[m].subcategory 
              +"'onchange='modify_chart_scale(this)'><option></option> "+options+"</select><br>";
            break;
            case ("range") :
            //oninput is for IE compatibility.
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ scaleData[m].inputs[j].label+": </label>"
              +"<input type='range' id='"+scaleData[m].inputs[j].id+"' data-category='"
              +scaleData[m]["category"]+"' data-key='"+scaleData[m].inputs[j].key+"' dat-subcat='"+
              scaleData[m].subcategory
              +"' min='"+scaleData[m].inputs[j].min+"' max='"+scaleData[m].inputs[j].max+"' step='"+scaleData[m].inputs[j].step
              +"' onchange='modify_chart_scale(this)'"
              +"  oninput='modify_chart_scale(this)'><br>";
            break;
            case ("bgcolor") :
              seriesElement[i].innerHTML += linebreak +"<label> Background:</label>";//ID here represents category
              seriesElement[i].innerHTML += "<select id='backgroundType"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"+
              scaleData[m]["subcategory"]+"' data-count='"+seriesConfigId
              +"'onchange='set_bg_type_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'>"
              +"<option value='solid'>Solid</option><option value='gradiant'>Gradiant</option></select><br>"
              +"<label> Background color 1 : </label> <input type='color' id='backgroundColor1"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]
              +"' dat-subcat='"+scaleData[m]["subcategory"]
              +"' onchange='set_bg_color_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>"
              +"<label> Background color 2 : </label> <input type='color' id='backgroundColor2"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]
              +"' dat-subcat='"+scaleData[m]["subcategory"]
              +"' onchange='set_bg_color_series(this.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' style='visibility :hidden'><br>";
            break;
            case ("border") :
              seriesElement[i].innerHTML += linebreak +"<label> Border :</label>";//ID here represents category
              seriesElement[i].innerHTML += "<input type='checkbox' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"+scaleData[m]["subcategory"]+"' id='border"+scaleData[m].inputs[j].id
              +"' onchange='set_border_series(this.nextElementSibling.nextElementSibling.nextElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>";  
              seriesElement[i].innerHTML += "<label> Border width :</label><input type='text' id='borderWidth"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"
              +scaleData[m]["subcategory"]+"' onKeyUp='set_border_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='1px'><br>";
              seriesElement[i].innerHTML += " <label> Border color:</label><input type='color' id='borderColor"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"
              +scaleData[m]["subcategory"]+"'onchange='set_border_series(this.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>";
            break;
            case ("line") :
              seriesElement[i].innerHTML += linebreak + "<label>Line color :</lable>";
              seriesElement[i].innerHTML += "<input type='color' id='lineColor"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"+scaleData[m]["subcategory"]
              +"' onchange='set_line_series(this.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='#000000'><br>";
              seriesElement[i].innerHTML += "<label>Line width :</label> <input type='text' id='lineWidth"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"+scaleData[m]["subcategory"]
              +"' onKeyUp='set_line_series(this.nextElementSibling.nextElementSibling.nextElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px'><br>";
              seriesElement[i].innerHTML += "<label> Line style :</label>"
              +"<select id='lineStyle"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"+scaleData[m]["subcategory"]+"' onchange='set_line_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'>"
              +"<option></option>"
              +"<option value='solid'> Solid</option>"
              +"<option value='dotted'> Dotted</option>"
              +"<option value='dashed'> Dashed</option>"
              +"</select><br>";
              seriesElement[i].innerHTML +="<label>Line gap size :</label> <input type='text' id='lineGapSize"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"+scaleData[m]["subcategory"]
              +"' onKeyUp='set_line_series(this.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
              seriesElement[i].innerHTML +="<label>Line segment size :</label> <input type='text' id='lineSegmentSize"+scaleData[m].inputs[j].id+"' data-category ='"+scaleData[m]["category"]+"' dat-subcat='"+scaleData[m]["subcategory"]
              +"' onKeyUp='set_line_series(this.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
            break;
          };
        };
      };
    };
  };

/* ALL the series types will go here */  
  var seriesElement = document.getElementsByClassName("series-el");
  var linebreak = "";
  for (var i = 0; i < seriesElement.length; i++) {
    for (var m=0; m <seriesData.length;m++) {
      if (seriesElement[i].getAttribute('data-category') == seriesData[m]["category"] && seriesElement[i].getAttribute('data-sub-category') == seriesData[m]["subcategory"]) {
        for (j=0; j<seriesData[m].inputs.length; j++) {
            linebreak = seriesData[m].inputs[j].divider ? "<hr>" :" ";
            switch(seriesData[m].inputs[j].type){
            case('checkbox') :
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ seriesData[m].inputs[j].label+": </label>"
              +"<input type='checkbox' id='"+seriesData[m].inputs[j].id+"' data-category='"
              +seriesData[m]["category"]+"' data-key='"+seriesData[m].inputs[j].key+"' data-subcat='"+
              seriesData[m].subcategory
              +"' onchange='modify_chart_series(this, this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"data-subcat\"))'><br>";
            break;
            case("text") :
              var defaultVal= ''; 
              if (typeof seriesData[m].inputs[j].defValue != 'undefined' ) {
                defaultVal = seriesData[m].inputs[j].defValue;
              };
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ seriesData[m].inputs[j].label+": </label>"
              +"<input type='text' id='"+seriesData[m].inputs[j].id+"' data-category='"
              +seriesData[m]["category"]+"' data-key='"+seriesData[m].inputs[j].key+"' dat-subcat='"+
              seriesData[m].subcategory +"' onKeyUp='modify_chart_series(this,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='"+defaultVal+"'><br>";
            break;
            case ('select'):
              var options = ''
              var optionLable = '';
              for (var k=0; k<seriesData[m].inputs[j].values.length;k++) {
                if (seriesData[m].inputs[j].labels) {
                   optionLable = seriesData[m].inputs[j].labels[k];
                } else {
                  optionLable = seriesData[m].inputs[j].values[k];
                }
                options += "<option value='"+seriesData[m].inputs[j].values[k]+"'>"+optionLable +"</option>"
              };
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ seriesData[m].inputs[j].label+": </label>"
              +"<select id='"+seriesData[m].inputs[j].id+"' data-category='"+seriesData[m]["category"]
              +"' data-key='"+seriesData[m].inputs[j].key+"' dat-subcat='"+
              seriesData[m].subcategory 
              +"'onchange='modify_chart_series(this,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><option></option> "+options+"</select><br>";
            break;
            case ("range") :
            //oninput is for IE compatibility.
              seriesElement[i].innerHTML += linebreak
              +"<label>"+ seriesData[m].inputs[j].label+": </label>"
              +"<input type='range' id='"+seriesData[m].inputs[j].id+"' data-category='"
              +seriesData[m]["category"]+"' data-key='"+seriesData[m].inputs[j].key+"' dat-subcat='"+
              seriesData[m].subcategory
              +"' min='"+seriesData[m].inputs[j].min+"' max='"+seriesData[m].inputs[j].max+"' step='"+seriesData[m].inputs[j].step
              +"' onchange='modify_chart_series(this.id,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'"
              +"  oninput='modify_chart_series(this,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>";
            break;
            case ("bgcolor") :
              seriesElement[i].innerHTML += linebreak +"<label> Background:</label>";//ID here represents category
              seriesElement[i].innerHTML += "<select id='backgroundType"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"+
              seriesData[m]["subcategory"]+"' data-count='"+seriesConfigId
              +"'onchange='set_bg_type_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'>"
              +"<option value='solid'>Solid</option><option value='gradiant'>Gradiant</option></select><br>"
              +"<label> Background color 1 : </label> <input type='color' id='backgroundColor1"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]
              +"' dat-subcat='"+seriesData[m]["subcategory"]
              +"' data-bgtype='solid' onchange='set_bg_color_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>"
              +"<label> Background color 2 : </label> <input type='color' id='backgroundColor2"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]
              +"' dat-subcat='"+seriesData[m]["subcategory"]
              +"' onchange='set_bg_color_series(this.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' style='visibility :hidden'><br>";
            break;
            case ("border") :
              seriesElement[i].innerHTML += linebreak +"<label> Border :</label>";//ID here represents category
              seriesElement[i].innerHTML += "<input type='checkbox' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"+seriesData[m]["subcategory"]+"' id='border"+seriesData[m].inputs[j].id
              +"' onchange='set_border_series(this.nextElementSibling.nextElementSibling.nextElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>";  
              seriesElement[i].innerHTML += "<label> Border width :</label><input type='text' id='borderWidth"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"
              +seriesData[m]["subcategory"]+"' onKeyUp='set_border_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='1px'><br>";
              seriesElement[i].innerHTML += " <label> Border color:</label><input type='color' id='borderColor"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"
              +seriesData[m]["subcategory"]+"'onchange='set_border_series(this.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>";
            break;
            case ("line") :
              seriesElement[i].innerHTML += linebreak + "<label>Line color :</lable>";
              seriesElement[i].innerHTML += "<input type='color' id='lineColor"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"+seriesData[m]["subcategory"]
              +"' onchange='set_line_series(this.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='#000000'><br>";
              seriesElement[i].innerHTML += "<label>Line width :</label> <input type='text' id='lineWidth"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"+seriesData[m]["subcategory"]
              +"' onKeyUp='set_line_series(this.nextElementSibling.nextElementSibling.nextElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px'><br>";
              seriesElement[i].innerHTML += "<label> Line style :</label>"
              +"<select id='lineStyle"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"+seriesData[m]["subcategory"]+"' onchange='set_line_series(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'>"
              +"<option></option>"
              +"<option value='solid'> Solid</option>"
              +"<option value='dotted'> Dotted</option>"
              +"<option value='dashed'> Dashed</option>"
              +"</select><br>";
              seriesElement[i].innerHTML +="<label>Line gap size :</label> <input type='text' id='lineGapSize"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"+seriesData[m]["subcategory"]
              +"' onKeyUp='set_line_series(this.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
              seriesElement[i].innerHTML +="<label>Line segment size :</label> <input type='text' id='lineSegmentSize"+seriesData[m].inputs[j].id+"' data-category ='"+seriesData[m]["category"]+"' dat-subcat='"+seriesData[m]["subcategory"]
              +"' onKeyUp='set_line_series(this.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
            break;
          };
        };
      };
    };
  };

/* Lables will go here */
  var lblArrayElemnt = document.getElementsByClassName("lbl-el");
  for (var i=  0 ; i< lblArrayElemnt.length;i++) { // This should be only one
    for (var j = 0; j<userInterface.labelData.inputs.length; j++ ) {
      var linebreak = (userInterface.labelData.inputs[j].divider) ? "<hr>" : "";
      switch(userInterface.labelData.inputs[j].type){
            case('checkbox') :
              lblArrayElemnt[i].innerHTML += linebreak
              +"<label>"+ userInterface.labelData.inputs[j].label+": </label>"
              +"<input type='checkbox' id='"+userInterface.labelData.inputs[j].id+"' data-category='"
              +userInterface.labelData["category"]+"' data-key='"+userInterface.labelData.inputs[j].key+"' dat-subcat='"+
              userInterface.labelData.subcategory+"' data-count='"+labelConfigId
              +"'onchange='ZCWP.label.modify_chart_label(this.id, this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'><br>";
            break;
            case("text") :
              var defaultVal= ''; 
              if (typeof userInterface.labelData.inputs[j].defValue != 'undefined' ) {
                defaultVal = userInterface.labelData.inputs[j].defValue;
              };
              lblArrayElemnt[i].innerHTML += linebreak
              +"<label>"+ userInterface.labelData.inputs[j].label+": </label>"
              +"<input type='text' id='"+userInterface.labelData.inputs[j].id+"' data-category='"
              +userInterface.labelData["category"]+"' data-key='"+userInterface.labelData.inputs[j].key+"' dat-subcat='"+
              userInterface.labelData.subcategory+"' data-count='"+labelConfigId
              +"' onchange='ZCWP.label.modify_chart_label(this.id,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))' value='"+defaultVal+"'><br>";
            break;
             case("color") :
              var defaultVal= ''; 
              if (typeof userInterface.labelData.inputs[j].defValue != 'undefined' && userInterface.labelData.inputs[j].defValue !='') {
                defaultVal = userInterface.labelData.inputs[j].defValue;
              } else {
                defaultVal = "#000000";
              }
              lblArrayElemnt[i].innerHTML += linebreak
              +"<label>"+ userInterface.labelData.inputs[j].label+": </label>"
              +"<input type='color' id='"+userInterface.labelData.inputs[j].id+"' data-category='"
              +userInterface.labelData["category"]+"' data-key='"+userInterface.labelData.inputs[j].key+"' dat-subcat='"+
              userInterface.labelData.subcategory+"' data-count='"+labelConfigId
              +"' onchange='ZCWP.label.modify_chart_label(this.id,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))' value='"+defaultVal+"'><br>";
            break;
            case ('select'):
              var options = ''
              var optionLable = '';
              for (var k=0; k<userInterface.labelData.inputs[j].values.length;k++) {
                if (userInterface.labelData.inputs[j].labels) {
                   optionLable = userInterface.labelData.inputs[j].labels[k];
                } else {
                  optionLable = userInterface.labelData.inputs[j].values[k];
                }
                options += "<option value='"+userInterface.labelData.inputs[j].values[k]+"'>"+optionLable +"</option>"
              };
              lblArrayElemnt[i].innerHTML += linebreak
              +"<label>"+ userInterface.labelData.inputs[j].label+": </label>"
              +"<select id='"+userInterface.labelData.inputs[j].id+"' data-category='"+userInterface.labelData["category"]
              +"' data-key='"+userInterface.labelData.inputs[j].key+"' dat-subcat='"+userInterface.labelData.subcategory+"' data-count='"+labelConfigId
              +"'onchange='ZCWP.label.modify_chart_label(this.id,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'><option></option> "+options+"</select><br>";
            break;
            case ("range") :
            //oninput is for IE compatibility.
              lblArrayElemnt[i].innerHTML += linebreak
              +"<label>"+ userInterface.labelData.inputs[j].label+": </label>"
              +"<input type='range' id='"+userInterface.labelData.inputs[j].id+"' data-category='"
              +userInterface.labelData["category"]+"' data-key='"+userInterface.labelData.inputs[j].key+"' dat-subcat='"+
              userInterface.labelData.subcategory+"' min='"+userInterface.labelData.inputs[j].min+"' max='"+userInterface.labelData.inputs[j].max+"' step='"+userInterface.labelData.inputs[j].step+"' data-count='"+labelConfigId
              +"'onchange='ZCWP.label.modify_chart_label(this.id,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'"
              +"  oninput='ZCWP.label.modify_chart_label(this.id,this.type,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'><br>";
            break;
            case ("bgcolor") :
              lblArrayElemnt[i].innerHTML += linebreak +"<label> Background:</label>";
              lblArrayElemnt[i].innerHTML += "<select id='backgroundType"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' data-count='"+labelConfigId
              +"'dat-subcat='"+ userInterface.labelData["subcategory"]+"'onchange='ZCWP.label.set_bg_type_label(this.id,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'>"
              +"<option value='solid'>Solid</option><option value='gradiant'>Gradiant</option></select><br>"
              +"<label> Background color 1 : </label> <input type='color' id='backgroundColor1"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]
              +"' dat-subcat='"+userInterface.labelData["subcategory"]+"' data-count='"+labelConfigId
              +"' data-bgtype='solid' onchange='ZCWP.label.set_bg_color_label(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'><br>"
              +"<label> Background color 2 : </label> <input type='color' id='backgroundColor2"+userInterface.labelData.inputs[j].id+"' data-count='"+labelConfigId
              +"'data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"+userInterface.labelData["subcategory"]
              +"' onchange='ZCWP.label.set_bg_color_label(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))' style='visibility :hidden'><br>";
            break;
            case ("border") :
              lblArrayElemnt[i].innerHTML += linebreak +"<label> Border :</lable>";
              lblArrayElemnt[i].innerHTML += "<input type='checkbox' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"+userInterface.labelData["subcategory"]+"' id='border"+userInterface.labelData.inputs[j].id
              +"' data-count='"+labelConfigId
              +"'onchange='set_border_label(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'><br>";  
              lblArrayElemnt[i].innerHTML += "<label> Border width :</label><input type='text' id='borderWidth"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"
              +userInterface.labelData["subcategory"]+"' data-count='"+labelConfigId
              +"' oninput='set_border_label(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))' value='1px'><br>";
              lblArrayElemnt[i].innerHTML += " <label> Border color:</label><input type='color' id='borderColor"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"
              +userInterface.labelData["subcategory"]+"' data-count='"+labelConfigId
              +"'onchange='set_border_label(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"),this.getAttribute(\"data-count\"))'><br>";
            break;
            case ("line") :
              lblArrayElemnt[i].innerHTML += linebreak + "<label>Line color :</lable>";
              lblArrayElemnt[i].innerHTML += "<input type='color' id='lineColor"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"+userInterface.labelData["subcategory"]+"' onchange='set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='#000000'><br>";
              lblArrayElemnt[i].innerHTML += "<label>Line width :</lable> <input type='text' id='lineWidth"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"+userInterface.labelData["subcategory"]+"' onKeyUp='set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px'><br>";
              lblArrayElemnt[i].innerHTML += "<lable> Line style :</lable>"
              +"<select id='lineStyle"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"+userInterface.labelData["subcategory"]+"' onchange='set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'>"
              +"<option></option>"
              +"<option value='solid'> Solid</option>"
              +"<option value='dotted'> Dotted</option>"
              +"<option value='dashed'> Dashed</option>"
              +"</select><br>";
              lblArrayElemnt[i].innerHTML +="<label>Line gap size :</lable> <input type='text' id='lineGapSize"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"+userInterface.labelData["subcategory"]+"' onKeyUp='set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
              lblArrayElemnt[i].innerHTML +="<label>Line segment size :</lable> <input type='text' id='lineSegmentSize"+userInterface.labelData.inputs[j].id+"' data-category ='"+userInterface.labelData["category"]+"' dat-subcat='"+userInterface.labelData["subcategory"]+"' onKeyUp='set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
            break;
          };
      
    };

  }

/* ALL the generic types will go here */  
  var element = document.getElementsByClassName("frm-el");
  var linebreak = "";
  for (var i = 0; i < element.length; i++) {
    for (var m=0; m <formData.length;m++) {
      if (element[i].getAttribute('data-category') == formData[m]["category"] 
        && element[i].getAttribute('data-sub-category') 
        == formData[m]["subcategory"]) {
        for (j=0; j<formData[m].inputs.length; j++) {
            linebreak = formData[m].inputs[j].divider ? "<hr>" :" ";
            switch(formData[m].inputs[j].type){
            case("color") :
              var defaultVal= '';
              if (typeof userInterface.labelData.inputs[j].defValue != 'undefined' && userInterface.labelData.inputs[j].defValue !='') {
                defaultVal = userInterface.labelData.inputs[j].defValue;
              } else {
                defaultVal = "#000000";
              } 
              element[i].innerHTML += linebreak
              +"<label>"+ formData[m].inputs[j].label+": </label>"
              +"<input type='color' id='"+formData[m].inputs[j].id+"' data-category='"
              +formData[m]["category"]+"' data-key='"+formData[m].inputs[j].key+"' dat-subcat='"+
              formData[m].subcategory +"' onchange='ZCWP.general.modify_chart(this,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='"+defaultVal+"'><br>";
            break;
            case('checkbox') :
              element[i].innerHTML += linebreak
              +"<label>"+ formData[m].inputs[j].label+": </label>"
              +"<input type='checkbox' id='"+formData[m].inputs[j].id+"' data-category='"
              +formData[m]["category"]+"' data-key='"+formData[m].inputs[j].key+"' dat-subcat='"+
              formData[m].subcategory
              +"' onchange='ZCWP.general.modify_chart(this,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>";
            break;
            case("text") :
              var defaultVal= ''; 
              if (typeof formData[m].inputs[j].defValue != 'undefined' ) {
                defaultVal = formData[m].inputs[j].defValue;
              };
              element[i].innerHTML += linebreak
              +"<label>"+ formData[m].inputs[j].label+": </label>"
              +"<input type='text' id='"+formData[m].inputs[j].id+"' data-category='"
              +formData[m]["category"]+"' data-key='"+formData[m].inputs[j].key+"' dat-subcat='"+
              formData[m].subcategory
              +"'onKeyUp='ZCWP.general.modify_chart(this,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='"+defaultVal+"'><br>";
            break;
            case ('select'):
              var options = ''
              var optionLable = '';
              for (var k=0; k<formData[m].inputs[j].values.length;k++) {
                if (formData[m].inputs[j].labels) {
                   optionLable = formData[m].inputs[j].labels[k];
                } else {
                  optionLable = formData[m].inputs[j].values[k];
                }
                options += "<option value='"+formData[m].inputs[j].values[k]+"'>"+optionLable +"</option>"
              };
              element[i].innerHTML += linebreak
              +"<label>"+ formData[m].inputs[j].label+": </label>"
              +"<select id='"+formData[m].inputs[j].id+"' data-category='"+formData[m]["category"]
              +"' data-key='"+formData[m].inputs[j].key+"' dat-subcat='"+
              formData[m].subcategory
              +"'onchange='ZCWP.general.modify_chart(this,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><option></option> "+options+"</select><br>";
            break;
            case ("range") :
            //oninput is for IE compatibility.
              element[i].innerHTML += linebreak
              +"<label>"+ formData[m].inputs[j].label+": </label>"
              +"<input type='range' id='"+formData[m].inputs[j].id+"' data-category='"
              +formData[m]["category"]+"' data-key='"+formData[m].inputs[j].key+"' dat-subcat='"+
              formData[m].subcategory
              +"' min='"+formData[m].inputs[j].min+"' max='"+formData[m].inputs[j].max+"' step='"+formData[m].inputs[j].step
              +"' onchange='ZCWP.general.modify_chart(this,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'"
              +"  oninput='ZCWP.general.modify_chart(this,this.getAttribute(\"data-key\"),this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>";
            break;
            case ("bgcolor") :
              element[i].innerHTML += linebreak +"<label> Background :</label>";//ID here represents category
              element[i].innerHTML += "<select id='backgroundType"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]+"' dat-subcat='"+
              formData[m]["subcategory"]+"'onchange='ZCWP.general.set_bg_type(this,this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'>"
              +"<option value='solid'>Solid</option><option value='gradiant'>Gradiant</option></select><br>"
              +"<label> Background color 1 : </label> <input type='color' id='backgroundColor1"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]
              +"' dat-subcat='"+formData[m]["subcategory"]+"' data-bgtype='solid' onchange='ZCWP.general.set_bg_color(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'><br>"
              +"<label style='visibility :hidden'> Background color 2 : </label> <input type='color' id='backgroundColor2"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]
              +"' dat-subcat='"+formData[m]["subcategory"]+"' onchange='ZCWP.general.set_bg_color(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' style='visibility :hidden'><br>";
            break;
            case ("line") :
              element[i].innerHTML += linebreak + "<label>Line color :</lable>";
              element[i].innerHTML += "<input type='color' id='lineColor"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]+"' dat-subcat='"+formData[m]["subcategory"]+"' onchange='ZCWP.general.set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='#000000'><br>";
              element[i].innerHTML += "<label>Line width :</lable> <input type='text' id='lineWidth"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]+"' dat-subcat='"+formData[m]["subcategory"]+"' onKeyUp='ZCWP.general.set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px'><br>";
              element[i].innerHTML += "<lable> Line style :</lable>"
              +"<select id='lineStyle"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]+"' dat-subcat='"+formData[m]["subcategory"]+"' onchange='ZCWP.general.set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))'>"
              +"<option></option>"
              +"<option value='solid'> Solid</option>"
              +"<option value='dotted'> Dotted</option>"
              +"<option value='dashed'> Dashed</option>"
              +"</select><br>";
              element[i].innerHTML +="<label>Line gap size :</lable> <input type='text' id='lineGapSize"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]+"' dat-subcat='"+formData[m]["subcategory"]+"' onKeyUp='ZCWP.general.set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
              element[i].innerHTML +="<label>Line segment size :</lable> <input type='text' id='lineSegmentSize"+formData[m].inputs[j].id+"' data-category ='"+formData[m]["category"]+"' dat-subcat='"+formData[m]["subcategory"]+"' onKeyUp='ZCWP.general.set_line(this.getAttribute(\"data-category\"),this.getAttribute(\"dat-subcat\"))' value='2px' ><br>";
            break;
          };
        };
      };
    };
  };
};




